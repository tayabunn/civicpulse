"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../lib/auth");
const validation_1 = require("../lib/validation");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const parsed = validation_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const { email, password } = parsed.data;
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch = await (0, auth_1.verifyPassword)(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const sessionUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            departmentId: user.departmentId,
        };
        const token = await (0, auth_1.createSessionToken)(sessionUser);
        res.cookie('civicpulse_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true, user: sessionUser, token });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/register', async (req, res) => {
    try {
        const parsed = validation_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const { name, email, password, phone, role, departmentId } = parsed.data;
        const [existing] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const passwordHash = await (0, auth_1.hashPassword)(password);
        const [newUser] = await db_1.db
            .insert(schema_1.users)
            .values({
            name,
            email,
            passwordHash,
            phone,
            role: role || 'citizen',
            departmentId,
        })
            .returning();
        const sessionUser = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            departmentId: newUser.departmentId,
        };
        const token = await (0, auth_1.createSessionToken)(sessionUser);
        res.cookie('civicpulse_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ success: true, user: sessionUser, token });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/google', async (req, res) => {
    try {
        const { email, name, avatarUrl } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        let [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (!user) {
            const randomPassword = crypto_1.default.randomUUID();
            const passwordHash = await (0, auth_1.hashPassword)(randomPassword);
            [user] = await db_1.db
                .insert(schema_1.users)
                .values({
                name: name || email.split('@')[0],
                email,
                passwordHash,
                avatarUrl: avatarUrl || undefined,
                role: 'citizen',
            })
                .returning();
        }
        const sessionUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            departmentId: user.departmentId,
            avatarUrl: user.avatarUrl,
        };
        const token = await (0, auth_1.createSessionToken)(sessionUser);
        res.cookie('civicpulse_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true, user: sessionUser, token });
    }
    catch (error) {
        console.error('Google auth error:', error);
        return res.status(500).json({ error: 'Failed to process Google authentication' });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('civicpulse_session', { path: '/' });
    return res.json({ success: true, message: 'Logged out successfully' });
});
router.get('/me', auth_2.authenticateToken, (req, res) => {
    return res.json({ user: req.user });
});
router.patch('/profile', async (req, res) => {
    try {
        const { id, name, phone, avatarUrl } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const updates = {
            updatedAt: new Date(),
        };
        if (name)
            updates.name = name;
        if (phone !== undefined)
            updates.phone = phone;
        if (avatarUrl !== undefined)
            updates.avatarUrl = avatarUrl;
        const [updated] = await db_1.db
            .update(schema_1.users)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            success: true,
            user: {
                id: updated.id,
                email: updated.email,
                name: updated.name,
                role: updated.role,
                departmentId: updated.departmentId,
                phone: updated.phone,
                avatarUrl: updated.avatarUrl,
            },
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Failed to update user profile' });
    }
});
router.patch('/password', async (req, res) => {
    try {
        const { id, currentPassword, newPassword } = req.body;
        if (!id || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'ID, current password, and new password are required' });
        }
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).limit(1);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await (0, auth_1.verifyPassword)(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password does not match' });
        }
        const newHash = await (0, auth_1.hashPassword)(newPassword);
        await db_1.db
            .update(schema_1.users)
            .set({ passwordHash: newHash, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({ error: 'Failed to update password' });
    }
});
exports.default = router;
