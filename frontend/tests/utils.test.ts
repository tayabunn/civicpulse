import { describe, it, expect } from 'vitest';
import { getStatusBadgeClass, getPriorityBadgeClass, getCategoryBadgeClass, formatCoords } from '../src/lib/utils';

describe('UI Style Utilities', () => {
  it('returns proper color mappings for issue status', () => {
    expect(getStatusBadgeClass('submitted')).toContain('bg-slate');
    expect(getStatusBadgeClass('under_review')).toContain('bg-amber');
    expect(getStatusBadgeClass('assigned')).toContain('bg-blue');
    expect(getStatusBadgeClass('in_progress')).toContain('bg-teal');
    expect(getStatusBadgeClass('resolved')).toContain('bg-emerald');
    expect(getStatusBadgeClass('closed')).toContain('bg-slate');
  });

  it('returns proper color mappings for priority levels according to design system', () => {
    expect(getPriorityBadgeClass('low')).toContain('bg-slate');
    expect(getPriorityBadgeClass('medium')).toContain('bg-amber');
    expect(getPriorityBadgeClass('high')).toContain('bg-rose');
    expect(getPriorityBadgeClass('critical')).toContain('bg-brand-midnight');
  });

  it('returns category badges and formatted coordinates', () => {
    expect(getCategoryBadgeClass('road_damage')).toBeDefined();
    expect(formatCoords(23.8103, 90.4125)).toBe('23.8103° N, 90.4125° E');
  });
});
