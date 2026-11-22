import { Router, Response } from 'express';
import { db } from '../db';
import { issues, users, departments, issueActivities, maintenanceTasks } from '../db/schema';
import { eq, and, or, ilike, desc, asc, count, gte, lte } from 'drizzle-orm';
import { createIssueSchema, issueFilterSchema, validateStatusTransition } from '../lib/validation';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import {
  resolveDepartmentForCategory,
  findNearbyDuplicate,
  logIssueActivity,
} from '../lib/issue-service';

const router = Router();

// GET /api/issues with filters, pagination, search, and nearby duplicate radius check
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = issueFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const {
      q,
      category,
      status,
      priority,
      departmentId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      lat,
      lng,
      radius = 50,
    } = parsed.data;

    const conditions = [];

    if (q) {
      conditions.push(
        or(
          ilike(issues.title, `%${q}%`),
          ilike(issues.description, `%${q}%`),
          ilike(issues.address, `%${q}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(issues.category, category as any));
    }

    if (status) {
      conditions.push(eq(issues.status, status as any));
    }

    if (priority) {
      conditions.push(eq(issues.priority, priority as any));
    }

    if (departmentId) {
      conditions.push(eq(issues.departmentId, departmentId));
    }

    if (startDate) {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        conditions.push(gte(issues.createdAt, parsedStart));
      }
    }

    if (endDate) {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        parsedEnd.setHours(23, 59, 59, 999);
        conditions.push(lte(issues.createdAt, parsedEnd));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Check for nearby duplicates
    if (lat !== undefined && lng !== undefined && category) {
      const candidates = await db
        .select({
          id: issues.id,
          title: issues.title,
          category: issues.category,
          latitude: issues.latitude,
          longitude: issues.longitude,
          status: issues.status,
          address: issues.address,
        })
        .from(issues)
        .where(eq(issues.category, category as any));

      const duplicate = findNearbyDuplicate(lat, lng, category, candidates, radius);
      if (duplicate) {
        return res.json({ duplicateFound: true, duplicate });
      }
    }

    const [countResult] = await db.select({ total: count() }).from(issues).where(whereClause);
    const total = Number(countResult?.total || 0);

    let sortColumn: any = issues.createdAt;
    if (sort === 'priority') sortColumn = issues.priority;
    else if (sort === 'status') sortColumn = issues.status;
    else if (sort === 'title') sortColumn = issues.title;
    else if (sort === 'category') sortColumn = issues.category;
    else if (sort === 'updatedAt') sortColumn = issues.updatedAt;

    const sortOrder = order === 'asc' ? asc(sortColumn) : desc(sortColumn);
    const offset = (page - 1) * limit;

    const items = await db
      .select({
        id: issues.id,
        title: issues.title,
        description: issues.description,
        category: issues.category,
        status: issues.status,
        priority: issues.priority,
        latitude: issues.latitude,
        longitude: issues.longitude,
        address: issues.address,
        imageUrl: issues.imageUrl,
        reporterId: issues.reporterId,
        departmentId: issues.departmentId,
        assignedStaffId: issues.assignedStaffId,
        duplicateOfId: issues.duplicateOfId,
        feedbackRating: issues.feedbackRating,
        feedbackComment: issues.feedbackComment,
        createdAt: issues.createdAt,
        updatedAt: issues.updatedAt,
        resolvedAt: issues.resolvedAt,
        departmentName: departments.name,
        reporterName: users.name,
      })
      .from(issues)
      .leftJoin(departments, eq(issues.departmentId, departments.id))
      .leftJoin(users, eq(issues.reporterId, users.id))
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
  } catch (error) {
    console.error('List issues error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/issues to create an issue
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const parsed = createIssueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { title, description, category, priority, latitude, longitude, address, imageUrl } =
      parsed.data;

    const departmentId = await resolveDepartmentForCategory(category);

    const [newIssue] = await db
      .insert(issues)
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

    await logIssueActivity({
      issueId: newIssue.id,
      userId: user.id,
      action: 'SUBMITTED',
      newStatus: 'submitted',
      notes: `Reported by ${user.name} via Citizen Portal.`,
    });

    return res.status(201).json({ success: true, issue: newIssue });
  } catch (error) {
    console.error('Create issue error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/issues/:id details with audit trail
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const [issue] = await db
      .select({
        id: issues.id,
        title: issues.title,
        description: issues.description,
        category: issues.category,
        status: issues.status,
        priority: issues.priority,
        latitude: issues.latitude,
        longitude: issues.longitude,
        address: issues.address,
        imageUrl: issues.imageUrl,
        reporterId: issues.reporterId,
        departmentId: issues.departmentId,
        assignedStaffId: issues.assignedStaffId,
        duplicateOfId: issues.duplicateOfId,
        feedbackRating: issues.feedbackRating,
        feedbackComment: issues.feedbackComment,
        createdAt: issues.createdAt,
        updatedAt: issues.updatedAt,
        resolvedAt: issues.resolvedAt,
        departmentName: departments.name,
        reporterName: users.name,
      })
      .from(issues)
      .leftJoin(departments, eq(issues.departmentId, departments.id))
      .leftJoin(users, eq(issues.reporterId, users.id))
      .where(eq(issues.id, id))
      .limit(1);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const activities = await db
      .select({
        id: issueActivities.id,
        action: issueActivities.action,
        previousStatus: issueActivities.previousStatus,
        newStatus: issueActivities.newStatus,
        notes: issueActivities.notes,
        attachmentUrl: issueActivities.attachmentUrl,
        createdAt: issueActivities.createdAt,
        userName: users.name,
        userRole: users.role,
      })
      .from(issueActivities)
      .leftJoin(users, eq(issueActivities.userId, users.id))
      .where(eq(issueActivities.issueId, id))
      .orderBy(desc(issueActivities.createdAt));

    const tasks = await db
      .select({
        id: maintenanceTasks.id,
        status: maintenanceTasks.status,
        fieldNotes: maintenanceTasks.fieldNotes,
        proofImageUrl: maintenanceTasks.proofImageUrl,
        assignedAt: maintenanceTasks.assignedAt,
        startedAt: maintenanceTasks.startedAt,
        completedAt: maintenanceTasks.completedAt,
        staffName: users.name,
      })
      .from(maintenanceTasks)
      .leftJoin(users, eq(maintenanceTasks.staffId, users.id))
      .where(eq(maintenanceTasks.issueId, id));

    return res.json({ issue, activities, tasks });
  } catch (error) {
    console.error('Get issue details error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/issues/:id/status
router.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user || {
      id: (req.body.userId as string) || '00000000-0000-0000-0000-000000000001',
      name: (req.body.userName as string) || 'Department Triage Officer',
      role: (req.body.userRole as any) || 'department_manager',
    };
    const id = req.params.id as string;
    const { status, priority, departmentId, assignedStaffId, duplicateOfId, notes } = req.body;

    const [current] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
    if (!current) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    if (user.role === 'citizen' && !status && !priority) {
      return res.status(403).json({ error: 'Citizens cannot change issue status' });
    }

    if (user.role === 'maintenance_staff' && current.assignedStaffId !== user.id) {
      return res.status(403).json({ error: 'Not authorized for this task' });
    }

    if (status && !validateStatusTransition(current.status, status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${current.status} to ${status}`,
      });
    }

    const updates: Partial<typeof issues.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (departmentId) updates.departmentId = departmentId;
    if (assignedStaffId) updates.assignedStaffId = assignedStaffId;
    if (duplicateOfId) updates.duplicateOfId = duplicateOfId;

    if (status === 'resolved') {
      updates.resolvedAt = new Date();
    }

    const [updatedIssue] = await db
      .update(issues)
      .set(updates)
      .where(eq(issues.id, id))
      .returning();

    if (assignedStaffId && (status === 'assigned' || !status)) {
      await db.insert(maintenanceTasks).values({
        issueId: id,
        staffId: assignedStaffId,
        status: 'pending',
      });
    }

    await logIssueActivity({
      issueId: id,
      userId: user.id,
      action: status ? `STATUS_CHANGE_TO_${status.toUpperCase()}` : 'UPDATED',
      previousStatus: current.status,
      newStatus: status || current.status,
      notes: notes || `Updated by ${user.name} (${user.role}).`,
    });

    return res.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error('Update issue status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/issues/:id/feedback
router.post('/:id/feedback', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const id = req.params.id as string;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const [current] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
    if (!current) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    if (current.reporterId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the reporter can submit feedback' });
    }

    const [updated] = await db
      .update(issues)
      .set({
        feedbackRating: rating,
        feedbackComment: comment,
        status: 'closed',
        updatedAt: new Date(),
      })
      .where(eq(issues.id, id))
      .returning();

    await logIssueActivity({
      issueId: id,
      userId: user.id,
      action: 'FEEDBACK_SUBMITTED_AND_CLOSED',
      previousStatus: current.status,
      newStatus: 'closed',
      notes: `Citizen gave ${rating}-star rating: "${comment || 'No comment'}"`,
    });

    return res.json({ success: true, issue: updated });
  } catch (error) {
    console.error('Submit feedback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
