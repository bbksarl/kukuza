import { describe, expect, it } from 'vitest';
import { safeReturnUrl } from './safe-return-url';

describe('safeReturnUrl', () => {
  it.each(['/cart', '/shop/products?page=2', '/admin/dashboard#sales'])(
    'allows same-site route %s',
    (value) => {
      expect(safeReturnUrl(value)).toBe(true);
    },
  );

  it.each(['https://evil.example', '//evil.example', '/\\evil.example', '/path\nheader', ''])(
    'rejects unsafe route %s',
    (value) => {
      expect(safeReturnUrl(value)).toBe(false);
    },
  );
});
