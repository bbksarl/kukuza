import { requestJson } from '../api/httpClient';
import { shopEnv } from '../../config/env';

export type AnalyticsPeriodType = 'day' | 'month' | 'year';

export interface AnalyticsPeriod {
  type: AnalyticsPeriodType;
  year?: number;
  month?: number;
  day?: number;
  date?: Date;
}

const endpoint = (template: string, brandId: number): string =>
  template.replace('{brandId}', encodeURIComponent(String(brandId)));

const assertInteger = (value: number, field: string, min: number, max?: number): number => {
  if (!Number.isInteger(value) || value < min || (max != null && value > max)) {
    throw new Error(`La période analytics contient un ${field} invalide.`);
  }
  return value;
};

const getPeriodParts = (period: AnalyticsPeriod): { year: number; month?: number; day?: number } => {
  const date = period.date ?? new Date();
  const year = assertInteger(period.year ?? date.getFullYear(), 'année', 1);

  if (period.type === 'year') return { year };

  const month = assertInteger(period.month ?? date.getMonth() + 1, 'mois', 1, 12);
  if (period.type === 'month') return { year, month };

  const day = assertInteger(period.day ?? date.getDate(), 'jour', 1, 31);
  return { year, month, day };
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

/** Format attendu par analytics_cache.period_value. */
export const formatPeriodValue = (period: AnalyticsPeriod): string => {
  const parts = getPeriodParts(period);
  if (period.type === 'year') return String(parts.year);
  if (period.type === 'month') return `${pad2(parts.month!)}-${parts.year}`;
  return `${pad2(parts.day!)}-${pad2(parts.month!)}-${parts.year}`;
};

/**
 * Construit le contrat de requête du MetricsController.
 * Les period_value (DD-MM-YYYY, MM-YYYY, YYYY) restent calculables côté
 * backend, tandis que l'endpoint reçoit des composantes numériques.
 */
export const buildMetricsPath = (brandId: number, period: AnalyticsPeriod): string => {
  if (!Number.isInteger(brandId) || brandId <= 0) {
    throw new Error('L’identifiant de marque est invalide.');
  }

  const parts = getPeriodParts(period);
  const params = new URLSearchParams({
    period: period.type,
    year: String(parts.year),
  });
  if (parts.month != null) params.set('month', String(parts.month));
  if (parts.day != null) params.set('day', String(parts.day));

  return `${endpoint(shopEnv.endpoints.brandMetrics, brandId)}?${params.toString()}`;
};

export class AnalyticsCacheService {
  /**
   * Le backend décide si la ligne analytics_cache est encore valide et
   * recalcule/upsert les métriques lorsqu'elle est expirée ou absente.
   */
  async getCachedOrCompute(brandId: number, period: AnalyticsPeriod): Promise<unknown> {
    return requestJson<unknown>(buildMetricsPath(brandId, period));
  }
}

export const analyticsCacheService = new AnalyticsCacheService();
