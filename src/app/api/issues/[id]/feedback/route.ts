import { NextResponse } from 'next/server';
import { db } from '@/db';
import { issues } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/session';
import { logIssueActivity } from '@/lib/issue-service';

export async function POST(
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
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const [current] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
    if (!current) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Only the reporter can leave feedback
    if (current.reporterId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only the reporter can submit feedback' },
        { status: 403 }
      );
    }

    // Auto-transition to closed upon feedback
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

    return NextResponse.json({ success: true, issue: updated });
  } catch (error) {
    console.error('Submit feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
