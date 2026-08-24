import type { AdminOverview } from '../types';
import { DEFAULT_BOUTIQUE } from '@/features/shop/data/defaultBoutique';

export const mockAdminOverview: AdminOverview = {
  kpis: [
    { id: 'revenue', labelKey: 'admin.kpi.revenue', value: '128 450 €', trend: '+12,8%', trendPositive: true },
    { id: 'boutiques', labelKey: 'admin.kpi.boutiques', value: '42', trend: '+4 ce mois', trendPositive: true },
    { id: 'users', labelKey: 'admin.kpi.users', value: '1 248', trend: '+8,4%', trendPositive: true },
    { id: 'products', labelKey: 'admin.kpi.products', value: '3 684', trend: '+186', trendPositive: true },
  ],
  sales: [
    { label: 'Lun', value: 9200 },
    { label: 'Mar', value: 12800 },
    { label: 'Mer', value: 11400 },
    { label: 'Jeu', value: 16800 },
    { label: 'Ven', value: 19400 },
    { label: 'Sam', value: 23600 },
    { label: 'Dim', value: 20700 },
  ],
  boutiques: [
    {
      id: DEFAULT_BOUTIQUE.id,
      name: DEFAULT_BOUTIQUE.name,
      owner: DEFAULT_BOUTIQUE.ownerName,
      image: DEFAULT_BOUTIQUE.logo ?? '/assets/logo.png',
      isDefault: true,
      status: DEFAULT_BOUTIQUE.status,
      products: 12,
      revenue: 52600,
    },
    { id: 'boutique-1', name: 'Maison Nene', owner: 'Nene Yayah', image: '/assets/boutiques/shop1.png', status: 'active', products: 248, revenue: 28400 },
    { id: 'boutique-2', name: 'Atelier Rabbal', owner: 'Rabbal Diop', image: '/assets/boutiques/shop2.png', status: 'active', products: 186, revenue: 23150 },
    { id: 'boutique-3', name: 'Jeyna A', owner: 'Jeyna A.', image: '/assets/boutiques/shop3.png', status: 'active', products: 134, revenue: 19880 },
    { id: 'boutique-4', name: 'BTOURE', owner: 'Binta Touré', image: '/assets/boutiques/shop4.png', status: 'pending', products: 76, revenue: 9400 },
    { id: 'boutique-5', name: 'Colle Sow Ardo', owner: 'Colle Sow Ardo', image: '/assets/boutiques/shop5.png', status: 'active', products: 112, revenue: 8750 },
  ],
  topProducts: [
    { id: 'product-1', name: 'Robe Soleil Dakar', brand: 'Maison Nene', image: '/assets/products/p1.png', unitsSold: 184, revenue: 23000, stock: 36 },
    { id: 'product-2', name: 'Escarpins Ebane', brand: 'Jeyna A', image: '/assets/products/p7.png', unitsSold: 142, revenue: 16330, stock: 21 },
    { id: 'product-3', name: 'Caftan Luxe', brand: 'KUKUZA Selection', image: '/assets/mVentes/im3.png', unitsSold: 118, revenue: 10608, stock: 18 },
    { id: 'product-4', name: 'Sneakers Kora', brand: 'Owens', image: '/assets/products/p5.png', unitsSold: 97, revenue: 8245, stock: 9 },
  ],
  recentUsers: [
    { id: 'user-1', name: 'Aminata Fall', email: 'aminata.fall@example.com', role: 'customer', joinedAt: '23 juil. 2026', status: 'active' },
    { id: 'user-2', name: 'Binta Touré', email: 'binta@btoure.com', role: 'creator', joinedAt: '22 juil. 2026', status: 'pending' },
    { id: 'user-3', name: 'Moussa Diagne', email: 'moussa.diagne@example.com', role: 'customer', joinedAt: '21 juil. 2026', status: 'active' },
    { id: 'user-4', name: 'Jeyna A.', email: 'contact@jeynaa.com', role: 'creator', joinedAt: '20 juil. 2026', status: 'active' },
  ],
};
