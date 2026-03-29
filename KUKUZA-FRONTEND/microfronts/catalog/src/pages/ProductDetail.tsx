import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../services/CatalogService';
import { RatingStars } from '../components/catalog/RatingStars';
import { ReviewsList } from '../components/catalog/ReviewsList';

export const ProductDetail: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, fetchProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId).then(setProduct);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Produit non trouvé'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div>
              <RatingStars rating={product.rating} />
              <p className="text-sm text-gray-500 mt-1">
                Basé sur {product.reviewCount} avis
              </p>
            </div>

            {/* Price & Actions */}
            <div className="border-t pt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toFixed(2)}€
                </span>
              </div>

              <button className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg">
                Ajouter au panier
              </button>

              <button className="mt-3 w-full border-2 border-primary text-primary py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
                Ajouter aux favoris
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg p-8">
          <ReviewsList productId={product.id} canAddReview={true} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
