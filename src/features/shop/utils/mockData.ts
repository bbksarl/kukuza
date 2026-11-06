import type {
  DashboardOverview,
  DashboardStats,
  ChartDataPoint,
  VisitsData,
  Product,
  SaleItem,
  CreateProductInput,
} from '../types';
import { runtimeConfig } from '@/config/runtime';
import type { ShopCategory } from '../services/shop/shopService';

export const getMockCategories = (): ShopCategory[] => [
  { id: 1, name: 'Vetements' },
  { id: 2, name: 'Chaussures' },
  { id: 3, name: 'Accessoires' },
  { id: 4, name: 'Electronique' },
  { id: 5, name: 'Livres' },
  { id: 6, name: 'Jouets' },
  { id: 7, name: 'Autres' },
];

const DEMO_PRODUCT_STATE_KEY = 'kukuza-shop-demo-product-state-v1';
interface DemoProductState {
  overrides: Record<string, Product>;
  deletedIds: string[];
}

const readDemoProductState = (): DemoProductState => {
  if (typeof window === 'undefined') return { overrides: {}, deletedIds: [] };
  try {
    const saved = window.localStorage.getItem(DEMO_PRODUCT_STATE_KEY);
    if (!saved) return { overrides: {}, deletedIds: [] };
    const parsed = JSON.parse(saved) as Partial<DemoProductState>;
    const overrides = Object.fromEntries(Object.entries(parsed.overrides ?? {}).map(([id, product]) => [id, {
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }]));
    return { overrides, deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [] };
  } catch {
    return { overrides: {}, deletedIds: [] };
  }
};

const writeDemoProductState = (state: DemoProductState): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEMO_PRODUCT_STATE_KEY, JSON.stringify(state));
  } catch {
    // The current UI state still works if browser storage is unavailable.
  }
};

export const saveMockProductOverride = (product: Product): void => {
  const state = readDemoProductState();
  writeDemoProductState({
    overrides: { ...state.overrides, [product.id]: product },
    deletedIds: state.deletedIds.filter((id) => id !== product.id),
  });
};

export const deleteMockProduct = (productId: string): void => {
  const state = readDemoProductState();
  const overrides = { ...state.overrides };
  delete overrides[productId];
  writeDemoProductState({ overrides, deletedIds: [...new Set([...state.deletedIds, productId])] });
};

export const getMockDashboardStats = (): DashboardStats => ({
  totalRevenue: 2450000,
  revenueChange: 12.4,
  dailyRevenue: 185000,
  dailyRevenueChange: 8.2,
  totalSales: 74,
  salesChange: 9.3,
  activeUsers: 126,
  usersChange: 15.1
});

export const getMockSalesData = (): ChartDataPoint[] => [
  { label: 'Lun', value: 92000 },
  { label: 'Mar', value: 138000 },
  { label: 'Mer', value: 115000 },
  { label: 'Jeu', value: 176000 },
  { label: 'Ven', value: 154000 },
  { label: 'Sam', value: 225000 },
  { label: 'Dim', value: 185000 },
];

export const getMockVisitsData = (): VisitsData[] => [
  { day: 'Lun', visits: 84 },
  { day: 'Mar', visits: 112 },
  { day: 'Mer', visits: 97 },
  { day: 'Jeu', visits: 136 },
  { day: 'Ven', visits: 154 },
  { day: 'Sam', visits: 208 },
  { day: 'Dim', visits: 173 },
];

export const getMockProducts = (): Product[] => {
  const now = new Date();
  const createdAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const seeds: Product[] = [
    { id: 'demo-product-1', reference: 'KZ-1001', name: 'Robe Soleil Dakar', category: 'Vêtements', price: 125, stock: 18, image: '/assets/products/p1.png', status: 'in_stock', createdAt, updatedAt: now },
    { id: 'demo-product-2', reference: 'KZ-1002', name: 'Top Atelier Indigo', category: 'Vêtements', price: 48, stock: 7, image: '/assets/products/p2.png', status: 'low_stock', createdAt, updatedAt: now },
    { id: 'demo-product-3', reference: 'KZ-1003', name: 'Pantalon Signature', category: 'Vêtements', price: 95, stock: 12, image: '/assets/products/p3.png', status: 'in_stock', createdAt, updatedAt: now },
    { id: 'demo-product-4', reference: 'KZ-1004', name: 'Veste Harmattan', category: 'Vêtements', price: 160, stock: 0, image: '/assets/products/p4.png', status: 'out_of_stock', createdAt, updatedAt: now },
    { id: 'demo-product-5', reference: 'KZ-1005', name: 'Sneakers Kora', category: 'Chaussures', price: 85, stock: 9, image: '/assets/products/p5.png', status: 'low_stock', createdAt, updatedAt: now },
    { id: 'demo-product-6', reference: 'KZ-1006', name: 'Sandales Orfèvre', category: 'Chaussures', price: 62, stock: 23, image: '/assets/products/p6.png', status: 'in_stock', createdAt, updatedAt: now },
  ];
  const state = readDemoProductState();
  return seeds
    .filter((product) => !state.deletedIds.includes(product.id))
    .map((product) => state.overrides[product.id] ?? product);
};

export const getMockDashboardOverview = (): DashboardOverview => ({
  stats: getMockDashboardStats(),
  salesData: getMockSalesData(),
  visitsData: getMockVisitsData(),
});

export const getMockSales = (): SaleItem[] => {
  const now = new Date();
  return [
    { id: 'demo-sale-1', productName: 'Robe Soleil Dakar', reference: 'KZ-1001', quantity: 1, unitPrice: 125, totalPrice: 125, customer: 'Aminata Fall', date: new Date(now.getTime() - 2 * 60 * 60 * 1000), status: 'completed' },
    { id: 'demo-sale-2', productName: 'Sneakers Kora', reference: 'KZ-1005', quantity: 1, unitPrice: 85, totalPrice: 85, customer: 'Moussa Diagne', date: new Date(now.getTime() - 5 * 60 * 60 * 1000), status: 'pending' },
    { id: 'demo-sale-3', productName: 'Top Atelier Indigo', reference: 'KZ-1002', quantity: 2, unitPrice: 48, totalPrice: 96, customer: 'Fatou Ndiaye', date: new Date(now.getTime() - 24 * 60 * 60 * 1000), status: 'completed' },
  ];
};

export const buildMockCreatedProduct = (input: CreateProductInput): Product => {
  const now = new Date();

  return {
    id: `product-${Date.now()}`,
    reference: `REF-${String(Math.floor(100000 + Math.random() * 900000))}`,
    name: input.name,
    category: input.category,
    price: input.price,
    stock: input.quantity,
    image: input.images[0] ? URL.createObjectURL(input.images[0]) : undefined,
    status: input.quantity === 0 ? 'out_of_stock' : input.quantity <= 10 ? 'low_stock' : 'in_stock',
    gender: input.gender,
    ageRange: input.ageRange,
    createdAt: now,
    updatedAt: now
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: runtimeConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'short') {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
