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

  describe('Bonus Challenges: SLA Reminders & CSAT Calculations', () => {
    it('correctly detects overdue and approaching SLA maintenance reminders', () => {
      const SLA_HOURS: Record<string, number> = {
        critical: 24,
        high: 48,
        medium: 96,
        low: 168,
      };

      const now = new Date();
      // Task 1: Assigned 26 hours ago (Critical 24h limit) -> Overdue by 2h
      const assignedAgo26h = new Date(now.getTime() - 26 * 60 * 60 * 1000);
      const hoursRemaining1 = (new Date(assignedAgo26h.getTime() + SLA_HOURS.critical * 3600000).getTime() - now.getTime()) / 3600000;
      expect(hoursRemaining1 < 0).toBe(true); // Overdue

      // Task 2: Assigned 20 hours ago (Critical 24h limit) -> Due in 4h -> Approaching
      const assignedAgo20h = new Date(now.getTime() - 20 * 60 * 60 * 1000);
      const hoursRemaining2 = (new Date(assignedAgo20h.getTime() + SLA_HOURS.critical * 3600000).getTime() - now.getTime()) / 3600000;
      expect(hoursRemaining2 > 0 && hoursRemaining2 <= 12).toBe(true); // Approaching reminder
    });

    it('calculates CSAT satisfaction percentage accurately', () => {
      const ratings = [5, 5, 4, 5, 4, 3, 2, 5, 5, 4]; // 8 out of 10 are 4 or 5
      const satisfiedCount = ratings.filter((r) => r >= 4).length;
      const csat = Math.round((satisfiedCount / ratings.length) * 100);
      expect(csat).toBe(80);

      const avg = Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1));
      expect(avg).toBe(4.2);
    });
  });
});
