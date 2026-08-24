export type AdminKpi = {
  id: string;
  labelKey: string;
  value: string;
  trend: string;
  trendPositive: boolean;
};

export type AdminSalesPoint = {
  label: string;
  value: number;
};

export type AdminBoutique = {
  id: string;
  name: string;
  owner: string;
  image: string;
  isDefault?: boolean;
  status: 'active' | 'pending' | 'suspended';
  products: number;
  revenue: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  image: string;
  unitsSold: number;
  revenue: number;
  stock: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'creator' | 'admin';
  joinedAt: string;
  status: 'active' | 'pending';
};

export type AdminOverview = {
  kpis: AdminKpi[];
  sales: AdminSalesPoint[];
  boutiques: AdminBoutique[];
  topProducts: AdminProduct[];
  recentUsers: AdminUser[];
};
