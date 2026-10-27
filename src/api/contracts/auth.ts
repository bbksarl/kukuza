import { z } from 'zod';

export const roleSchema = z.string()
  .transform((role) => role.toLowerCase() === 'brand' ? 'creator' : role.toLowerCase())
  .pipe(z.enum(['customer', 'creator', 'admin']));

export const sessionUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().email(),
  role: roleSchema,
  createdAt: z.string().datetime({ offset: true }),
  brandId: z.number().int().positive().nullable().optional(),
});

export const authResponseSchema = z.object({
  user: sessionUserSchema,
  token: z.string().nullable().optional(),
});

export type SessionUserDto = z.infer<typeof sessionUserSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;
