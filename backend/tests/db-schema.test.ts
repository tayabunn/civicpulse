import { describe, it, expect } from 'vitest';
import { calculateDistanceMeters, isWithinRadius } from '../src/lib/geo';
import { users, departments, issues, issueActivities, maintenanceTasks, savedViews, searchHistory, notifications } from '../src/db/schema';

describe('Geospatial Math', () => {
  it('calculates distance between two Dhaka coordinates accurately', () => {
    const lat1 = 23.8103, lon1 = 90.4125;
    const lat2 = 23.8104, lon2 = 90.4126;
    const distance = calculateDistanceMeters(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(30);
    expect(isWithinRadius(lat1, lon1, lat2, lon2, 50)).toBe(true);
    expect(isWithinRadius(lat1, lon1, 23.8200, 90.4200, 50)).toBe(false);
  });

  it('exports required Drizzle tables', () => {
    expect(users).toBeDefined();
    expect(departments).toBeDefined();
    expect(issues).toBeDefined();
    expect(issueActivities).toBeDefined();
    expect(maintenanceTasks).toBeDefined();
    expect(savedViews).toBeDefined();
    expect(searchHistory).toBeDefined();
    expect(notifications).toBeDefined();
  });
});
