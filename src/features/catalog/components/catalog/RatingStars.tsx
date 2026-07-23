import { FC } from 'react';
import { useLanguage } from '@/core/i18n';

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
  const { t } = useLanguage();
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="flex items-center gap-1" aria-label={t('reviews.score', { value: rating.toFixed(1), max: maxRating })}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const isFilled = i < Math.round(rating);
        const star = <span aria-hidden="true">★</span>;

        return interactive ? (
          <button
            key={i}
            type="button"
            onClick={() => onRateChange?.(i + 1)}
            aria-label={t('reviews.giveStar', { value: i + 1 })}
            className={`${sizeClass} transition-colors ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            } cursor-pointer hover:scale-110`}
          >
            {star}
          </button>
        ) : (
          <span key={i} className={`${sizeClass} ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}>
            {star}
          </span>
        );
      })}
      <span className="ml-2 text-sm text-gray-600" aria-hidden="true">
        {rating.toFixed(1)} ({maxRating})
      </span>
    </div>
  );
};
