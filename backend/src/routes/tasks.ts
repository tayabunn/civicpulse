import { Router, Response } from 'express';
import { db } from '../db';
import { maintenanceTasks, issues, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { logIssueActivity } from '../lib/issue-service';
import { isValidImageUrl } from '../lib/validation';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const conditions = [];

    if (user.role === 'maintenance_staff') {
      conditions.push(eq(maintenanceTasks.staffId, user.id));
    }

    const tasks = await db
      .select({
        id: maintenanceTasks.id,
        issueId: maintenanceTasks.issueId,
        staffId: maintenanceTasks.staffId,
        status: maintenanceTasks.status,
        fieldNotes: maintenanceTasks.fieldNotes,
        proofImageUrl: maintenanceTasks.proofImageUrl,
        assignedAt: maintenanceTasks.assignedAt,
        startedAt: maintenanceTasks.startedAt,
        completedAt: maintenanceTasks.completedAt,
        issueTitle: issues.title,
        issueCategory: issues.category,
        issuePriority: issues.priority,
        issueAddress: issues.address,
        issueLatitude: issues.latitude,
        issueLongitude: issues.longitude,
        staffName: users.name,
      })
      .from(maintenanceTasks)
      .leftJoin(issues, eq(maintenanceTasks.issueId, issues.id))
      .leftJoin(users, eq(maintenanceTasks.staffId, users.id))
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(maintenanceTasks.assignedAt));

    return res.json({ tasks });
  } catch (error) {
    console.error('List tasks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const id = req.params.id as string;
    const { status, fieldNotes, proofImageUrl } = req.body;

    // 1. Citizens cannot update maintenance tasks
    if (user.role === 'citizen') {
      return res.status(403).json({ error: 'Forbidden: Citizens cannot update maintenance tasks' });
    }

    const [currentTask] = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.id, id))
      .limit(1);

    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 2. Maintenance staff can only update assigned tasks
    if (user.role === 'maintenance_staff' && currentTask.staffId !== user.id) {
      return res.status(403).json({ error: 'Forbidden: Maintenance staff can only update tasks assigned to them' });
    }

    // 3. Validate completion photograph proof
    if (proofImageUrl && !isValidImageUrl(proofImageUrl)) {
      return res.status(400).json({ error: 'Invalid proof image format. Must be a valid URL or base64 image.' });
    }

    const updates: Partial<typeof maintenanceTasks.$inferInsert> = {};
    if (status) updates.status = status;
    if (fieldNotes) updates.fieldNotes = fieldNotes;
    if (proofImageUrl) updates.proofImageUrl = proofImageUrl;

    if (status === 'in_progress' && !currentTask.startedAt) {
      updates.startedAt = new Date();
      await db
        .update(issues)
        .set({ status: 'in_progress', updatedAt: new Date() })
        .where(eq(issues.id, currentTask.issueId));

      await logIssueActivity({
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
      await db
        .update(issues)
        .set({ status: 'resolved', resolvedAt: new Date(), updatedAt: new Date() })
        .where(eq(issues.id, currentTask.issueId));

      await logIssueActivity({
        issueId: currentTask.issueId,
        userId: user.id,
        action: 'STATUS_CHANGE_TO_RESOLVED',
        previousStatus: 'in_progress',
        newStatus: 'resolved',
        notes: fieldNotes || 'Maintenance completed and proof photograph uploaded.',
        attachmentUrl: proofImageUrl,
      });
    }

    const [updatedTask] = await db
      .update(maintenanceTasks)
      .set(updates)
      .where(eq(maintenanceTasks.id, id))
      .returning();

    return res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
