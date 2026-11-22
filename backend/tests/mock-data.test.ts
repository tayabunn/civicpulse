import { describe, it, expect } from 'vitest';
import { generateSeedData } from '../src/db/mock-data';

describe('Seed Data Generator', () => {
  it('generates the mandatory minimum volume of entities', () => {
    const data = generateSeedData();
    // Section 7 Minimum Data Requirements
    expect(data.departments.length).toBeGreaterThanOrEqual(5); // Minimum 5 Departments
    expect(data.issues.length).toBeGreaterThanOrEqual(100); // Minimum 100 Issues
    expect(data.locations.length).toBeGreaterThanOrEqual(30); // Minimum 30 Sample Locations

    const roles = new Set(data.users.map((u) => u.role));
    expect(roles.size).toBeGreaterThanOrEqual(4); // Minimum 4 User Roles
    expect(roles.has('admin')).toBe(true);
    expect(roles.has('department_manager')).toBe(true);
    expect(roles.has('maintenance_staff')).toBe(true);
    expect(roles.has('citizen')).toBe(true);

    const staffUsers = data.users.filter((u) => u.role === 'maintenance_staff');
    expect(staffUsers.length).toBeGreaterThanOrEqual(20); // Minimum 20 Maintenance Staff
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
