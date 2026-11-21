import { describe, it, expect } from 'vitest';
import { generateSeedData } from '../src/db/mock-data';

describe('Seed Data Generator', () => {
  it('generates the mandatory minimum volume of entities', () => {
    const data = generateSeedData();
    expect(data.users.length).toBeGreaterThanOrEqual(24); // 4 demo + 20 staff
    expect(data.departments.length).toBeGreaterThanOrEqual(5);
    expect(data.issues.length).toBeGreaterThanOrEqual(100);
    expect(data.locations.length).toBeGreaterThanOrEqual(30);

    const roles = new Set(data.users.map((u) => u.role));
    expect(roles.has('admin')).toBe(true);
    expect(roles.has('department_manager')).toBe(true);
    expect(roles.has('maintenance_staff')).toBe(true);
    expect(roles.has('citizen')).toBe(true);
  });

  it('generates demo users with required emails and roles', () => {
    const data = generateSeedData();
    const admin = data.users.find((u) => u.email === 'admin@civicpulse.gov');
    const manager = data.users.find((u) => u.email === 'manager.roads@civicpulse.gov');
    const staff = data.users.find((u) => u.email === 'staff.electric@civicpulse.gov');
    const citizen = data.users.find((u) => u.email === 'citizen.jane@civicpulse.gov');

    expect(admin?.role).toBe('admin');
    expect(manager?.role).toBe('department_manager');
    expect(staff?.role).toBe('maintenance_staff');
    expect(citizen?.role).toBe('citizen');
  });

  it('generates 100+ issues spanning all 6 categories and statuses', () => {
    const data = generateSeedData();
    const categories = new Set(data.issues.map((i) => i.category));
    const statuses = new Set(data.issues.map((i) => i.status));

    expect(categories.size).toBe(6);
    expect(statuses.has('submitted')).toBe(true);
    expect(statuses.has('in_progress')).toBe(true);
    expect(statuses.has('resolved')).toBe(true);
    expect(statuses.has('closed')).toBe(true);
  });
});
