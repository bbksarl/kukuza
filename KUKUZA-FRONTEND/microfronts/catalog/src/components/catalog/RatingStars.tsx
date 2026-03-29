import React, { FC } from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRateChange?: (rating: number) => void;
}

export const RatingStars: FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRateChange,
}) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: maxRating }).map((_, i) => {
        const isFilled = i < Math.round(rating);
        return (
          <button
            key={i}
            onClick={() => interactive && onRateChange?.(i + 1)}
            disabled={!interactive}
            className={`${sizeClass} transition-colors ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            ⭐
          </button>
        );
      })}
      <span className="text-sm text-gray-600 ml-2">
        {rating.toFixed(1)} ({maxRating})
      </span>
    </div>
  );
};
