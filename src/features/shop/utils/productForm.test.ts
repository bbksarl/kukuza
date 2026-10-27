import { expect, it } from 'vitest';
import { validateProductForm } from './productForm';

const values = { name: 'Robe', category: 'Vetements', price: '42', quantity: '5', ageRange: 'Adulte', gender: 'Femme', images: [] };

it('rejects nonfinite prices, fractional quantities and incompatible gender choices', () => {
  expect(validateProductForm({ ...values, price: 'Infinity' })).toHaveProperty('price');
  expect(validateProductForm({ ...values, quantity: '1.5' })).toHaveProperty('quantity');
  expect(validateProductForm({ ...values, quantity: 'Infinity' })).toHaveProperty('quantity');
  expect(validateProductForm({ ...values, ageRange: 'Enfant' })).toHaveProperty('gender');
  expect(validateProductForm({ ...values, quantity: '0' })).toEqual({});
});
