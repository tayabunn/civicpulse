import { Router, Response } from 'express';
import { db } from '../db';
import { notifications, issueActivities, issues, users } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const formatActionTitle = (action: string, newStatus?: string | null) => {
  if (action === 'CREATED') return 'New Issue Submitted';
  if (action === 'ASSIGNED') return 'Work Order Assigned';
  if (action === 'STATUS_CHANGE') {
    const label = (newStatus || 'updated').replace(/_/g, ' ');
    return `Status Updated: ${label.charAt(0).toUpperCase() + label.slice(1)}`;
  }
  if (action === 'RESOLVED') return 'Issue Resolved';
  return action.replace(/_/g, ' ');
};

const getNotifType = (action: string, newStatus?: string | null, priority?: string | null) => {
  if (newStatus === 'resolved' || newStatus === 'closed' || action === 'RESOLVED') return 'success';
  if (priority === 'critical' || priority === 'high') return 'warning';
  return 'info';
};

// GET /api/notifications — Real role-scoped notifications from DB + live issue activities
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;

    // Build role-scoped filter for issue activities
    const activityWhere =
      user.role === 'citizen'
        ? eq(issues.reporterId, user.id)
        : user.role === 'maintenance_staff'
        ? eq(issues.assignedStaffId, user.id)
        : user.role === 'department_manager' && user.departmentId
        ? eq(issues.departmentId, user.departmentId)
        : undefined;

    const [dbNotifs, recentActivities] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(15),
      db
        .select({
          activityId: issueActivities.id,
          action: issueActivities.action,
          previousStatus: issueActivities.previousStatus,
          newStatus: issueActivities.newStatus,
          notes: issueActivities.notes,
          actorName: users.name,
          createdAt: issueActivities.createdAt,
          issueId: issues.id,
          issueTitle: issues.title,
          issuePriority: issues.priority,
          issueAddress: issues.address,
        })
        .from(issueActivities)
        .innerJoin(issues, eq(issueActivities.issueId, issues.id))
        .leftJoin(users, eq(issueActivities.userId, users.id))
        .where(activityWhere)
        .orderBy(desc(issueActivities.createdAt))
        .limit(15),
    ]);

    const mappedDb = dbNotifs.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.message,
      type: (n.type as 'info' | 'success' | 'warning' | 'error') || 'info',
      link: n.link || '/citizen/reports',
      read: n.isRead,
      createdAt: n.createdAt.toISOString(),
      source: 'db' as const,
    }));

    const mappedActivities = recentActivities.map((a) => ({
      id: `act-${a.activityId}`,
      title: formatActionTitle(a.action, a.newStatus),
      description: a.notes
        ? `${a.issueTitle} — ${a.notes}`
        : `${a.issueTitle}${a.issueAddress ? ` (${a.issueAddress})` : ''}`,
      type: getNotifType(a.action, a.newStatus, a.issuePriority),
      link: `/issues/${a.issueId}`,
      read: false,
      createdAt: a.createdAt.toISOString(),
      source: 'activity' as const,
    }));

    const combined = [...mappedDb, ...mappedActivities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);

    return res.json({ items: combined });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, req.user!.id), eq(notifications.isRead, false)));
    return res.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id.startsWith('act-')) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.id, id), eq(notifications.userId, req.user!.id)));
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
