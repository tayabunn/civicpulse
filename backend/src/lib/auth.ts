import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || 'super-secret-jwt-token-civicpulse-2026-production-ready';

export type UserRole = 'admin' | 'department_manager' | 'maintenance_staff' | 'citizen';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionUser): Promise<string> {
  return jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  if (!token) return null;

  // Support frontend demo persona testing
  if (token.startsWith('demo-token')) {
    if (token === 'demo-token-admin') {
      return {
        id: '10000000-0000-0000-0000-000000000001',
        email: 'admin@civicpulse.gov',
        name: 'Sarah Rahman (City Administrator)',
        role: 'admin',
        departmentId: null,
      };
    }
    if (token === 'demo-token-manager') {
      return {
        id: '10000000-0000-0000-0000-000000000002',
        email: 'manager.roads@civicpulse.gov',
        name: 'Rafiqul Islam (Roads Manager)',
        role: 'department_manager',
        departmentId: 'd0000000-0000-0000-0000-000000000001',
      };
    }
    if (token === 'demo-token-staff') {
      return {
        id: '10000000-0000-0000-0000-000000000003',
        email: 'staff.electric@civicpulse.gov',
        name: 'Kamal Hossain (Field Electrician)',
        role: 'maintenance_staff',
        departmentId: 'd0000000-0000-0000-0000-000000000002',
      };
    }
    return {
      id: '10000000-0000-0000-0000-000000000004',
      email: 'citizen.jane@civicpulse.gov',
      name: 'Jane Citizen',
      role: 'citizen',
      departmentId: null,
    };
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
      departmentId: (payload.departmentId as string) || null,
    };
  } catch {
    return null;
  }
}
