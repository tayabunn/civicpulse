import { describe, it, expect } from 'vitest';
import { issueFilterSchema, createIssueSchema, validateStatusTransition } from '../src/lib/validation';
import { findNearbyDuplicate } from '../src/lib/issue-service';

describe('Issue Business Logic & State Machine', () => {
  it('validates status transitions according to spec workflow', () => {
    expect(validateStatusTransition('submitted', 'under_review')).toBe(true);
    expect(validateStatusTransition('under_review', 'assigned')).toBe(true);
    expect(validateStatusTransition('assigned', 'in_progress')).toBe(true);
    expect(validateStatusTransition('in_progress', 'resolved')).toBe(true);
    expect(validateStatusTransition('resolved', 'closed')).toBe(true);
    // Invalid jump
    expect(validateStatusTransition('submitted', 'resolved')).toBe(false);
  });

  it('validates GPS coordinates within valid ranges', () => {
    const valid = {
      title: 'Pothole on Main Road',
      description: 'Deep hazardous crater on lane 2',
      category: 'road_damage',
      latitude: 23.8103,
      longitude: 90.4125,
      address: 'Road 27, Dhanmondi',
    };
    expect(createIssueSchema.safeParse(valid).success).toBe(true);

    const invalidLat = { ...valid, latitude: 120.0 };
    expect(createIssueSchema.safeParse(invalidLat).success).toBe(false);

    const invalidLng = { ...valid, longitude: 200.0 };
    expect(createIssueSchema.safeParse(invalidLng).success).toBe(false);
  });

  it('detects nearby duplicates within 50 meters in the same category', () => {
    const existingIssues = [
      {
        id: 'i1',
        title: 'Pothole #1',
        category: 'road_damage' as const,
        latitude: 23.8103,
        longitude: 90.4125,
        status: 'submitted' as const,
      },
      {
        id: 'i2',
        title: 'Broken Streetlight #2',
        category: 'streetlight' as const,
        latitude: 23.8103,
        longitude: 90.4125,
        status: 'in_progress' as const,
      },
    ];

    // 15 meters away, same category -> duplicate found!
    const duplicate = findNearbyDuplicate(
      23.8104,
      90.4126,
      'road_damage',
      existingIssues,
      50
    );
    expect(duplicate?.id).toBe('i1');

    // 15 meters away, different category -> NOT duplicate
    const noDuplicateCat = findNearbyDuplicate(
      23.8104,
      90.4126,
      'streetlight',
      [existingIssues[0]],
      50
    );
    expect(noDuplicateCat).toBeNull();

    // 500 meters away -> NOT duplicate
    const farAway = findNearbyDuplicate(
      23.8200,
      90.4200,
      'road_damage',
      existingIssues,
      50
    );
    expect(farAway).toBeNull();
  });
});
