import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { defaultBestSeller, getBestSellerBySlug } from '../data/bestSellers';
import { useLanguage } from '@/core/i18n';

function parsePrice(value: string) {
  const parsed = Number(value.replace(/[^0-9,.-]/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function BestSellerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const product = slug ? getBestSellerBySlug(slug) : defaultBestSeller;
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.hex ?? '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedColor(product?.colors[0]?.hex ?? '');
    setSelectedSize(product?.sizes[0] ?? '');
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }),
    [language],
  );

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const price = parsePrice(product.price);
  const oldPrice = parsePrice(product.oldPrice);
  const showOldPrice = price !== null && oldPrice !== null && oldPrice > price;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Header />
      <main className="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            className="mb-6 inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t('product.back')}
          </button>

          <section className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="relative min-h-[420px] bg-slate-100 sm:min-h-[620px]">
              <img
                src={product.src}
                alt={product.alt}
                width="900"
                height="1100"
                className="h-full min-h-[420px] w-full object-cover sm:min-h-[620px]"
                onError={(event) => {
                  event.currentTarget.src = '/assets/logo.png';
                }}
              />
              <span className="absolute left-5 top-5 rounded-full bg-teal-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                {t(product.categoryKey)}
              </span>
            </div>

            <div className="flex flex-col p-6 sm:p-10 lg:p-12">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t('sections.kukuzaSelection')}</p>
                  <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{t(product.titleKey)}</h1>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">KUKUZA</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-slate-200 p-3 text-slate-500 transition hover:border-teal-700 hover:text-teal-700"
                  aria-label={t('navigation.favorites')}
                >
                  <Heart size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-baseline gap-3">
                <p className="text-3xl font-bold text-teal-700">
                  {price === null ? product.price : priceFormatter.format(price)}
                </p>
                {showOldPrice && (
                  <p className="text-base font-semibold text-slate-400 line-through">
                    {priceFormatter.format(oldPrice)}
                  </p>
                )}
              </div>

              <p className="mt-6 text-base leading-7 text-slate-600">{t(product.descriptionKey)}</p>

              <div className="mt-8 border-t border-slate-200 pt-7">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.details')}</h2>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                  <div>
                    <dt className="text-slate-500">{t('product.category')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{t(product.categoryKey)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('product.shipping')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{t(product.shippingKey)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-slate-500">{t('product.availableColors')}</dt>
                    <dd className="mt-3 flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          className={`h-9 w-9 rounded-full border-2 transition ${selectedColor === color.hex ? 'border-teal-700 p-0.5' : 'border-transparent'}`}
                          aria-label={color.name}
                          aria-pressed={selectedColor === color.hex}
                          onClick={() => setSelectedColor(color.hex)}
                        >
                          <span className="block h-full w-full rounded-full" style={{ backgroundColor: color.hex }} />
                        </button>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.availableSizes')}</h2>
                  <span className="text-xs text-slate-500">{selectedSize}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`min-w-12 rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedSize === size ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-700 hover:text-teal-700'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between rounded-full border border-slate-200 px-4 py-2">
                <span className="text-sm font-semibold text-slate-600">{t('product.quantity')}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label={t('product.decreaseQuantity')}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label={t('product.increaseQuantity')}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                  onClick={() => setIsAdded(true)}
                >
                  {isAdded ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
                  {isAdded ? t('product.addedToCart') : t('product.addToCart')}
                </button>
                <button
                  type="button"
                  className="min-h-12 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
                  onClick={() => navigate('/')}
                >
                  {t('product.back')}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
