import { useEffect, useState } from 'react';
import { useLanguage } from '@/core/i18n';

export default function ProductPreview({ image }: { image?: File }) {
  const { t } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!image) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);
  return (
    <>
      <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-4">
        {t('shop.previewMain')}
      </h3>
      <div className="aspect-square rounded-xl bg-(--color-secondary) flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={t('shop.previewMain')}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 md:p-8">
            <svg
              className="w-16 md:w-24 h-16 md:h-24 mx-auto text-(--color-text-tertiary) mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs md:text-sm text-(--color-text-tertiary)">
              {t('shop.noImage')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
