import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '@/services/catalog/CatalogService';
import { RatingStars } from '../components/catalog/RatingStars';
import { ReviewsList } from '../components/catalog/ReviewsList';
import { useLanguage } from '@/core/i18n';

export const ProductDetail: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, fetchProductById } = useProducts();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId).then(setProduct);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('catalog.loading')}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || t('catalog.noProducts')}
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
              width="768"
              height="384"
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
              {product.boutiqueName && (
                <p className="text-gray-500 mt-2 text-sm font-medium">
                  {product.boutiqueName}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <RatingStars rating={product.rating} />
              <p className="text-sm text-gray-500 mt-1">
                {t('catalog.basedOnReviews', { value: product.reviewCount })}
              </p>
            </div>

            {/* Price & Actions */}
            <div className="border-t pt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toFixed(2)}€
                </span>
              </div>

              <button type="button" disabled className="mt-6 w-full cursor-not-allowed rounded-lg bg-gray-400 py-3 text-lg font-semibold text-white" aria-disabled="true">
                {t('catalog.addToCart')}
              </button>

              <button type="button" disabled className="mt-3 w-full cursor-not-allowed rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-500" aria-disabled="true">
                {t('catalog.addToFavorites')}
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
