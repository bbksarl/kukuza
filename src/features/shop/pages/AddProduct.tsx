import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardLayout from '@/layouts/shop/DashboardLayout';
import Card from '../components/common/Card';
import ImageUpload from '../components/common/ImageUpload';
import type { ProductFormValues } from '../types';
import { shopService, type ShopCategory } from '@/services/shop';
import {
  createEmptyProductForm,
  getGenderOptions,
  PRODUCT_AGE_RANGES,
  toCreateProductInput,
  validateProductForm,
} from '../utils/productForm';
import { useLanguage } from '@/core/i18n';
import { runtimeConfig } from '@/config/runtime';

const AddProductPage: React.FC = () => {
  const { t, translateCatalogLabel, translateText } = useLanguage();
  const [formData, setFormData] = useState<ProductFormValues>(createEmptyProductForm());
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    shopService.getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setCategoriesError(error instanceof Error ? error.message : t('shop.saveError'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleInputChange = (field: keyof ProductFormValues, value: string) => {
    setFormData((previous) => {
      const nextFormData = { ...previous, [field]: value };
      if (field === 'ageRange') {
        nextFormData.gender = '';
      }
      return nextFormData;
    });

    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: '' }));
    }

    if (field === 'ageRange' && errors.gender) {
      setErrors((previous) => ({ ...previous, gender: '' }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((previous) => ({ ...previous, images }));
    if (errors.images) {
      setErrors((previous) => ({ ...previous, images: '' }));
    }
  };

  const handleReset = () => {
    setFormData(createEmptyProductForm());
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const validateCurrentForm = (): boolean => {
    const nextErrors = validateProductForm(formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitProduct = async (successMessage: string) => {
    if (!validateCurrentForm()) {
      setSubmitSuccess(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await shopService.createProduct(toCreateProductInput(formData));
      handleReset();
      setSubmitSuccess(successMessage);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('shop.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    void submitProduct(t('shop.saved'));
  };

  const handlePublish = () => {
    void submitProduct(t('shop.published'));
  };

  useEffect(() => {
    if (formData.images.length === 0) {
      setMainPreviewUrl(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(formData.images[0]);
    setMainPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [formData.images]);

  const genderOptions = getGenderOptions(formData.ageRange);

  return (
    <DashboardLayout activePath="/shop/produits/ajouter">
      <div className="shop-dashboard shop-add-product max-w-7xl mx-auto px-0">
        <h1 className="text-xl md:text-2xl font-bold text-(--color-text-primary) mb-6 md:mb-8">
          {t('shop.addProductsTitle')}
        </h1>

        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {submitSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.itemName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.name ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                    placeholder={t('shop.itemNamePlaceholder')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{translateText(errors.name)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.itemCategory')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(event) => handleInputChange('category', event.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.category ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                  >
                    <option value="">{t('shop.selectCategory')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {translateCatalogLabel(category.name)}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{translateText(errors.category)}</p>}
                  {categoriesError && <p className="text-xs text-red-500 mt-1">{categoriesError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.itemPrice')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(event) => handleInputChange('price', event.target.value)}
                      className={`min-w-0 flex-1 px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                        errors.price ? 'border-red-500' : 'border-(--color-border)'
                      }`}
                      placeholder="0.00"
                    />
                    <select className="w-28 px-3 border border-(--color-border) rounded-lg bg-white text-sm text-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)" aria-label="Devise">
                      <option>{runtimeConfig.currency}</option>
                    </select>
                  </div>
                  <p className="mt-1 text-[11px] text-(--color-text-tertiary)">Devise sélectionnée : {runtimeConfig.currency}</p>
                  {errors.price && <p className="text-xs text-red-500 mt-1">{translateText(errors.price)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.itemQuantity')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(event) => handleInputChange('quantity', event.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.quantity ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                    placeholder="0"
                  />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{translateText(errors.quantity)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.ageRange')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.ageRange}
                    onChange={(event) => handleInputChange('ageRange', event.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.ageRange ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                  >
                    <option value="">{t('shop.selectAgeRange')}</option>
                    {PRODUCT_AGE_RANGES.map((ageRange) => (
                      <option key={ageRange} value={ageRange}>
                        {translateCatalogLabel(ageRange)}
                      </option>
                    ))}
                  </select>
                  {errors.ageRange && <p className="text-xs text-red-500 mt-1">{translateText(errors.ageRange)}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    {t('shop.genderCategory')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(event) => handleInputChange('gender', event.target.value)}
                    disabled={!formData.ageRange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.gender ? 'border-red-500' : 'border-(--color-border)'
                    } ${!formData.ageRange ? 'opacity-50 cursor-not-allowed bg-(--color-secondary)' : ''}`}
                  >
                    <option value="">{t('shop.selectGender')}</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>
                        {translateCatalogLabel(gender)}
                      </option>
                    ))}
                  </select>
                  {!formData.ageRange && (
                    <p className="text-xs text-(--color-text-secondary) mt-1">
                      {t('shop.selectAgeFirst')}
                    </p>
                  )}
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{translateText(errors.gender)}</p>}
                </div>
              </div>

              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-(--color-border)">
                <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-4">
                  {t('shop.productImages')}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <p className="text-sm text-(--color-text-secondary)">
                    {t('shop.importImages')}
                  </p>
                  <button
                    type="button"
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    className="btn-primary flex items-center justify-center gap-2 sm:flex-none"
                    disabled={isSubmitting}
                  >
                    + {t('shop.addImage')}
                  </button>
                </div>

                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                />
              </div>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary flex-1"
                  disabled={isSubmitting}
                >
                  {t('shop.reset')}
                </button>
                <button
                  type="button"
                  onClick={handleAddAnother}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('shop.saving') : t('shop.addAnother')}
                  <ArrowRight size={18} />
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 shop-product-preview">
            <Card>
              <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-4">
                {t('shop.previewMain')}
              </h3>
              <div className="aspect-square rounded-xl bg-(--color-secondary) flex items-center justify-center overflow-hidden">
                {mainPreviewUrl ? (
                  <img
                    src={mainPreviewUrl}
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

              <button
                type="button"
                onClick={handlePublish}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('shop.publishing') : t('shop.publish')}
                <ArrowRight size={18} />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
