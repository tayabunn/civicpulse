import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-token-civicpulse-2026-production-ready'
);

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
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
