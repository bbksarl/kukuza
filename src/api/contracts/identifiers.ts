import { z } from 'zod';

/** Identifiant fourni par la source ; accepte aussi les identifiants des démonstrations locales. */
export const entityIdSchema = z.union([
  z.number().int().positive(),
  z.string().trim().min(1).refine((value) => !/^[-+\d.]+$/.test(value)
    || (Number.isSafeInteger(Number(value)) && Number(value) > 0)),
]);
