"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const list = await db_1.db
            .select({
            id: schema_1.departments.id,
            name: schema_1.departments.name,
            code: schema_1.departments.code,
            description: schema_1.departments.description,
            isActive: schema_1.departments.isActive,
            managerId: schema_1.departments.managerId,
            createdAt: schema_1.departments.createdAt,
            managerName: schema_1.users.name,
            managerEmail: schema_1.users.email,
        })
            .from(schema_1.departments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.departments.managerId, schema_1.users.id));
        const deptsWithStats = await Promise.all(list.map(async (dept) => {
            const staffMembers = await db_1.db
                .select({ id: schema_1.users.id })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.departmentId, dept.id));
            const deptIssues = await db_1.db
                .select({ status: schema_1.issues.status })
                .from(schema_1.issues)
                .where((0, drizzle_orm_1.eq)(schema_1.issues.departmentId, dept.id));
            return {
                ...dept,
                staffCount: staffMembers.length,
                totalIssues: deptIssues.length,
                activeIssues: deptIssues.filter((i) => ['submitted', 'under_review', 'assigned', 'in_progress'].includes(i.status)).length,
            };
        }));
        return res.json({ departments: deptsWithStats });
    }
    catch (error) {
        console.error('List departments error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, code, description, managerId } = req.body;
        if (!name || !code) {
            return res.status(400).json({ error: 'Name and Code are required' });
        }
        const [newDept] = await db_1.db
            .insert(schema_1.departments)
            .values({ name, code, description, managerId })
            .returning();
        return res.status(201).json({ success: true, department: newDept });
    }
    catch (error) {
        console.error('Create department error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, managerId, isActive } = req.body;
        const updates = {
            updatedAt: new Date(),
        };
        if (name !== undefined)
            updates.name = name;
        if (description !== undefined)
            updates.description = description;
        if (managerId !== undefined)
            updates.managerId = managerId;
        if (isActive !== undefined)
            updates.isActive = isActive;
        const [updated] = await db_1.db
            .update(schema_1.departments)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.departments.id, id))
            .returning();
        return res.json({ success: true, department: updated });
    }
    catch (error) {
        console.error('Update department error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
