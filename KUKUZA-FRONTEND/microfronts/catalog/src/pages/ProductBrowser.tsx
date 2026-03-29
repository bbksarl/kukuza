import React, { FC, useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';

export const ProductBrowser: FC = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchProducts({
      categoryId: selectedCategory || undefined,
      page: 1,
      limit: 20,
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Découvrez nos produits
          </h1>
          <p className="text-gray-600 mt-2">
            Parcourez notre large sélection de produits
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Toutes les catégories</option>
            <option value="fashion">Mode</option>
            <option value="electronics">Électronique</option>
            <option value="home">Maison</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Erreur: {error}
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
                  // Naviguer vers la page de détail
                  window.location.href = `/catalog/product/${productId}`;
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Aucun produit trouvé pour cette catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBrowser;
