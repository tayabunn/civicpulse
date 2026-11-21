import { describe, it, expect } from 'vitest';
import { calculateSlaCompliance, SLA_TARGET_HOURS } from '../src/lib/analytics-service';

describe('Analytics & SLA Service', () => {
  it('defines the spec-mandated SLA target hours by priority', () => {
    expect(SLA_TARGET_HOURS.critical).toBe(24);
    expect(SLA_TARGET_HOURS.high).toBe(48);
    expect(SLA_TARGET_HOURS.medium).toBe(96);
    expect(SLA_TARGET_HOURS.low).toBe(168);
  });

  it('calculates SLA compliance rate accurately', () => {
    const issues = [
      { priority: 'critical', hoursTaken: 12 },
      { priority: 'critical', hoursTaken: 36 },
      { priority: 'high', hoursTaken: 40 },
      { priority: 'low', hoursTaken: 100 },
    ];
    const rate = calculateSlaCompliance(issues);
    expect(rate).toBe(75);
  });

  it('handles empty issues list gracefully', () => {
    expect(calculateSlaCompliance([])).toBe(100);
  });
});
