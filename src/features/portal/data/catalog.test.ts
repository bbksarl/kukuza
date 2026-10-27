import { describe, expect, it } from 'vitest';
import { applyProductFilters, formatFilterLabel, groupFilters, mockProducts, normalizeProduct } from './catalog';

describe('catalogue modules', () => {
  it('combines search, category, size and gender filters', () => {
    const selected = applyProductFilters(mockProducts, { search: 'soleil', nav: 'vetements', filter: 'M', gender: 'Femme' });
    expect(selected.map((product) => product.id)).toEqual([1]);
    expect(applyProductFilters(mockProducts, { search: 'soleil', nav: 'chaussures' })).toEqual([]);
  });

  it('preserves price boundaries and display groups after splitting modules', () => {
    const products = [49, 50, 100, 101].map((price, index) => ({ ...mockProducts[0], id: index + 1, price }));
    expect(applyProductFilters(products, { nav: 'vetements', filter: 'Prix: 50EUR - 100EUR' }).map((product) => product.price)).toEqual([50, 100]);
    expect(groupFilters('vetements').map(([category]) => category)).toEqual(['Categorie', 'Taille', 'Prix']);
    expect(formatFilterLabel('Prix: 50EUR - 100EUR')).toBe('Prix: 50€ - 100€');
  });

  it('retains provided identities and rejects missing prices or identities', () => {
    expect(normalizeProduct({ id: 'demo-1', name: 'Robe', price: 0 })).toMatchObject({ id: 'demo-1', price: 0 });
    expect(() => normalizeProduct({ name: 'Robe', price: 42 })).toThrow();
    expect(() => normalizeProduct({ id: 1, name: 'Robe' })).toThrow();
    expect(() => normalizeProduct({ id: 1, name: 'Robe', price: NaN })).toThrow();
  });
});
