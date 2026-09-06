import { FC } from 'react';
import { Product } from '@/services/catalog/CatalogService';
import { RatingStars } from './RatingStars';
import { useLanguage } from '@/core/i18n';

interface ProductCardProps {
  product: Product;
  onClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const { t } = useLanguage();
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg">
      {/* Image */}
      <button
        type="button"
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={() => onClick?.(product.id)}
        aria-label={`${t('catalog.viewProduct')} ${product.name}`}
      >
      <div className="h-40 w-full overflow-hidden bg-gray-200">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          loading="lazy"
          width="320"
          height="160"
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      </button>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <button type="button" className="truncate text-left text-lg font-semibold text-gray-800 hover:text-primary" onClick={() => onClick?.(product.id)}>
            {product.name}
          </button>

        {product.boutiqueName && (
          <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-gray-500">
            {product.boutiqueName}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mt-2">
          <RatingStars rating={product.rating} size="sm" />
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount} {t('reviews.short')})
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price.toFixed(2)}€
          </span>
          <button
            type="button"
            className="rounded bg-primary px-3 py-1 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!onAddToCart}
            onClick={() => onAddToCart?.(product.id)}
            aria-disabled={!onAddToCart}
          >
            {t('catalog.add')}
          </button>
        </div>
      </div>
    </article>
  );
};
