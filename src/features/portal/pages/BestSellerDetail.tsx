import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { defaultBestSeller, getBestSellerBySlug } from '../data/bestSellers';
import { useLanguage } from '@/core/i18n';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import Seo from '@/components/seo/Seo';
import { runtimeConfig } from '@/config/runtime';

function parsePrice(value: string) {
  const parsed = Number(value.replace(/[^0-9,.-]/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function BestSellerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
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
      currency: runtimeConfig.currency,
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
  const selectedImage = product.colors.find((color) => color.hex === selectedColor)?.image ?? product.src;
  const favoriteId = `best-seller:${product.id}`;
  const liked = isFavorite(favoriteId);
  const addBestSellerToCart = () => {
    addItem({
      id: `best-seller:${product.id}:${selectedColor}:${selectedSize}`,
      productId: product.id,
      name: t(product.titleKey),
      price: price ?? 0,
      image: selectedImage,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    }, quantity);
    setIsAdded(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Seo
        title={`${t(product.titleKey)} | KUKUZA`}
        description={t(product.descriptionKey)}
        path={`/best-sellers/${product.slug}`}
        image={product.src}
        type="product"
        product={{
          name: t(product.titleKey),
          description: t(product.descriptionKey),
          image: product.src,
          price: price ?? undefined,
          boutiqueName: 'KUKUZA',
        }}
      />
      <Header />
      <main className="px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[960px]">
          <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t('product.back')}
          </button>

          <section className="grid overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:min-h-[670px] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="relative min-h-[380px] bg-slate-100 sm:min-h-[520px] lg:min-h-[670px]">
              <img
                src={selectedImage}
                alt={product.alt}
                width="900"
                height="1100"
                className="h-full min-h-[380px] w-full object-cover sm:min-h-[520px] lg:min-h-[670px]"
                onError={(event) => {
                  event.currentTarget.src = '/assets/logo.png';
                }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-teal-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                {t(product.categoryKey)}
              </span>
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t('sections.kukuzaSelection')}</p>
                  <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-[2.25rem]">{t(product.titleKey)}</h1>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">KUKUZA</p>
                </div>
                <button
                  type="button"
                  className={`shrink-0 rounded-full border p-2.5 transition ${liked ? 'border-red-500 bg-red-50 text-red-500' : 'border-slate-200 text-slate-500 hover:border-teal-700 hover:text-teal-700'}`}
                  aria-label={liked ? t('favorites.remove') : t('catalog.addToFavorites')}
                  aria-pressed={liked}
                  onClick={() => toggleFavorite({
                    id: favoriteId, name: t(product.titleKey), price: price ?? 0,
                    image: selectedImage, href: `/best-sellers/${product.slug}`,
                  })}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <p className="text-2xl font-bold text-teal-700">
                  {price === null ? product.price : priceFormatter.format(price)}
                </p>
                {showOldPrice && (
                  <p className="text-sm font-semibold text-slate-400 line-through">
                    {priceFormatter.format(oldPrice)}
                  </p>
                )}
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">{t(product.descriptionKey)}</p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.details')}</h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm">
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

              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.availableSizes')}</h2>
                  <span className="text-xs text-slate-500">{selectedSize}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`min-w-11 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${selectedSize === size ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-700 hover:text-teal-700'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-full border border-slate-200 px-4 py-1.5">
                <span className="text-sm font-semibold text-slate-600">{t('product.quantity')}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label={t('product.decreaseQuantity')}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label={t('product.increaseQuantity')}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
                  onClick={addBestSellerToCart}
                >
                  {isAdded ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
                  {isAdded ? t('product.addedToCart') : t('product.addToCart')}
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-full border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
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
