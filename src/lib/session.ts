import { verifySessionToken, SessionUser, UserRole } from './auth';

export async function getSessionUser(req: Request): Promise<SessionUser | null> {
  // Check Authorization header first
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = await verifySessionToken(token);
    if (user) return user;
  }

  // Fallback to cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/civicpulse_session=([^;]+)/);
  if (match) {
    const token = match[1];
    return verifySessionToken(token);
  }

  return null;
}

export async function requireAuth(req: Request): Promise<SessionUser> {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(
  req: Request,
  allowedRoles: UserRole[]
): Promise<SessionUser> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}
