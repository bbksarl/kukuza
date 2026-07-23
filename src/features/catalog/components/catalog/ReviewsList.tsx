import { FC, useEffect, useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { RatingStars } from './RatingStars';
import { useLanguage } from '@/core/i18n';

interface ReviewsListProps {
  productId: string;
  canAddReview?: boolean;
}

export const ReviewsList: FC<ReviewsListProps> = ({ productId, canAddReview = false }) => {
  const { reviews, loading, error, fetchReviews, addReview } = useReviews(productId);
  const { t } = useLanguage();
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddReview = async () => {
    if (!newContent.trim()) return;

    setSubmitting(true);
    try {
      await addReview(newRating, newContent);
      setNewContent('');
      setNewRating(5);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'avis', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Review Form */}
      {canAddReview && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">{t('reviews.add')}</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="review-rating" className="block text-sm font-medium mb-2">
                {t('reviews.rating')}
              </label>
              <RatingStars
                rating={newRating}
                interactive={true}
                onRateChange={setNewRating}
              />
            </div>

            <div>
              <label htmlFor="review-content" className="block text-sm font-medium mb-2">
                {t('reviews.yourReview')}
              </label>
              <textarea
                id="review-content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={t('reviews.placeholder')}
                rows={4}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleAddReview}
              disabled={submitting || !newContent.trim()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
            >
              {submitting ? t('reviews.submitting') : t('reviews.submit')}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="font-semibold mb-4">{t('reviews.title', { value: reviews.length })}</h3>

        {loading && <p className="text-gray-600" role="status">{t('reviews.loading')}</p>}
        {error && <p className="text-red-600" role="alert">{t('reviews.error', { value: error })}</p>}

        {reviews.length === 0 && !loading && (
          <p className="text-gray-500">{t('reviews.empty')}</p>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.userName}</p>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
