import { ArrowRight } from 'lucide-react';
import DashboardLayout from '@/layouts/shop/DashboardLayout';
import { useLanguage } from '@/core/i18n';
import Card from '../components/common/Card';
import ImageUpload from '../components/common/ImageUpload';
import ProductFields from '../components/products/ProductFields';
import ProductPreview from '../components/products/ProductPreview';
import { useProductForm } from '../hooks/useProductForm';

export default function AddProductPage() {
  const { t } = useLanguage();
  const form = useProductForm();
  return (
    <DashboardLayout activePath="/shop/produits/ajouter">
      <div className="shop-dashboard shop-add-product mx-auto max-w-7xl px-0">
        <h1 className="mb-6 text-xl font-bold text-(--color-text-primary) md:mb-8 md:text-2xl">
          {t('shop.addProductsTitle')}
        </h1>
        {form.submitError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{form.submitError}</div>}
        {form.submitSuccess && <div role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{form.submitSuccess}</div>}
        <form onSubmit={(event) => { event.preventDefault(); void form.submit('publish'); }} noValidate>
          <fieldset disabled={form.isSubmitting} aria-busy={form.isSubmitting} className="grid min-w-0 grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
            <legend className="sr-only">{t('shop.addProductsTitle')}</legend>
            <div className="lg:col-span-2">
              <Card>
                <ProductFields values={form.values} errors={form.errors} categories={form.categories} categoriesError={form.categoriesError} onChange={form.change} />
                <div className="mt-6 border-t border-(--color-border) pt-6 md:mt-8 md:pt-8">
                  <h3 className="mb-4 text-base font-semibold text-(--color-text-primary) md:text-lg">{t('shop.productImages')}</h3>
                  <p className="mb-4 text-sm text-(--color-text-secondary)">{t('shop.importImages')}</p>
                  <ImageUpload images={form.values.images} onImagesChange={form.changeImages} />
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
                  <button type="button" onClick={form.reset} className="btn-secondary flex-1">{t('shop.reset')}</button>
                  <button type="button" onClick={() => void form.submit('save')} className="btn-primary flex flex-1 items-center justify-center gap-2">
                    {form.isSubmitting ? t('shop.saving') : t('shop.addAnother')}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </Card>
            </div>
            <div className="shop-product-preview lg:col-span-1">
              <Card>
                <ProductPreview image={form.values.images[0]} />
                <button type="submit" className="btn-primary mt-6 flex w-full items-center justify-center gap-2">
                  {form.isSubmitting ? t('shop.publishing') : t('shop.publish')}
                  <ArrowRight size={18} />
                </button>
              </Card>
            </div>
          </fieldset>
        </form>
      </div>
    </DashboardLayout>
  );
}
