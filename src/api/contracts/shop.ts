import { z } from 'zod';
import { entityIdSchema } from './identifiers';
const text = z.string().trim().min(1);
const amount = z.number().nonnegative();
const count = z.number().int().nonnegative();
const date = z.union([z.iso.datetime({ offset: true }).transform((value) => new Date(value)), z.date()]);
const optionalMetric = z.number().nullish().transform((value) => value ?? null);

export class ShopResponseError extends Error {
  constructor(cause: unknown) {
    super('Les données de la boutique sont incomplètes ou invalides. Réessayez plus tard.', { cause });
    this.name = 'ShopResponseError';
  }
}

export function parseShopResponse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new ShopResponseError(result.error);
  return result.data;
}

export const shopRecordSchema = z.record(z.string(), z.unknown());
export const shopListSchema = z.union([
  z.array(z.unknown()),
  z.object({ items: z.array(z.unknown()) }).transform(({ items }) => items),
  z.object({ data: z.array(z.unknown()) }).transform(({ data }) => data),
  z.object({ products: z.array(z.unknown()) }).transform(({ products }) => products),
]);
export const shopCategorySchema = z.object({
  id: z.number().int().positive(), name: text, parentId: z.number().int().positive().nullish(),
});
export const shopBrandSchema = z.object({ id: z.number().int().positive(), userId: z.number().int().positive().optional() });

export const shopProductSchema = z.object({
  id: entityIdSchema.transform(String),
  name: text,
  price: amount,
  stock: count,
  category: text.nullish().transform((value) => value ?? 'Non renseignée'),
  reference: text.nullish().transform((value) => value ?? '—'),
  image: z.string().nullish().transform((value) => value ?? undefined),
  status: z.enum(['in_stock', 'out_of_stock', 'low_stock']),
  createdAt: date,
  updatedAt: date,
  boutiqueId: entityIdSchema.nullish().transform((value) => value == null ? undefined : String(value)),
  boutiqueName: text.optional(),
  gender: text.optional(),
  ageRange: text.optional(),
});

export const shopSaleSchema = z.object({
  id: entityIdSchema.transform(String),
  productName: text,
  reference: text.nullish().transform((value) => value ?? '—'),
  quantity: z.number().int().positive(),
  unitPrice: amount,
  totalPrice: amount,
  customer: text,
  date,
  status: z.enum(['completed', 'pending', 'cancelled']),
});

export const dashboardStatsSchema = z.object({
  totalRevenue: amount,
  totalSales: count,
  activeUsers: count,
  revenueChange: optionalMetric,
  dailyRevenue: amount.nullish().transform((value) => value ?? null),
  dailyRevenueChange: optionalMetric,
  salesChange: optionalMetric,
  usersChange: optionalMetric,
});
export const chartPointSchema = z.object({ label: text, value: amount, date: date.optional() });
export const visitsPointSchema = z.object({ day: text, visits: count });
