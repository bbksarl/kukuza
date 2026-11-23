import { describe, expect, it } from 'vitest';
import { formatMoney } from './format-money';

describe('formatMoney', () => {
  it('falls back to XOF when the currency is missing or invalid', () => {
    const fallback = formatMoney(1200, null, 'fr');
    expect(fallback).toContain('1\u202f200');
    expect(formatMoney(1200, 'invalid', 'fr')).toBe(fallback);
  });
});
