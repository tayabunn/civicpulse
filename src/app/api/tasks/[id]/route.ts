import { NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceTasks, issues } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';
import { logIssueActivity } from '@/lib/issue-service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, fieldNotes, proofImageUrl } = body;

    const [currentTask] = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.id, id))
      .limit(1);

    if (!currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Role check: maintenance staff can only update their own task
    if (user.role === 'maintenance_staff' && currentTask.staffId !== user.id) {
      return NextResponse.json({ error: 'Not authorized for this task' }, { status: 403 });
    }

    const updates: Partial<typeof maintenanceTasks.$inferInsert> = {};
    if (status) updates.status = status;
    if (fieldNotes) updates.fieldNotes = fieldNotes;
    if (proofImageUrl) updates.proofImageUrl = proofImageUrl;

    if (status === 'in_progress' && !currentTask.startedAt) {
      updates.startedAt = new Date();
      // Also update parent issue status
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
      // Mark parent issue as resolved
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

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
