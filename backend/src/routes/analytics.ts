import { Router, Request, Response } from 'express';
import { getSystemAnalytics } from '../lib/analytics-service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getSystemAnalytics();
    return res.json(data);
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
