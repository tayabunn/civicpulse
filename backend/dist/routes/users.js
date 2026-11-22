"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
// 1. GET /api/users - List users with optional role & search filters
router.get('/', async (req, res) => {
    try {
        const roleFilter = req.query.role;
        const search = req.query.search;
        let query = db_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            departmentId: schema_1.users.departmentId,
            phone: schema_1.users.phone,
            avatarUrl: schema_1.users.avatarUrl,
            createdAt: schema_1.users.createdAt,
            updatedAt: schema_1.users.updatedAt,
            departmentName: schema_1.departments.name,
            departmentCode: schema_1.departments.code,
        })
            .from(schema_1.users)
            .leftJoin(schema_1.departments, (0, drizzle_orm_1.eq)(schema_1.users.departmentId, schema_1.departments.id));
        const allUsers = await query;
        let filtered = allUsers;
        if (roleFilter) {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter((u) => u.name.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                (u.departmentName && u.departmentName.toLowerCase().includes(s)));
        }
        return res.json({ users: filtered, total: filtered.length });
    }
    catch (error) {
        console.error('List users error:', error);
        return res.status(500).json({ error: 'Failed to retrieve users' });
    }
});
// 2. POST /api/users - Create user (Admin control)
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, departmentId, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const [existing] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (existing) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        const passwordHash = await (0, auth_1.hashPassword)(password);
        const [newUser] = await db_1.db
            .insert(schema_1.users)
            .values({
            name,
            email,
            passwordHash,
            role: role || 'citizen',
            departmentId: departmentId || null,
            phone: phone || null,
        })
            .returning();
        return res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                departmentId: newUser.departmentId,
            },
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
});
// 3. PATCH /api/users/:id - Update user role & department permissions
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { role, departmentId, name, phone } = req.body;
        const updates = {
            updatedAt: new Date(),
        };
        if (role !== undefined)
            updates.role = role;
        if (departmentId !== undefined)
            updates.departmentId = departmentId;
        if (name !== undefined)
            updates.name = name;
        if (phone !== undefined)
            updates.phone = phone;
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
                name: updated.name,
                email: updated.email,
                role: updated.role,
                departmentId: updated.departmentId,
            },
        });
    }
    catch (error) {
        console.error('Update user role error:', error);
        return res.status(500).json({ error: 'Failed to update user' });
    }
});
// 4. DELETE /api/users/:id - Remove user
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.default = router;
