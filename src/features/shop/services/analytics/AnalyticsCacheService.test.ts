import { describe, expect, it } from 'vitest';
import { buildMetricsPath, formatPeriodValue } from './AnalyticsCacheService';
import { mapAnalyticsResponse } from '../shop/shopMappers';

describe('analytics cache contract', () => {
  it('builds the monthly MetricsController query', () => {
    expect(buildMetricsPath(42, { type: 'month', year: 2025, month: 2 }))
      .toBe('/brands/42/metrics?period=month&year=2025&month=2');
  });

  it('supports day and year periods', () => {
    expect(buildMetricsPath(42, { type: 'day', year: 2025, month: 2, day: 9 }))
      .toBe('/brands/42/metrics?period=day&year=2025&month=2&day=9');
    expect(buildMetricsPath(42, { type: 'year', year: 2025 }))
      .toBe('/brands/42/metrics?period=year&year=2025');
    expect(formatPeriodValue({ type: 'day', year: 2025, month: 2, day: 9 })).toBe('09-02-2025');
    expect(formatPeriodValue({ type: 'month', year: 2025, month: 2 })).toBe('02-2025');
    expect(formatPeriodValue({ type: 'year', year: 2025 })).toBe('2025');
  });

  it('maps cached metric names to dashboard stats', () => {
    expect(mapAnalyticsResponse({
      brandId: 42,
      periodType: 'month',
      periodValue: '02-2025',
      tr: 125000,
      sold: 18,
      active_users: 31,
      variation: 12.5,
    }).stats).toEqual({
      totalRevenue: 125000,
      revenueChange: 12.5,
      dailyRevenue: 0,
      dailyRevenueChange: 0,
      totalSales: 18,
      salesChange: 0,
      activeUsers: 31,
      usersChange: 0,
    });
  });
});
