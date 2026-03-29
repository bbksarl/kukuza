import React, { FC } from 'react';
import { Product } from '../../services/CatalogService';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  onClick?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(product.id)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-40 bg-gray-200 overflow-hidden">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-lg truncate text-gray-800">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mt-2">
          <RatingStars rating={product.rating} size="sm" />
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount} avis)
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price.toFixed(2)}€
          </span>
          <button className="bg-primary text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors text-sm">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};
