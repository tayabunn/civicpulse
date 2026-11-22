"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const validation_1 = require("../lib/validation");
const auth_1 = require("../middleware/auth");
const issue_service_1 = require("../lib/issue-service");
const router = (0, express_1.Router)();
// GET /api/issues with filters, pagination, search, and nearby duplicate radius check
router.get('/', async (req, res) => {
    try {
        const parsed = validation_1.issueFilterSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const { q, category, status, priority, departmentId, startDate, endDate, page = 1, limit = 10, sort = 'createdAt', order = 'desc', lat, lng, radius = 50, } = parsed.data;
        const conditions = [];
        if (q) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.issues.title, `%${q}%`), (0, drizzle_orm_1.ilike)(schema_1.issues.description, `%${q}%`), (0, drizzle_orm_1.ilike)(schema_1.issues.address, `%${q}%`)));
        }
        if (category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.issues.category, category));
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.issues.status, status));
        }
        if (priority) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.issues.priority, priority));
        }
        if (departmentId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.issues.departmentId, departmentId));
        }
        if (startDate) {
            const parsedStart = new Date(startDate);
            if (!isNaN(parsedStart.getTime())) {
                conditions.push((0, drizzle_orm_1.gte)(schema_1.issues.createdAt, parsedStart));
            }
        }
        if (endDate) {
            const parsedEnd = new Date(endDate);
            if (!isNaN(parsedEnd.getTime())) {
                parsedEnd.setHours(23, 59, 59, 999);
                conditions.push((0, drizzle_orm_1.lte)(schema_1.issues.createdAt, parsedEnd));
            }
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        // Check for nearby duplicates
        if (lat !== undefined && lng !== undefined && category) {
            const candidates = await db_1.db
                .select({
                id: schema_1.issues.id,
                title: schema_1.issues.title,
                category: schema_1.issues.category,
                latitude: schema_1.issues.latitude,
                longitude: schema_1.issues.longitude,
                status: schema_1.issues.status,
                address: schema_1.issues.address,
            })
                .from(schema_1.issues)
                .where((0, drizzle_orm_1.eq)(schema_1.issues.category, category));
            const duplicate = (0, issue_service_1.findNearbyDuplicate)(lat, lng, category, candidates, radius);
            if (duplicate) {
                return res.json({ duplicateFound: true, duplicate });
            }
        }
        const [countResult] = await db_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(schema_1.issues).where(whereClause);
        const total = Number(countResult?.total || 0);
        let sortColumn = schema_1.issues.createdAt;
        if (sort === 'priority')
            sortColumn = schema_1.issues.priority;
        else if (sort === 'status')
            sortColumn = schema_1.issues.status;
        else if (sort === 'title')
            sortColumn = schema_1.issues.title;
        else if (sort === 'category')
            sortColumn = schema_1.issues.category;
        else if (sort === 'updatedAt')
            sortColumn = schema_1.issues.updatedAt;
        const sortOrder = order === 'asc' ? (0, drizzle_orm_1.asc)(sortColumn) : (0, drizzle_orm_1.desc)(sortColumn);
        const offset = (page - 1) * limit;
        const items = await db_1.db
            .select({
            id: schema_1.issues.id,
            title: schema_1.issues.title,
            description: schema_1.issues.description,
            category: schema_1.issues.category,
            status: schema_1.issues.status,
            priority: schema_1.issues.priority,
            latitude: schema_1.issues.latitude,
            longitude: schema_1.issues.longitude,
            address: schema_1.issues.address,
            imageUrl: schema_1.issues.imageUrl,
            reporterId: schema_1.issues.reporterId,
            departmentId: schema_1.issues.departmentId,
            assignedStaffId: schema_1.issues.assignedStaffId,
            duplicateOfId: schema_1.issues.duplicateOfId,
            feedbackRating: schema_1.issues.feedbackRating,
            feedbackComment: schema_1.issues.feedbackComment,
            createdAt: schema_1.issues.createdAt,
            updatedAt: schema_1.issues.updatedAt,
            resolvedAt: schema_1.issues.resolvedAt,
            departmentName: schema_1.departments.name,
            reporterName: schema_1.users.name,
        })
            .from(schema_1.issues)
            .leftJoin(schema_1.departments, (0, drizzle_orm_1.eq)(schema_1.issues.departmentId, schema_1.departments.id))
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.issues.reporterId, schema_1.users.id))
            .where(whereClause)
            .orderBy(sortOrder)
            .limit(limit)
            .offset(offset);
        return res.json({
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error('List issues error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/issues to create an issue
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const parsed = validation_1.createIssueSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }
        const { title, description, category, priority, latitude, longitude, address, imageUrl } = parsed.data;
        const departmentId = await (0, issue_service_1.resolveDepartmentForCategory)(category);
        const [newIssue] = await db_1.db
            .insert(schema_1.issues)
            .values({
            title,
            description,
            category,
            priority: priority || 'medium',
            status: 'submitted',
            latitude,
            longitude,
            address,
            imageUrl,
            reporterId: user.id,
            departmentId: departmentId || undefined,
        })
            .returning();
        await (0, issue_service_1.logIssueActivity)({
            issueId: newIssue.id,
            userId: user.id,
            action: 'SUBMITTED',
            newStatus: 'submitted',
            notes: `Reported by ${user.name} via Citizen Portal.`,
        });
        return res.status(201).json({ success: true, issue: newIssue });
    }
    catch (error) {
        console.error('Create issue error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/issues/:id details with audit trail
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [issue] = await db_1.db
            .select({
            id: schema_1.issues.id,
            title: schema_1.issues.title,
            description: schema_1.issues.description,
            category: schema_1.issues.category,
            status: schema_1.issues.status,
            priority: schema_1.issues.priority,
            latitude: schema_1.issues.latitude,
            longitude: schema_1.issues.longitude,
            address: schema_1.issues.address,
            imageUrl: schema_1.issues.imageUrl,
            reporterId: schema_1.issues.reporterId,
            departmentId: schema_1.issues.departmentId,
            assignedStaffId: schema_1.issues.assignedStaffId,
            duplicateOfId: schema_1.issues.duplicateOfId,
            feedbackRating: schema_1.issues.feedbackRating,
            feedbackComment: schema_1.issues.feedbackComment,
            createdAt: schema_1.issues.createdAt,
            updatedAt: schema_1.issues.updatedAt,
            resolvedAt: schema_1.issues.resolvedAt,
            departmentName: schema_1.departments.name,
            reporterName: schema_1.users.name,
        })
            .from(schema_1.issues)
            .leftJoin(schema_1.departments, (0, drizzle_orm_1.eq)(schema_1.issues.departmentId, schema_1.departments.id))
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.issues.reporterId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.issues.id, id))
            .limit(1);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        const activities = await db_1.db
            .select({
            id: schema_1.issueActivities.id,
            action: schema_1.issueActivities.action,
            previousStatus: schema_1.issueActivities.previousStatus,
            newStatus: schema_1.issueActivities.newStatus,
            notes: schema_1.issueActivities.notes,
            attachmentUrl: schema_1.issueActivities.attachmentUrl,
            createdAt: schema_1.issueActivities.createdAt,
            userName: schema_1.users.name,
            userRole: schema_1.users.role,
        })
            .from(schema_1.issueActivities)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.issueActivities.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.issueActivities.issueId, id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.issueActivities.createdAt));
        const tasks = await db_1.db
            .select({
            id: schema_1.maintenanceTasks.id,
            status: schema_1.maintenanceTasks.status,
            fieldNotes: schema_1.maintenanceTasks.fieldNotes,
            proofImageUrl: schema_1.maintenanceTasks.proofImageUrl,
            assignedAt: schema_1.maintenanceTasks.assignedAt,
            startedAt: schema_1.maintenanceTasks.startedAt,
            completedAt: schema_1.maintenanceTasks.completedAt,
            staffName: schema_1.users.name,
        })
            .from(schema_1.maintenanceTasks)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.staffId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.maintenanceTasks.issueId, id));
        return res.json({ issue, activities, tasks });
    }
    catch (error) {
        console.error('Get issue details error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT /api/issues/:id (Citizens can update their own reported issue before triage)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const { title, description, address, imageUrl } = req.body;
        const [current] = await db_1.db.select().from(schema_1.issues).where((0, drizzle_orm_1.eq)(schema_1.issues.id, id)).limit(1);
        if (!current) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        // Citizens can only manage their own reports
        if (user.role === 'citizen') {
            if (current.reporterId !== user.id) {
                return res.status(403).json({ error: 'Forbidden: Citizens can only manage their own reports' });
            }
            if (current.status !== 'submitted') {
                return res.status(400).json({ error: 'Issue has already entered triage and cannot be edited by citizen' });
            }
        }
        else if (user.role !== 'admin' && user.role !== 'department_manager') {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions to edit issue details' });
        }
        const updates = {
            updatedAt: new Date(),
        };
        if (title)
            updates.title = title;
        if (description)
            updates.description = description;
        if (address)
            updates.address = address;
        if (imageUrl !== undefined)
            updates.imageUrl = imageUrl;
        const [updated] = await db_1.db.update(schema_1.issues).set(updates).where((0, drizzle_orm_1.eq)(schema_1.issues.id, id)).returning();
        await (0, issue_service_1.logIssueActivity)({
            issueId: id,
            userId: user.id,
            action: 'ISSUE_DETAILS_UPDATED',
            previousStatus: current.status,
            newStatus: current.status,
            notes: `Details edited by reporter (${user.name}).`,
        });
        return res.json({ success: true, issue: updated });
    }
    catch (error) {
        console.error('Update issue details error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /api/issues/:id (Citizens can cancel their own report before triage)
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const [current] = await db_1.db.select().from(schema_1.issues).where((0, drizzle_orm_1.eq)(schema_1.issues.id, id)).limit(1);
        if (!current) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        if (user.role === 'citizen') {
            if (current.reporterId !== user.id) {
                return res.status(403).json({ error: 'Forbidden: Citizens can only manage their own reports' });
            }
            if (current.status !== 'submitted') {
                return res.status(400).json({ error: 'Cannot cancel an issue that has already entered triage' });
            }
        }
        else if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only the reporting citizen or an administrator can remove a report' });
        }
        // Preserve history by logging cancellation before closure
        await (0, issue_service_1.logIssueActivity)({
            issueId: id,
            userId: user.id,
            action: 'REPORT_CANCELLED_BY_REPORTER',
            previousStatus: current.status,
            newStatus: 'closed',
            notes: `Report retracted/cancelled by reporter ${user.name}.`,
        });
        const [closedIssue] = await db_1.db
            .update(schema_1.issues)
            .set({ status: 'closed', updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.id, id))
            .returning();
        return res.json({ success: true, message: 'Issue cancelled successfully', issue: closedIssue });
    }
    catch (error) {
        console.error('Delete issue error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// PATCH /api/issues/:id/status (Strict Server-Side Lifecycle & Role-Based Authorization)
router.patch('/:id/status', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const { status, priority, departmentId, assignedStaffId, duplicateOfId, notes } = req.body;
        const [current] = await db_1.db.select().from(schema_1.issues).where((0, drizzle_orm_1.eq)(schema_1.issues.id, id)).limit(1);
        if (!current) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        // 1. Citizens cannot modify issue status
        if (user.role === 'citizen') {
            return res.status(403).json({ error: 'Forbidden: Citizens cannot modify issue status' });
        }
        // 2. Unauthorized users must not modify issue status
        if (!(0, validation_1.canUserChangeIssueStatus)(user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions to change issue status' });
        }
        // 3. Maintenance staff can only update assigned tasks
        if (user.role === 'maintenance_staff') {
            if (current.assignedStaffId !== user.id) {
                return res.status(403).json({ error: 'Forbidden: Maintenance staff can only update tasks assigned to them' });
            }
            if (status && !['in_progress', 'resolved'].includes(status)) {
                return res.status(403).json({
                    error: 'Forbidden: Maintenance staff can only transition issues to In Progress or Resolved',
                });
            }
        }
        // 4. Department managers can only manage their own department's issues
        if (user.role === 'department_manager') {
            if (user.departmentId && current.departmentId && current.departmentId !== user.departmentId) {
                return res.status(403).json({
                    error: "Forbidden: Department managers can only manage issues within their own department",
                });
            }
        }
        // 5. Only authorized users can verify reports (under_review)
        if (status === 'under_review' && !(0, validation_1.canUserVerifyReport)(user.role)) {
            return res.status(403).json({
                error: 'Forbidden: Only authorized department managers or administrators can verify reports',
            });
        }
        // 6. Only authorized users can close reports (closed)
        if (status === 'closed' && !(0, validation_1.canUserCloseReport)(user.role)) {
            return res.status(403).json({
                error: 'Forbidden: Only authorized department managers or administrators can close reports',
            });
        }
        // 7. Validate lifecycle transition graph
        if (status && !(0, validation_1.validateStatusTransition)(current.status, status)) {
            return res.status(400).json({
                error: `Invalid status transition from ${current.status} to ${status}`,
            });
        }
        const updates = {
            updatedAt: new Date(),
        };
        if (status)
            updates.status = status;
        if (priority)
            updates.priority = priority;
        if (departmentId)
            updates.departmentId = departmentId;
        if (assignedStaffId)
            updates.assignedStaffId = assignedStaffId;
        if (duplicateOfId)
            updates.duplicateOfId = duplicateOfId;
        if (status === 'resolved') {
            updates.resolvedAt = new Date();
        }
        const [updatedIssue] = await db_1.db
            .update(schema_1.issues)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.issues.id, id))
            .returning();
        if (assignedStaffId && (status === 'assigned' || !status)) {
            await db_1.db.insert(schema_1.maintenanceTasks).values({
                issueId: id,
                staffId: assignedStaffId,
                status: 'pending',
            });
        }
        // 8. Issue history must be preserved (immutable audit log)
        await (0, issue_service_1.logIssueActivity)({
            issueId: id,
            userId: user.id,
            action: status ? `STATUS_CHANGE_TO_${status.toUpperCase()}` : 'UPDATED',
            previousStatus: current.status,
            newStatus: status || current.status,
            notes: notes || `Updated by ${user.name} (${user.role}).`,
        });
        return res.json({ success: true, issue: updatedIssue });
    }
    catch (error) {
        console.error('Update issue status error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/issues/:id/feedback
router.post('/:id/feedback', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        const [current] = await db_1.db.select().from(schema_1.issues).where((0, drizzle_orm_1.eq)(schema_1.issues.id, id)).limit(1);
        if (!current) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        if (current.reporterId !== user.id && user.role !== 'admin') {
            return res.status(403).json({ error: 'Only the reporter can submit feedback' });
        }
        const [updated] = await db_1.db
            .update(schema_1.issues)
            .set({
            feedbackRating: rating,
            feedbackComment: comment,
            status: 'closed',
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.id, id))
            .returning();
        await (0, issue_service_1.logIssueActivity)({
            issueId: id,
            userId: user.id,
            action: 'FEEDBACK_SUBMITTED_AND_CLOSED',
            previousStatus: current.status,
            newStatus: 'closed',
            notes: `Citizen gave ${rating}-star rating: "${comment || 'No comment'}"`,
        });
        return res.json({ success: true, issue: updated });
    }
    catch (error) {
        console.error('Submit feedback error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
