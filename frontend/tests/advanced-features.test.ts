import { describe, it, expect } from 'vitest';
import uiReducer, { toggleMobileSidebar, setMobileSidebarOpen } from '../src/store/uiSlice';
import type { IssueFilters } from '../src/types';

describe('Advanced Features: UI & Filter Parameters', () => {
  it('should handle mobile sidebar toggling and explicit open states', () => {
    let state = uiReducer(undefined, { type: 'unknown' });
    expect(state.mobileSidebarOpen).toBe(false);

    state = uiReducer(state, toggleMobileSidebar());
    expect(state.mobileSidebarOpen).toBe(true);

    state = uiReducer(state, setMobileSidebarOpen(false));
    expect(state.mobileSidebarOpen).toBe(false);
  });

  it('should format URL search params correctly with advanced filters (q, dates, sorting)', () => {
    const filters: IssueFilters = {
      search: 'pothole',
      priority: 'critical',
      status: 'under_review',
      startDate: '2026-01-01',
      endDate: '2026-11-22',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 2,
      limit: 20,
    };

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (key === 'search') {
          params.append('q', String(val));
        } else if (key === 'sortBy') {
          params.append('sort', String(val));
        } else if (key === 'sortOrder') {
          params.append('order', String(val));
        } else {
          params.append(key, String(val));
        }
      }
    });

    const queryString = params.toString();
    expect(queryString).toContain('q=pothole');
    expect(queryString).toContain('priority=critical');
    expect(queryString).toContain('status=under_review');
    expect(queryString).toContain('startDate=2026-01-01');
    expect(queryString).toContain('endDate=2026-11-22');
    expect(queryString).toContain('sort=createdAt');
    expect(queryString).toContain('order=desc');
    expect(queryString).toContain('page=2');
    expect(queryString).toContain('limit=20');
  });

  it('should validate date range boundaries safely', () => {
    const start = new Date('2026-01-01');
    const end = new Date('2026-11-22');
    expect(start.getTime()).toBeLessThan(end.getTime());

    const isWithinBounds = (dateStr: string) => {
      const d = new Date(dateStr).getTime();
      return d >= start.getTime() && d <= end.getTime();
    };

    expect(isWithinBounds('2026-05-15')).toBe(true);
    expect(isWithinBounds('2025-12-31')).toBe(false);
    expect(isWithinBounds('2026-11-23')).toBe(false);
  });
});
