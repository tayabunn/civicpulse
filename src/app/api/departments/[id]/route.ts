import { NextResponse } from 'next/server';
import { db } from '@/db';
import { departments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/session';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(req, ['admin']);
    const { id } = await params;
    const body = await req.json();

    const { name, description, managerId, isActive } = body;

    const updates: Partial<typeof departments.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (managerId !== undefined) updates.managerId = managerId;
    if (isActive !== undefined) updates.isActive = isActive;

    const [updated] = await db
      .update(departments)
      .set(updates)
      .where(eq(departments.id, id))
      .returning();

    return NextResponse.json({ success: true, department: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
