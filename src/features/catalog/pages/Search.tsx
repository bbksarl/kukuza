import React, { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { useLanguage } from '@/core/i18n';

export const Search: FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, searchProducts } = useProducts();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchProducts(query);
    }
  }, [query, searchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('catalog.searchProducts')}
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('catalog.searchByName')}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              {t('search.submit')}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('catalog.searching')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {t('reviews.error', { value: error })}
          </div>
        )}

        {/* Results */}
        {!loading && query && products.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              {products.length} {t('catalog.results', { value: query })}
            </p>
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
          </div>
        )}

        {/* Empty State */}
        {!loading && query && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t('catalog.noMatch')}
            </p>
          </div>
        )}

        {/* No Query */}
        {!query && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {t('catalog.enterSearch')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
