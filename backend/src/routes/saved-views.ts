import { Router, Response } from 'express';
import { db } from '../db';
import { savedViews } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const views = await db
      .select()
      .from(savedViews)
      .where(eq(savedViews.userId, user.id));
    return res.json({ views });
  } catch (error) {
    console.error('List saved views error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { name, filtersJson, sortJson, columnsJson, isShared } = req.body;
    if (!name || !filtersJson) {
      return res.status(400).json({ error: 'Name and filters are required' });
    }

    const [newView] = await db
      .insert(savedViews)
      .values({
        userId: user.id,
        name,
        filtersJson,
        sortJson,
        columnsJson,
        isShared: isShared || false,
      })
      .returning();

    return res.status(201).json({ success: true, view: newView });
  } catch (error) {
    console.error('Create saved view error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
