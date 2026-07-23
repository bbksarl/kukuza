import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { usePaginatedProducts } from '../hooks/usePaginatedProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import { formatFilterLabel, getNavTitle } from '../data/catalog';
import type { PortalProduct } from '../data/catalog';

function ProductGridSkeleton() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={t('catalog.loading')}>
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="aspect-[4/5] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductResultCard({ product, onOpen }: { product: PortalProduct; onOpen: (product: PortalProduct) => void }) {
  const { t, language, translateCatalogLabel } = useLanguage();
  const creator = product.brand || product.creator_name || 'Boutique';
  const currencyFormatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        onClick={() => onOpen(product)}
        aria-label={`${t('catalog.viewProduct')} ${product.name}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width="480"
            height="600"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = '/assets/logo.png';
            }}
          />
          {product.isPromoted && (
            <span className="absolute left-3 top-3 rounded-full bg-teal-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {t('catalog.selection')}
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow backdrop-blur-sm">
            {currencyFormatter.format(product.price)}
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent px-4 pb-4 pt-12 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition duration-300 group-hover:opacity-100">
            {t('catalog.viewProduct')}
          </span>
        </div>

        <div className="space-y-2 p-4">
          <h3 className="truncate text-base font-bold text-slate-900">{product.name}</h3>
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500">{creator}</p>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-lg font-bold text-teal-700">{currencyFormatter.format(product.price)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {translateCatalogLabel(formatFilterLabel(product.category))}
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

export default function ProductsList() {
  const { t, translateCatalogLabel } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q')?.trim() ?? '';
  const nav = searchParams.get('nav');
  const filter = searchParams.get('filter');
  const [query, setQuery] = useState(search);
  const { items: products, loading, error, loadMore, total } = usePaginatedProducts(1, 12, {
    search,
    nav,
    filter,
  });
  const [sectionRef, isVisible] = useScrollAnimation();
  const hasActiveFilters = Boolean(search || nav || filter);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  const heading = useMemo(() => {
    if (search) return t('catalog.searchResults', { value: search });
    if (filter) return translateCatalogLabel(formatFilterLabel(filter));
    if (nav) return translateCatalogLabel(getNavTitle(nav));
    return t('catalog.allProducts');
  }, [filter, nav, search, t, translateCatalogLabel]);

  const clearFilters = () => setSearchParams({});
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const trimmedQuery = query.trim();

    if (trimmedQuery) nextParams.set('q', trimmedQuery);
    else nextParams.delete('q');

    setSearchParams(nextParams);
  };
  const openProduct = (product: PortalProduct) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-portal-bg">
      <Header />
      <main className="min-h-[calc(100vh-52px)] bg-slate-50 pt-16">
        <section ref={sectionRef} className={`products-section px-4 py-8 sm:px-6 lg:px-8 lg:py-12 ${isVisible ? 'fade-in' : ''}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t('catalog.title')}</p>
                  <h1 className="text-2xl font-bold capitalize text-slate-900 sm:text-3xl">{heading}</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {total} {total > 1 ? t('catalog.productsFound') : t('catalog.productFound')}
                  </p>
                </div>

                <form className="flex w-full max-w-xl flex-col gap-2 sm:flex-row" onSubmit={submitSearch} role="search">
                  <label className="sr-only" htmlFor="products-search">{t('catalog.searchLabel')}</label>
                  <div className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 transition focus-within:border-teal-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-700/10">
                    <Search size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
                    <input
                      id="products-search"
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('search.placeholder')}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-12 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    {t('search.submit')}
                  </button>
                </form>

                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                    {search && (
                      <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                        {t('catalog.searchChip')} : {search}
                      </span>
                    )}
                    {nav && (
                      <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-700/10">
                        {t('catalog.ray')} : {translateCatalogLabel(getNavTitle(nav))}
                      </span>
                    )}
                    {filter && (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {t('catalog.filter')} : {translateCatalogLabel(formatFilterLabel(filter))}
                      </span>
                    )}
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                      onClick={clearFilters}
                    >
                      {t('navigation.reset')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loading && <ProductGridSkeleton />}

            {!loading && error && (
              <div role="alert" className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <h2 className="text-lg font-semibold text-red-900">{t('catalog.unavailable')}</h2>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl">⌕</div>
                <h2 className="mt-5 text-xl font-semibold text-slate-900">{t('catalog.noProducts')}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {t('catalog.noProductsHint')}
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  onClick={clearFilters}
                >
                  {t('catalog.showAll')}
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, index) => (
                    <div key={product.id} className={isVisible ? 'scale-in' : ''} style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductResultCard product={product} onOpen={openProduct} />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  {products.length < total ? (
                    <button
                      type="button"
                      className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
                      onClick={loadMore}
                    >
                      {t('catalog.loadMore')}
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500">{t('catalog.allDisplayed')}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
