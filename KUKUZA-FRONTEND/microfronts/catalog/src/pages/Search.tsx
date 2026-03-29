import React, { FC, useState, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';

export const Search: FC = () => {
  const { products, loading, error, searchProducts } = useProducts();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchProducts(query);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Rechercher des produits
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, description..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Erreur: {error}
          </div>
        )}

        {/* Results */}
        {!loading && query && products.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              {products.length} résultat(s) trouvé(s) pour "{query}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={(productId) => {
                    window.location.href = `/catalog/product/${productId}`;
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
              Aucun produit ne correspond à votre recherche.
            </p>
          </div>
        )}

        {/* No Query */}
        {!query && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Entrez un terme de recherche pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
