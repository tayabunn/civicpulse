import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '../src/lib/auth';

describe('Auth & Session Security', () => {
  it('hashes and verifies passwords accurately', async () => {
    const raw = 'admin123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword('wrongpassword', hash)).toBe(false);
  });

  it('signs and validates JWT session tokens', async () => {
    const user = {
      id: 'u0000000-0000-0000-0000-000000000001',
      email: 'admin@civicpulse.gov',
      role: 'admin' as const,
      name: 'Admin User',
    };
    const token = await createSessionToken(user);
    expect(typeof token).toBe('string');
    const verified = await verifySessionToken(token);
    expect(verified?.id).toBe(user.id);
    expect(verified?.email).toBe(user.email);
    expect(verified?.role).toBe('admin');
  });
});
