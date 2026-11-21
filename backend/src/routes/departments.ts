import { Router, Response } from 'express';
import { db } from '../db';
import { departments, users, issues } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
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

    return res.json({ departments: deptsWithStats });
  } catch (error) {
    console.error('List departments error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, code, description, managerId } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and Code are required' });
    }

    const [newDept] = await db
      .insert(departments)
      .values({ name, code, description, managerId })
      .returning();

    return res.status(201).json({ success: true, department: newDept });
  } catch (error) {
    console.error('Create department error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, managerId, isActive } = req.body;

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

    return res.json({ success: true, department: updated });
  } catch (error) {
    console.error('Update department error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
