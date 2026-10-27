import type { PortalProduct } from './types';
import { categoryLabelMap } from './labels';
import { normalizeText } from './text';
import { z } from 'zod';
import { entityIdSchema } from '@/api/contracts/identifiers';

const productIdentitySchema = z.object({ id: entityIdSchema, name: z.string().trim().min(1), price: z.number().nonnegative() });

export function normalizeProduct(raw: Record<string, unknown>): PortalProduct {
  const identity = productIdentitySchema.parse(raw);
  const image = typeof raw.image_url === 'string' && raw.image_url
    ? raw.image_url
    : typeof raw.image === 'string' && raw.image
      ? raw.image
      : typeof raw.imageUrl === 'string' && raw.imageUrl
        ? raw.imageUrl
        : '/assets/products/p1.png';
  const boutique = (raw.boutique ?? raw.shop ?? raw.creator ?? (typeof raw.brand === 'object' ? raw.brand : undefined)) as Record<string, unknown> | undefined;
  const boutiqueId = raw.brandId
    ?? raw.boutique_id
    ?? raw.boutiqueId
    ?? raw.shop_id
    ?? raw.shopId
    ?? raw.creator_id
    ?? raw.creatorId
    ?? boutique?.id;
  const boutiqueName = typeof raw.boutique_name === 'string' && raw.boutique_name
    ? raw.boutique_name
    : typeof raw.boutiqueName === 'string' && raw.boutiqueName
      ? raw.boutiqueName
      : typeof raw.shop_name === 'string' && raw.shop_name
        ? raw.shop_name
        : typeof raw.shopName === 'string' && raw.shopName
        ? raw.shopName
          : typeof boutique?.name === 'string' && boutique.name
            ? boutique.name
          : undefined;
  const brand = typeof raw.brand === 'string' && raw.brand ? raw.brand : boutiqueName || 'Boutique Premium';
  const creator = typeof raw.creator_name === 'string' && raw.creator_name
    ? raw.creator_name
    : typeof raw.creatorName === 'string' && raw.creatorName
      ? raw.creatorName
      : brand;
  const rawCategory = typeof raw.category === 'string'
    ? raw.category
    : typeof raw.category === 'object' && raw.category !== null
      ? String((raw.category as Record<string, unknown>).name ?? '')
      : typeof raw.categoryName === 'string'
        ? raw.categoryName
        : '';
  const categoryValue = normalizeText(rawCategory);
  const normalizedCategory = ['soin', 'soins', 'beaute', 'beauty', 'cosmetique', 'cosmetics'].includes(categoryValue)
    ? 'skincare'
    : categoryValue;
  const category = ['vetements', 'chaussures', 'decor', 'sacs', 'accessoires', 'bijoux', 'skincare'].includes(normalizedCategory)
    ? normalizedCategory as PortalProduct['category']
    : 'vetements';

  return {
    id: identity.id,
    name: identity.name,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    price: identity.price,
    image_url: image,
    brand,
    creator_name: creator,
    boutique_id: boutiqueId == null ? undefined : String(boutiqueId),
    boutique_name: boutiqueName || brand,
    category,
    subcategory: typeof raw.subcategory === 'string' && raw.subcategory ? raw.subcategory : categoryLabelMap[category],
    gender: typeof raw.gender === 'string' ? raw.gender : undefined,
    ageRange: typeof raw.ageRange === 'string'
      ? raw.ageRange
      : typeof raw.age_range === 'string'
        ? raw.age_range
        : undefined,
    sizes: Array.isArray(raw.sizes) ? raw.sizes.filter((size): size is string => typeof size === 'string') : [],
    style: typeof raw.style === 'string' ? raw.style : undefined,
    material: typeof raw.material === 'string' ? raw.material : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    collections: Array.isArray(raw.collections) ? raw.collections.filter((tag): tag is string => typeof tag === 'string') : [],
    recency: raw.recency === 'Semaine précédente' ? 'Semaine précédente' : 'Cette semaine',
    isPromoted: Boolean(raw.isPromoted),
  };
}
