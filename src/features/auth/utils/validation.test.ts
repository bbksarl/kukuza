import { describe, expect, it } from 'vitest';
import { boutiqueValidationSchema, registerValidationSchema, validateWithSchema } from './validation';

describe('authentication form validation', () => {
  it('normalizes a valid registration email and username', () => {
    const result = registerValidationSchema.parse({
      name: 'Amina Diallo',
      username: ' amina_d ',
      email: ' AMINA@EXAMPLE.COM ',
      password: 'SecurePass8',
      confirmPassword: 'SecurePass8',
    });

    expect(result.username).toBe('amina_d');
    expect(result.email).toBe('amina@example.com');
  });

  it('rejects mismatched confirmation and maps errors to fields', () => {
    const result = validateWithSchema(registerValidationSchema, {
      name: 'Amina Diallo',
      username: 'amina_d',
      email: 'amina@example.com',
      password: 'SecurePass8',
      confirmPassword: 'DifferentPass8',
    });

    expect(result.valid).toBe(false);
    expect(result.errors?.confirmPassword).toContain('ne correspondent pas');
  });

  it('rejects boutique data with an invalid postal code', () => {
    expect(() =>
      boutiqueValidationSchema.parse({
        shopName: 'Atelier Amina',
        address: '12 rue du Marché',
        postalCode: 'Dakar',
        country: 'Sénégal',
        phoneNumber: '+221 771234567',
        description: 'Créations artisanales faites à Dakar.',
      }),
    ).toThrow();
  });
});
