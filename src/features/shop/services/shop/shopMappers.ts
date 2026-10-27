import {
  chartPointSchema, dashboardStatsSchema, parseShopResponse, shopProductSchema,
  shopRecordSchema, shopSaleSchema, visitsPointSchema,
} from '@/api/contracts/shop';
import { z } from 'zod';
import type { DashboardOverview, Product, SaleItem } from '../../types';

const record = (input: unknown) => parseShopResponse(shopRecordSchema, input);
const list = (input: unknown): unknown[] => parseShopResponse(z.array(z.unknown()), input);

const productStatus = (value: unknown, stock: unknown): unknown => {
  if (value == null) {
    // This status is derived only from stock; invalid stock is rejected by the schema.
    if (typeof stock !== 'number') return undefined;
    return stock === 0 ? 'out_of_stock' : stock <= 10 ? 'low_stock' : 'in_stock';
  }
  const aliases: Record<string, string> = {
    'in-stock': 'in_stock', available: 'in_stock', available_stock: 'in_stock',
    'out-of-stock': 'out_of_stock', unavailable: 'out_of_stock', sold_out: 'out_of_stock',
    'low-stock': 'low_stock', low: 'low_stock',
  };
  const normalized = typeof value === 'string' ? value.toLowerCase() : value;
  return typeof normalized === 'string' ? aliases[normalized] ?? normalized : normalized;
};

const saleStatus = (value: unknown): unknown => {
  const aliases: Record<string, string> = {
    complete: 'completed', paid: 'completed', success: 'completed',
    waiting: 'pending', processing: 'pending',
  };
  const normalized = typeof value === 'string' ? value.toLowerCase() : value;
  return typeof normalized === 'string' ? aliases[normalized] ?? normalized : normalized;
};

export const mapProduct = (input: unknown): Product => {
  const source = record(input);
  const stock = source.stock ?? source.quantity;
  const images = source.images ?? source.productImages;
  const firstImage = images == null ? undefined : list(images)[0];
  const imageFromCollection = firstImage == null || typeof firstImage === 'string' ? firstImage : record(firstImage).imageUrl;
  const category = source.category == null || typeof source.category === 'string'
    ? source.category ?? source.categoryName
    : record(source.category).name;
  const brand = source.brand != null && typeof source.brand !== 'string' ? record(source.brand) : undefined;

  return parseShopResponse(shopProductSchema, {
    id: source.id,
    name: source.name ?? source.title,
    price: source.price,
    stock,
    category,
    reference: source.reference ?? source.referenceCode ?? source.ref,
    image: source.image ?? source.imageUrl ?? imageFromCollection,
    status: productStatus(source.status, stock),
    createdAt: source.createdAt ?? source.created_at,
    updatedAt: source.updatedAt ?? source.updated_at,
    boutiqueId: source.boutiqueId ?? source.shopId ?? source.brandId ?? source.creatorId ?? brand?.id,
    boutiqueName: source.boutiqueName ?? source.shopName ?? source.creatorName ?? brand?.name ?? (typeof source.brand === 'string' ? source.brand : undefined),
    gender: source.gender,
    ageRange: source.ageRange ?? source.age_range,
  });
};

export const mapSaleItem = (input: unknown): SaleItem => {
  const source = record(input);
  return parseShopResponse(shopSaleSchema, {
    id: source.id,
    productName: source.productName ?? source.product_name ?? source.product,
    reference: source.reference ?? source.referenceCode,
    quantity: source.quantity,
    unitPrice: source.unitPrice ?? source.unit_price,
    totalPrice: source.totalPrice ?? source.total_price,
    customer: source.customer ?? source.customerName,
    date: source.date ?? source.createdAt ?? source.created_at,
    status: saleStatus(source.status),
  });
};

const metric = (source: Record<string, unknown>, keys: string[]): unknown => {
  return keys.map((key) => source[key]).find((value) => value != null);
};

const mapStats = (source: Record<string, unknown>) => parseShopResponse(dashboardStatsSchema, {
  totalRevenue: metric(source, ['tr', 'revenue', 'totalRevenue', 'total_revenue']),
  revenueChange: metric(source, ['variation', 'revenueChange', 'revenue_change', 'change']),
  dailyRevenue: metric(source, ['dailyRevenue', 'daily_revenue', 'dailyTr', 'daily_tr']),
  dailyRevenueChange: metric(source, ['dailyRevenueChange', 'daily_revenue_change']),
  totalSales: metric(source, ['sold', 'quantity', 'totalSales', 'total_sales']),
  salesChange: metric(source, ['salesChange', 'sales_change']),
  activeUsers: metric(source, ['active_users', 'activeUsers', 'users']),
  usersChange: metric(source, ['usersChange', 'users_change']),
});

const listFrom = (source: Record<string, unknown>, keys: string[]): unknown[] => {
  const key = keys.find((key) => source[key] !== undefined);
  return key ? list(source[key]) : [];
};

const mapChartPoint = (input: unknown) => {
  const source = record(input);
  return parseShopResponse(chartPointSchema, {
    label: source.label ?? source.name ?? source.day ?? source.month,
    value: source.value ?? source.amount ?? source.total ?? source.tr ?? source.revenue,
    date: source.date,
  });
};

const mapVisitsPoint = (input: unknown) => {
  const source = record(input);
  return parseShopResponse(visitsPointSchema, {
    day: source.day ?? source.label,
    visits: source.visits ?? source.active_users ?? source.activeUsers ?? source.value,
  });
};

/** Adapt known aliases, then validate; missing totals never become zero. */
export const mapAnalyticsResponse = (input: unknown): DashboardOverview => {
  const root = record(input);
  const nested = root.metrics ?? root.cache ?? root.data ?? root.stats;
  const source = nested == null ? root : record(nested);
  return {
    stats: mapStats(source),
    salesData: listFrom(source, ['salesData', 'sales_data', 'trend'])
      .concat(source === root ? [] : listFrom(root, ['salesData', 'sales_data'])).map(mapChartPoint),
    visitsData: listFrom(source, ['visitsData', 'visits_data', 'visits'])
      .concat(source === root ? [] : listFrom(root, ['visitsData', 'visits_data'])).map(mapVisitsPoint),
  };
};

export const mapDashboardOverview = mapAnalyticsResponse;
