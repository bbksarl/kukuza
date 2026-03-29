
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  avatar?: string;
}

export interface Boutique {
  id: string;
  name: string;
  logo?: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  reference: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  dailyRevenue: number;
  dailyRevenueChange: number;
  totalSales: number;
  salesChange: number;
  activeUsers: number;
  usersChange: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

export interface SalesReport {
  period: 'day' | 'week' | 'month' | 'year';
  data: ChartDataPoint[];
}

export interface VisitsData {
  day: string;
  visits: number;
}

export type ProductFilter = 'all' | 'in_stock' | 'out_of_stock';

export type TimeFilter = 'day' | 'week' | 'month' | 'year';
