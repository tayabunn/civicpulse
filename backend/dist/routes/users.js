"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../lib/auth");
const auth_2 = require("../middleware/auth");
const audit_1 = require("../lib/audit");
const router = (0, express_1.Router)();
// 1. GET /api/users - List users with optional role & search filters (Admin & Dept Manager only)
router.get('/', auth_2.authenticateToken, (0, auth_2.authorizeRole)(['admin', 'department_manager']), async (req, res) => {
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
// 2. GET /api/users/audit-logs - Immutable Security Audit Log Feed (Admin Only)
router.get('/audit-logs', auth_2.authenticateToken, (0, auth_2.authorizeRole)(['admin']), async (req, res) => {
    try {
        const logs = await db_1.db
            .select()
            .from(schema_1.auditLogs)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt))
            .limit(100);
        return res.json({ success: true, logs, total: logs.length });
    }
    catch (error) {
        console.error('Fetch audit logs error:', error);
        return res.status(500).json({ error: 'Failed to retrieve audit logs' });
    }
});
// 3. POST /api/users - Create user (Admin control with audit log)
router.post('/', auth_2.authenticateToken, (0, auth_2.authorizeRole)(['admin']), async (req, res) => {
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
        await (0, audit_1.logSecurityAudit)(req, {
            action: 'USER_CREATED',
            resource: 'users',
            resourceId: newUser.id,
            details: { email: newUser.email, role: newUser.role, departmentId: newUser.departmentId },
        });
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
// 4. PATCH /api/users/:id - Update user role & department permissions (Admin control with audit log)
router.patch('/:id', auth_2.authenticateToken, (0, auth_2.authorizeRole)(['admin']), async (req, res) => {
    try {
        const id = req.params.id;
        const { role, departmentId, name, phone } = req.body;
        const [current] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).limit(1);
        if (!current) {
            return res.status(404).json({ error: 'User not found' });
        }
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
        await (0, audit_1.logSecurityAudit)(req, {
            action: 'USER_ROLE_OR_DEPT_MODIFIED',
            resource: 'users',
            resourceId: updated.id,
            details: {
                targetEmail: updated.email,
                previousRole: current.role,
                newRole: updated.role,
                previousDept: current.departmentId,
                newDept: updated.departmentId,
            },
        });
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
// 5. DELETE /api/users/:id - Remove user (Admin control with prevention of self-deletion)
router.delete('/:id', auth_2.authenticateToken, (0, auth_2.authorizeRole)(['admin']), async (req, res) => {
    try {
        const id = req.params.id;
        if (req.user?.id === id) {
            return res.status(400).json({ error: 'Security constraint: Cannot delete your own administrative account' });
        }
        const [target] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).limit(1);
        if (!target) {
            return res.status(404).json({ error: 'User not found' });
        }
        await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        await (0, audit_1.logSecurityAudit)(req, {
            action: 'USER_DELETED',
            resource: 'users',
            resourceId: id,
            details: { deletedEmail: target.email, deletedRole: target.role },
        });
        return res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.default = router;
