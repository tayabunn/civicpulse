import { Router, Response } from 'express';
import { db } from '../db';
import { users, departments, auditLogs } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { hashPassword } from '../lib/auth';
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/auth';
import { logSecurityAudit } from '../lib/audit';

const router = Router();

// 1. GET /api/users - List users with optional role & search filters (Admin & Dept Manager only)
router.get('/', authenticateToken, authorizeRole(['admin', 'department_manager']), async (req: AuthenticatedRequest, res: Response) => {
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

// 2. GET /api/users/audit-logs - Immutable Security Audit Log Feed (Admin Only)
router.get('/audit-logs', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return res.json({ success: true, logs, total: logs.length });
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    return res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

// 3. POST /api/users - Create user (Admin control with audit log)
router.post('/', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
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

    await logSecurityAudit(req, {
      action: 'USER_CREATED',
      resource: 'users',
      resourceId: newUser.id,
      details: { email: newUser.email, role: newUser.role, departmentId: newUser.departmentId },
    });

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

// 4. PATCH /api/users/:id - Update user role & department permissions (Admin control with audit log)
router.patch('/:id', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role, departmentId, name, phone } = req.body;

    const [current] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!current) {
      return res.status(404).json({ error: 'User not found' });
    }

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

    await logSecurityAudit(req, {
      action: 'USER_ROLE_OR_DEPT_MODIFIED',
      resource: 'users',
      resourceId: updated.id,
      details: {
        targetEmail: updated.email,
        previousRole: current.role,
        newRole: updated.role,
        previousDept: current.departmentId,
        newDept: updated.departmentId,
      },
    });

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

// 5. DELETE /api/users/:id - Remove user (Admin control with prevention of self-deletion)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    if (req.user?.id === id) {
      return res.status(400).json({ error: 'Security constraint: Cannot delete your own administrative account' });
    }

    const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.delete(users).where(eq(users.id, id));

    await logSecurityAudit(req, {
      action: 'USER_DELETED',
      resource: 'users',
      resourceId: id,
      details: { deletedEmail: target.email, deletedRole: target.role },
    });

    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
