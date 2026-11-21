import { NextResponse } from 'next/server';
import { db } from '@/db';
import { issues, users, departments } from '@/db/schema';
import { eq, and, or, ilike, desc, asc, count } from 'drizzle-orm';
import { createIssueSchema, issueFilterSchema } from '@/lib/validation';
import { getSessionUser } from '@/lib/session';
import {
  resolveDepartmentForCategory,
  findNearbyDuplicate,
  logIssueActivity,
} from '@/lib/issue-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = issueFilterSchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const {
      q,
      category,
      status,
      priority,
      departmentId,
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

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Check for nearby duplicates if lat/lng are provided
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
        return NextResponse.json({
          duplicateFound: true,
          duplicate,
        });
      }
    }

    // Get total count
    const [countResult] = await db.select({ total: count() }).from(issues).where(whereClause);
    const total = Number(countResult?.total || 0);

    const sortColumn = sort === 'priority' ? issues.priority : issues.createdAt;
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

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('List issues error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createIssueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { title, description, category, priority, latitude, longitude, address, imageUrl } =
      parsed.data;

    // Auto-resolve department
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

    // Log activity
    await logIssueActivity({
      issueId: newIssue.id,
      userId: user.id,
      action: 'SUBMITTED',
      newStatus: 'submitted',
      notes: `Reported by ${user.name} via Citizen Portal.`,
    });

    return NextResponse.json({ success: true, issue: newIssue }, { status: 201 });
  } catch (error) {
    console.error('Create issue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
