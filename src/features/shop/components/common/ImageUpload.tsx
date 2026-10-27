import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/core/i18n';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxSize?: number; // en Mo
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange,
  maxSize = 5 
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const newUrls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);

    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    const validFiles: File[] = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(t('shop.invalidImageType'));
        continue;
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(t('shop.imageTooLarge', { value: maxSize }));
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="shop-image-upload">
      <div className="flex items-start gap-4">
        {/* Zone d'upload */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-4">
            {/* Images uploadées */}
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-32 h-32 rounded-lg border-2 border-(--color-border) overflow-hidden group bg-gray-100">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                  }}
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  type="button"
                  title={t('shop.remove')}
                  aria-label={t('shop.remove')}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Bouton d'ajout */}
            <button
              type="button"
              onClick={handleAddClick}
              aria-label={t('shop.addImage')}
              className="w-32 h-32 rounded-lg border-2 border-dashed border-(--color-border) bg-(--color-secondary) hover:bg-(--color-border) transition-colors flex items-center justify-center"
            >
              <Plus size={32} className="text-(--color-text-tertiary)" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            aria-label={t('shop.addImage')}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-(--color-text-secondary) mt-3">
            {t('shop.uploadFormats', { value: maxSize })}
          </p>

          {error && (
            <p className="text-xs text-(--color-error) mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
