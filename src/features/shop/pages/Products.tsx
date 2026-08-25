import React from 'react';
import DashboardLayout from '@/layouts/shop/DashboardLayout';
import ProductsTable from '../components/dashboard/ProductsTable';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '@/core/i18n';

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    products,
    isLoading,
    error: productsError,
  } = useProducts();

  if (isLoading) {
    return (
      <DashboardLayout activePath="/shop/produits">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">{t('shop.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (productsError && products.length === 0) {
    return (
      <DashboardLayout activePath="/shop/produits">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t('shop.productsUnavailable')}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePath="/shop/produits">
      <div className="overflow-hidden">
        <ProductsTable products={products} />
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
