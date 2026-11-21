import { describe, it, expect } from 'vitest';
import { getCategoryIconConfig } from '../src/components/map/marker-icons';

describe('Map Marker Icons', () => {
  it('returns appropriate icon config and colors for all categories', () => {
    const categories = ['road_damage', 'streetlight', 'drainage', 'footpath', 'waste_management', 'public_infrastructure'] as const;
    for (const cat of categories) {
      const config = getCategoryIconConfig(cat);
      expect(config.color).toBeDefined();
      expect(config.label).toBeDefined();
    }
  });
});
