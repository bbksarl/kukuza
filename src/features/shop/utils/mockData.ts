import type {
  DashboardOverview,
  DashboardStats,
  ChartDataPoint,
  VisitsData,
  Product,
  SaleItem,
  CreateProductInput,
} from '../types';

export const getMockDashboardStats = (): DashboardStats => ({
  totalRevenue: 0,
  revenueChange: 0,
  dailyRevenue: 0,
  dailyRevenueChange: 0,
  totalSales: 0,
  salesChange: 0,
  activeUsers: 0,
  usersChange: 0
});

export const getMockSalesData = (): ChartDataPoint[] => {
  return [];
};

export const getMockVisitsData = (): VisitsData[] => [];

export const getMockProducts = (): Product[] => {
  return [];
};

export const getMockDashboardOverview = (): DashboardOverview => ({
  stats: getMockDashboardStats(),
  salesData: getMockSalesData(),
  visitsData: getMockVisitsData(),
});

export const getMockSales = (): SaleItem[] => [];

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
  return `${new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} F CFA`;
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
