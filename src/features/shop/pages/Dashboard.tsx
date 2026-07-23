import React from 'react';
import DashboardLayout from '@/layouts/shop/DashboardLayout';
import AnalyticsSection from '../components/common/AnalyticsSection';
import SalesChart from '../components/dashboard/SalesChart';
import VisitsChart from '../components/dashboard/VisitsChart';
import ProductsTable from '../components/dashboard/ProductsTable';
import { useDashboardData } from '../hooks/useDashboardData';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '@/core/i18n';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    stats,
    salesData,
    visitsData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardData();
  const {
    products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();

  if (isDashboardLoading || isProductsLoading) {
    return (
      <DashboardLayout activePath="/shop/dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">{t('shop.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if ((dashboardError && !stats) || (productsError && products.length === 0)) {
    return (
      <DashboardLayout activePath="/shop/dashboard">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t('shop.dashboardUnavailable')}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePath="/shop/dashboard">
      <div className="space-y-6 md:space-y-8">
        <AnalyticsSection
          stats={stats}
          isLoading={isDashboardLoading}
          error={dashboardError}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <VisitsChart data={visitsData} />
          </div>
        </div>

        <div className="overflow-hidden">
          <ProductsTable products={products} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
