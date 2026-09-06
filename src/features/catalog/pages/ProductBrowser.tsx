import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { useLanguage } from '@/core/i18n';
import Seo from '@/components/seo/Seo';

const PRODUCTS_PER_PAGE = 20;

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis-start',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    totalPages,
  ];
};

export const ProductBrowser: FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, total, fetchProducts } = useProducts();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const pageItems = getPageItems(page, totalPages);

  useEffect(() => {
    fetchProducts({
      categoryId: selectedCategory || undefined,
      page,
      limit: PRODUCTS_PER_PAGE,
    });
  }, [fetchProducts, page, selectedCategory]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title="Catalogue produits | KUKUZA"
        description="Explorez le catalogue KUKUZA et découvrez les produits proposés par nos boutiques et créateurs."
        path="/catalog"
      />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('catalog.discoverProducts')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('catalog.browseSelection')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t('catalog.allCategories')}</option>
            <option value="fashion">{t('catalog.fashion')}</option>
            <option value="electronics">{t('catalog.electronics')}</option>
            <option value="home">{t('catalog.home')}</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('catalog.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {t('reviews.error', { value: error })}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={(productId) => {
                  navigate(`/catalog/product/${productId}`);
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <nav
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
            aria-label={t('catalog.pagination')}
          >
            <p className="text-sm text-gray-600">
              {t('catalog.showingProducts', {
                start: (page - 1) * PRODUCTS_PER_PAGE + 1,
                end: Math.min(page * PRODUCTS_PER_PAGE, total),
                total,
              })}
            </p>

            <div className="flex items-center gap-1" role="group">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t('catalog.previousPage')}
              >
                {t('catalog.previous')}
              </button>

              {pageItems.map((pageItem) => {
                if (typeof pageItem !== 'number') {
                  return (
                    <span key={pageItem} className="px-2 text-gray-500" aria-hidden="true">
                      …
                    </span>
                  );
                }

                const isCurrentPage = pageItem === page;

                return (
                  <button
                    key={pageItem}
                    type="button"
                    onClick={() => setPage(pageItem)}
                    aria-current={isCurrentPage ? 'page' : undefined}
                    aria-label={t('catalog.goToPage', { value: pageItem })}
                    className={`min-w-10 rounded-md border px-3 py-2 text-sm transition-colors ${
                      isCurrentPage
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageItem}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page === totalPages}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t('catalog.nextPage')}
              >
                {t('catalog.next')}
              </button>
            </div>
          </nav>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t('catalog.emptyCategory')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBrowser;
