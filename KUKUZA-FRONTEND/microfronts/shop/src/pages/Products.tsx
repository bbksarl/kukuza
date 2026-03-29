import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AnalyticsSection from '../components/common/AnalyticsSection';
import ProductsTable from '../components/dashboard/ProductsTable';
import { useProducts } from '../hooks/useProducts';

const ProductsPage: React.FC = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <DashboardLayout activePath="/produits">
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
    <DashboardLayout activePath="/produits">
      <div className="space-y-6 md:space-y-8">
        {/* Section Analytics fixe */}
        <AnalyticsSection />

        {/* Products Table */}
        <div className="overflow-hidden">
          <ProductsTable products={products} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
