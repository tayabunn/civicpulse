import { NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceTasks, issues, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('List tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
