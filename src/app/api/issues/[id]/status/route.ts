import { NextResponse } from 'next/server';
import { db } from '@/db';
import { issues, maintenanceTasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';
import { validateStatusTransition } from '@/lib/validation';
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
    const { status, priority, departmentId, assignedStaffId, duplicateOfId, notes } = body;

    const [current] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
    if (!current) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Role-based authorization
    if (user.role === 'citizen') {
      return NextResponse.json({ error: 'Citizens cannot change issue status' }, { status: 403 });
    }

    if (user.role === 'maintenance_staff') {
      if (current.assignedStaffId !== user.id) {
        return NextResponse.json({ error: 'Not authorized for this task' }, { status: 403 });
      }
    }

    if (status && !validateStatusTransition(current.status, status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${current.status} to ${status}` },
        { status: 400 }
      );
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

    // If assigned, create maintenance task
    if (assignedStaffId && (status === 'assigned' || !status)) {
      await db.insert(maintenanceTasks).values({
        issueId: id,
        staffId: assignedStaffId,
        status: 'pending',
      });
    }

    // Append immutable activity log
    await logIssueActivity({
      issueId: id,
      userId: user.id,
      action: status ? `STATUS_CHANGE_TO_${status.toUpperCase()}` : 'UPDATED',
      previousStatus: current.status,
      newStatus: status || current.status,
      notes: notes || `Updated by ${user.name} (${user.role}).`,
    });

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error('Update issue status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
