import { useEffect, useRef, useState } from 'react';
import { shopService, type ShopCategory } from '@/services/shop';
import { useLanguage } from '@/core/i18n';
import type { ProductFormValues } from '../types';
import { createEmptyProductForm, toCreateProductInput, validateProductForm, type ProductFormErrors, type ProductTextField } from '../utils/productForm';

export function useProductForm() {
  const { t } = useLanguage();
  const [values, setValues] = useState(createEmptyProductForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlight = useRef(false);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    shopService.getCategories().then((data) => {
      if (!cancelled) setCategories(data);
    }).catch((error: unknown) => {
      if (!cancelled) setCategoriesError(error instanceof Error ? error.message : t('shop.saveError'));
    });
    return () => { cancelled = true; };
  }, [t]);

  const change = (field: ProductTextField, value: string) => {
    if (inFlight.current) return;
    setValues((previous) => ({ ...previous, [field]: value, ...(field === 'ageRange' ? { gender: '' } : {}) }));
    setErrors((previous) => ({ ...previous, [field]: undefined, ...(field === 'ageRange' ? { gender: undefined } : {}) }));
    setSubmitSuccess(null);
  };

  const changeImages = (images: ProductFormValues['images']) => {
    if (inFlight.current) return;
    setValues((previous) => ({ ...previous, images }));
    setSubmitSuccess(null);
  };

  const reset = () => {
    if (inFlight.current) return;
    setValues(createEmptyProductForm());
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const submit = async (action: 'save' | 'publish') => {
    if (inFlight.current) return;
    const validation = validateProductForm(values);
    setErrors(validation);
    setSubmitSuccess(null);
    setSubmitError(null);
    if (Object.keys(validation).length > 0) return;

    inFlight.current = true;
    setIsSubmitting(true);
    try {
      await shopService.createProduct(toCreateProductInput(values));
      setValues(createEmptyProductForm());
      setErrors({});
      setSubmitSuccess(t(action === 'publish' ? 'shop.published' : 'shop.saved'));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('shop.saveError'));
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return { values, errors, categories, categoriesError, submitError, submitSuccess, isSubmitting, change, changeImages, reset, submit };
}
