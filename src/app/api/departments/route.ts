import { NextResponse } from 'next/server';
import { db } from '@/db';
import { departments, users, issues } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSessionUser, requireRole } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const list = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
        description: departments.description,
        isActive: departments.isActive,
        managerId: departments.managerId,
        createdAt: departments.createdAt,
        managerName: users.name,
        managerEmail: users.email,
      })
      .from(departments)
      .leftJoin(users, eq(departments.managerId, users.id));

    // Get staff count and active issues count per department
    const deptsWithStats = await Promise.all(
      list.map(async (dept) => {
        const staffMembers = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.departmentId, dept.id));

        const deptIssues = await db
          .select({ status: issues.status })
          .from(issues)
          .where(eq(issues.departmentId, dept.id));

        return {
          ...dept,
          staffCount: staffMembers.length,
          totalIssues: deptIssues.length,
          activeIssues: deptIssues.filter((i) =>
            ['submitted', 'under_review', 'assigned', 'in_progress'].includes(i.status)
          ).length,
        };
      })
    );

    return NextResponse.json({ departments: deptsWithStats });
  } catch (error) {
    console.error('List departments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole(req, ['admin']);

    const body = await req.json();
    const { name, code, description, managerId } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Name and Code are required' }, { status: 400 });
    }

    const [newDept] = await db
      .insert(departments)
      .values({
        name,
        code,
        description,
        managerId,
      })
      .returning();

    return NextResponse.json({ success: true, department: newDept }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Create department error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
