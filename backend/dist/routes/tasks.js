"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const issue_service_1 = require("../lib/issue-service");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const conditions = [];
        if (user.role === 'maintenance_staff') {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.staffId, user.id));
        }
        const tasks = await db_1.db
            .select({
            id: schema_1.maintenanceTasks.id,
            issueId: schema_1.maintenanceTasks.issueId,
            staffId: schema_1.maintenanceTasks.staffId,
            status: schema_1.maintenanceTasks.status,
            fieldNotes: schema_1.maintenanceTasks.fieldNotes,
            proofImageUrl: schema_1.maintenanceTasks.proofImageUrl,
            assignedAt: schema_1.maintenanceTasks.assignedAt,
            startedAt: schema_1.maintenanceTasks.startedAt,
            completedAt: schema_1.maintenanceTasks.completedAt,
            issueTitle: schema_1.issues.title,
            issueCategory: schema_1.issues.category,
            issuePriority: schema_1.issues.priority,
            issueAddress: schema_1.issues.address,
            issueLatitude: schema_1.issues.latitude,
            issueLongitude: schema_1.issues.longitude,
            staffName: schema_1.users.name,
        })
            .from(schema_1.maintenanceTasks)
            .leftJoin(schema_1.issues, (0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.issueId, schema_1.issues.id))
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.staffId, schema_1.users.id))
            .where(conditions.length > 0 ? conditions[0] : undefined)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.maintenanceTasks.assignedAt));
        return res.json({ tasks });
    }
    catch (error) {
        console.error('List tasks error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const { status, fieldNotes, proofImageUrl } = req.body;
        const [currentTask] = await db_1.db
            .select()
            .from(schema_1.maintenanceTasks)
            .where((0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.id, id))
            .limit(1);
        if (!currentTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (user.role === 'maintenance_staff' && currentTask.staffId !== user.id) {
            return res.status(403).json({ error: 'Not authorized for this task' });
        }
        const updates = {};
        if (status)
            updates.status = status;
        if (fieldNotes)
            updates.fieldNotes = fieldNotes;
        if (proofImageUrl)
            updates.proofImageUrl = proofImageUrl;
        if (status === 'in_progress' && !currentTask.startedAt) {
            updates.startedAt = new Date();
            await db_1.db
                .update(schema_1.issues)
                .set({ status: 'in_progress', updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.issues.id, currentTask.issueId));
            await (0, issue_service_1.logIssueActivity)({
                issueId: currentTask.issueId,
                userId: user.id,
                action: 'STATUS_CHANGE_TO_IN_PROGRESS',
                previousStatus: 'assigned',
                newStatus: 'in_progress',
                notes: fieldNotes || 'Field maintenance work started by staff.',
            });
        }
        if (status === 'completed') {
            updates.completedAt = new Date();
            await db_1.db
                .update(schema_1.issues)
                .set({ status: 'resolved', resolvedAt: new Date(), updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.issues.id, currentTask.issueId));
            await (0, issue_service_1.logIssueActivity)({
                issueId: currentTask.issueId,
                userId: user.id,
                action: 'STATUS_CHANGE_TO_RESOLVED',
                previousStatus: 'in_progress',
                newStatus: 'resolved',
                notes: fieldNotes || 'Maintenance completed and proof photograph uploaded.',
                attachmentUrl: proofImageUrl,
            });
        }
        const [updatedTask] = await db_1.db
            .update(schema_1.maintenanceTasks)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.id, id))
            .returning();
        return res.json({ success: true, task: updatedTask });
    }
    catch (error) {
        console.error('Update task error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
