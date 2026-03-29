import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AnalyticsSection from '../components/common/AnalyticsSection';
import SalesChart from '../components/dashboard/SalesChart';
import VisitsChart from '../components/dashboard/VisitsChart';
import ProductsTable from '../components/dashboard/ProductsTable';
import { useDashboardData } from '../hooks/useDashboardData';
import { useProducts } from '../hooks/useProducts';

const DashboardPage: React.FC = () => {
  const { salesData, visitsData, isLoading: isDashboardLoading } = useDashboardData();
  const { products, isLoading: isProductsLoading } = useProducts();

  if (isDashboardLoading || isProductsLoading) {
    return (
      <DashboardLayout activePath="/dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePath="/dashboard">
      <div className="space-y-6 md:space-y-8">
        {/* Section Analytics fixe */}
        <AnalyticsSection />

        {/* Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <VisitsChart data={visitsData} />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden">
          <ProductsTable products={products} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
