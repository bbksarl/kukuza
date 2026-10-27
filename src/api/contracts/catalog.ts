import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  brandId: z.number().int().positive().nullable().optional(),
  creatorId: z.number().int().positive().nullable().optional(),
  brand: z.object({ id: z.number().int().positive(), name: z.string() }).nullable().optional(),
  averageRating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
}).passthrough();

export const productPageSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
}).refine((page) => page.items.length <= page.limit && page.total >= page.items.length, {
  message: 'Pagination du catalogue invalide.',
});

export const categorySchema = z.object({ id: z.number().int().positive(), name: z.string().min(1) });
export const brandSchema = categorySchema.extend({ profileImageUrl: z.string().nullable().optional() });
export type ProductDto = z.infer<typeof productSchema>;
export type ProductPageDto = z.infer<typeof productPageSchema>;
export interface ProductQuery {
  search?: string;
  categoryId?: string;
  gender?: string | null;
  nav?: string | null;
  filter?: string | null;
}
