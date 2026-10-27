import { useId } from 'react';
import { useLanguage } from '@/core/i18n';
import { runtimeConfig } from '@/config/runtime';
import type { ShopCategory } from '@/services/shop';
import type { ProductFormValues } from '../../types';
import { getGenderOptions, PRODUCT_AGE_RANGES, type ProductFormErrors, type ProductTextField } from '../../utils/productForm';

interface ProductFieldsProps {
  values: ProductFormValues;
  errors: ProductFormErrors;
  categories: ShopCategory[];
  categoriesError: string | null;
  onChange: (field: ProductTextField, value: string) => void;
}

export default function ProductFields({ values, errors, categories, categoriesError, onChange }: ProductFieldsProps) {
  const { t, translateCatalogLabel, translateText } = useLanguage();
  const formId = useId();
  const genderOptions = getGenderOptions(values.ageRange);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      <div>
        <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.itemName')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id={`${formId}-name`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
            errors.name ? 'border-red-500' : 'border-(--color-border)'
          }`}
          placeholder={t('shop.itemNamePlaceholder')}
        />
        {errors.name && <p id={`${formId}-name-error`} className="text-xs text-red-500 mt-1">{translateText(errors.name)}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-category`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.itemCategory')} <span className="text-red-500">*</span>
        </label>
        <select
          id={`${formId}-category`}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? `${formId}-category-error` : undefined}
          value={values.category}
          onChange={(event) => onChange('category', event.target.value)}
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
        {errors.category && <p id={`${formId}-category-error`} className="text-xs text-red-500 mt-1">{translateText(errors.category)}</p>}
        {categoriesError && <p className="text-xs text-red-500 mt-1">{categoriesError}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-price`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.itemPrice')} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            id={`${formId}-price`}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? `${formId}-price-error` : undefined}
            value={values.price}
            onChange={(event) => onChange('price', event.target.value)}
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
        {errors.price && <p id={`${formId}-price-error`} className="text-xs text-red-500 mt-1">{translateText(errors.price)}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-quantity`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.itemQuantity')} <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id={`${formId}-quantity`}
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? `${formId}-quantity-error` : undefined}
          value={values.quantity}
          onChange={(event) => onChange('quantity', event.target.value)}
          className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
            errors.quantity ? 'border-red-500' : 'border-(--color-border)'
          }`}
          placeholder="0"
        />
        {errors.quantity && <p id={`${formId}-quantity-error`} className="text-xs text-red-500 mt-1">{translateText(errors.quantity)}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-ageRange`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.ageRange')} <span className="text-red-500">*</span>
        </label>
        <select
          id={`${formId}-ageRange`}
          aria-invalid={Boolean(errors.ageRange)}
          aria-describedby={errors.ageRange ? `${formId}-ageRange-error` : undefined}
          value={values.ageRange}
          onChange={(event) => onChange('ageRange', event.target.value)}
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
        {errors.ageRange && <p id={`${formId}-ageRange-error`} className="text-xs text-red-500 mt-1">{translateText(errors.ageRange)}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-gender`} className="block text-sm font-medium text-(--color-text-primary) mb-2">
          {t('shop.genderCategory')} <span className="text-red-500">*</span>
        </label>
        <select
          id={`${formId}-gender`}
          aria-invalid={Boolean(errors.gender)}
          aria-describedby={errors.gender ? `${formId}-gender-error` : undefined}
          value={values.gender}
          onChange={(event) => onChange('gender', event.target.value)}
          disabled={!values.ageRange}
          className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
            errors.gender ? 'border-red-500' : 'border-(--color-border)'
          } ${!values.ageRange ? 'opacity-50 cursor-not-allowed bg-(--color-secondary)' : ''}`}
        >
          <option value="">{t('shop.selectGender')}</option>
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>
              {translateCatalogLabel(gender)}
            </option>
          ))}
        </select>
        {!values.ageRange && (
          <p className="text-xs text-(--color-text-secondary) mt-1">
            {t('shop.selectAgeFirst')}
          </p>
        )}
        {errors.gender && <p id={`${formId}-gender-error`} className="text-xs text-red-500 mt-1">{translateText(errors.gender)}</p>}
      </div>
    </div>
  );
}
