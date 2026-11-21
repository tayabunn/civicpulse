import { NextResponse } from 'next/server';
import { db } from '@/db';
import { issues, issueActivities, users, departments, maintenanceTasks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
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

    return NextResponse.json({
      issue,
      activities,
      tasks,
    });
  } catch (error) {
    console.error('Get issue details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
