import { z } from 'zod';
import { roleSchema } from './auth';

const id = z.number().int().positive().transform(String);
const money = z.number().nonnegative();
const count = z.number().int().nonnegative();

/** Les agrégats couvrent toutes les données, indépendamment des listes affichées. */
export const adminOverviewSchema = z.object({
  totals: z.object({ revenue: money, boutiques: count, users: count, products: count }),
  sales: z.array(z.object({ label: z.string(), value: money })),
  boutiques: z.array(z.object({
    id, name: z.string(), owner: z.string(), image: z.string(),
    status: z.enum(['active', 'pending', 'suspended']), products: count, revenue: money,
  })),
  topProducts: z.array(z.object({
    id, name: z.string(), brand: z.string(), image: z.string(),
    unitsSold: count, revenue: money, stock: count,
  })),
  recentUsers: z.array(z.object({
    id, name: z.string(), email: z.string().email(), role: roleSchema,
    joinedAt: z.string(), status: z.enum(['active', 'pending']),
  })),
});
