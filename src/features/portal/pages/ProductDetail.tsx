import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Heart, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { useLanguage } from '@/core/i18n';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import {
  formatFilterLabel,
  getPortalProductById,
  mergeMarketplaceProducts,
  normalizeProduct,
  type PortalProduct,
} from '../data/catalog';
import Seo from '@/components/seo/Seo';

type ProductRouteState = {
  product?: PortalProduct;
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, translateCatalogLabel } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const routeState = (location.state as ProductRouteState | null) ?? null;
  const stateProduct = routeState?.product && String(routeState.product.id) === productId
    ? routeState.product
    : undefined;
  const localProduct = getPortalProductById(productId);
  const [remoteProduct, setRemoteProduct] = useState<PortalProduct | undefined>();
  const [isResolving, setIsResolving] = useState(!stateProduct && !localProduct);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (stateProduct || localProduct || !productId) {
      setRemoteProduct(undefined);
      setIsResolving(false);
      return undefined;
    }

    setIsResolving(true);
    getProducts(1, 1000)
      .then((response) => {
        if (cancelled) return;
        const products = mergeMarketplaceProducts(response?.items?.map((item) => normalizeProduct(item)) ?? []);
        setRemoteProduct(products.find((item) => String(item.id) === productId));
      })
      .finally(() => {
        if (!cancelled) setIsResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [localProduct, productId, stateProduct]);

  const product = stateProduct ?? localProduct ?? remoteProduct;
  const currencyFormatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    setSelectedSize(product?.sizes[0] ?? '');
    setIsAdded(false);
  }, [product?.id]);

  if (isResolving) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-16 text-sm text-slate-600" aria-live="polite">
          {t('catalog.loading')}
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pb-16 pt-28">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">{t('product.notFound')}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{t('product.notFoundHint')}</p>
            <button
              type="button"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              onClick={() => navigate('/products')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {t('product.backToProducts')}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = translateCatalogLabel(formatFilterLabel(product.category));
  const subcategory = translateCatalogLabel(formatFilterLabel(product.subcategory));
  const creator = product.boutique_name || product.brand || product.creator_name;
  const favoriteId = `product:${product.id}`;
  const liked = isFavorite(favoriteId);
  const addProductToCart = () => {
    addItem({
      id: `product:${product.id}:${selectedSize || 'default'}`,
      name: product.name,
      price: product.price,
      image: product.image_url,
      size: selectedSize || undefined,
    });
    setIsAdded(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Seo
        title={`${product.name} | KUKUZA`}
        description={product.description || `Découvrez ${product.name} sur KUKUZA.`}
        path={`/products/${product.id}`}
        image={product.image_url}
        type="product"
        product={{
          name: product.name,
          description: product.description,
          image: product.image_url,
          price: product.price,
          boutiqueName: product.boutique_name || product.brand || product.creator_name,
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

          <div className="grid overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:min-h-[670px] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="relative min-h-[380px] bg-slate-100 sm:min-h-[520px] lg:min-h-[670px]">
              <img
                src={product.image_url}
                alt={product.name}
                width="900"
                height="1100"
                className="h-full min-h-[380px] w-full object-cover sm:min-h-[520px] lg:min-h-[670px]"
                onError={(event) => {
                  event.currentTarget.src = '/assets/logo.png';
                }}
              />
              {product.isPromoted && (
                <span className="absolute left-4 top-4 rounded-full bg-teal-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                  {t('catalog.selection')}
                </span>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{category}</p>
                  <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-[2.25rem]">{product.name}</h1>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{creator}</p>
                </div>
                <button
                  type="button"
                  className={`shrink-0 rounded-full border p-2.5 transition ${liked ? 'border-red-500 bg-red-50 text-red-500' : 'border-slate-200 text-slate-500 hover:border-teal-700 hover:text-teal-700'}`}
                  aria-label={liked ? t('favorites.remove') : t('catalog.addToFavorites')}
                  aria-pressed={liked}
                  onClick={() => toggleFavorite({
                    id: favoriteId, name: product.name, price: product.price,
                    image: product.image_url, href: `/products/${product.id}`,
                  })}
                >
                  <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </div>

              <p className="mt-6 text-2xl font-bold text-teal-700">{currencyFormatter.format(product.price)}</p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.details')}</h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-xs sm:text-sm">
                  <div>
                    <dt className="text-slate-500">{t('product.creator')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{product.boutique_name || product.creator_name || creator}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('product.category')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{category}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('product.subcategory')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{subcategory}</dd>
                  </div>
                  {product.material && (
                    <div>
                      <dt className="text-slate-500">{t('product.material')}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{translateCatalogLabel(formatFilterLabel(product.material))}</dd>
                    </div>
                  )}
                  {product.style && (
                    <div>
                      <dt className="text-slate-500">{t('product.style')}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{translateCatalogLabel(formatFilterLabel(product.style))}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-slate-500">{t('product.collections')}</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {product.collections.length > 0
                        ? product.collections.map((collection) => translateCatalogLabel(formatFilterLabel(collection))).join(', ')
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('product.availableSizes')}</h2>
                    <span className="text-xs text-slate-500">{t('product.selectSize')}</span>
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
              )}

              {(product.tags.length > 0 || product.collections.length > 0) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {[...product.tags, ...product.collections].filter((value, index, values) => values.indexOf(value) === index).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                      {translateCatalogLabel(formatFilterLabel(tag))}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
                  onClick={addProductToCart}
                >
                  {isAdded ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
                  {isAdded ? t('product.addedToCart') : t('sections.shopNow')}
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-full border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
                  onClick={() => navigate('/products')}
                >
                  {t('product.backToProducts')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
