import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users, departments } from '../db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import { hashPassword } from '../lib/auth';

const router = Router();

// 1. GET /api/users - List users with optional role & search filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const roleFilter = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;

    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        departmentId: users.departmentId,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        departmentName: departments.name,
        departmentCode: departments.code,
      })
      .from(users)
      .leftJoin(departments, eq(users.departmentId, departments.id));

    const allUsers = await query;

    let filtered = allUsers;
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.departmentName && u.departmentName.toLowerCase().includes(s))
      );
    }

    return res.json({ users: filtered, total: filtered.length });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// 2. POST /api/users - Create user (Admin control)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, departmentId, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: role || 'citizen',
        departmentId: departmentId || null,
        phone: phone || null,
      })
      .returning();

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        departmentId: newUser.departmentId,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// 3. PATCH /api/users/:id - Update user role & department permissions
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role, departmentId, name, phone } = req.body;

    const updates: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (role !== undefined) updates.role = role;
    if (departmentId !== undefined) updates.departmentId = departmentId;
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        departmentId: updated.departmentId,
      },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

// 4. DELETE /api/users/:id - Remove user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(users).where(eq(users.id, id));
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
