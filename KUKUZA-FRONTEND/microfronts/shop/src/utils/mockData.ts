import type { DashboardStats, ChartDataPoint, VisitsData, Product } from '../types';

export const getMockDashboardStats = (): DashboardStats => ({
  totalRevenue: 52600,
  revenueChange: 3.4,
  dailyRevenue: 902,
  dailyRevenueChange: -3.4,
  totalSales: 22,
  salesChange: 0,
  activeUsers: 11,
  usersChange: 0
});

export const getMockSalesData = (): ChartDataPoint[] => {
  const months = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const data: ChartDataPoint[] = [
    { label: 'Lun', value: 30000 },
    { label: 'Mar', value: 45000 },
    { label: 'Mer', value: 55000 },
    { label: 'Jeu', value: 40000 },
    { label: 'Ven', value: 60000 },
    { label: 'Sam', value: 75000 },
    { label: 'Dim', value: 90000 }
  ];

  return data;
};

export const getMockVisitsData = (): VisitsData[] => [
  { day: 'L', visits: 150 },
  { day: 'M', visits: 280 },
  { day: 'M', visits: 210 },
  { day: 'J', visits: 180 },
  { day: 'V', visits: 320 },
  { day: 'S', visits: 120 },
  { day: 'D', visits: 90 }
];

export const getMockProducts = (): Product[] => {
  const products: Product[] = [];
  
  for (let i = 1; i <= 12; i++) {
    const status = i <= 8 ? 'in_stock' : 'out_of_stock';
    
    products.push({
      id: `product-${i}`,
      reference: `REF-${String(897654 - i).padStart(6, '0')}`,
      name: `Produit ${i}`,
      category: 'Vetements',
      price: 29.99 + (i * 5),
      stock: 250,
      status,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return products;
};

export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
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
