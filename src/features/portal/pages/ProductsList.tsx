import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { usePaginatedProducts } from '../hooks/usePaginatedProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import { formatFilterLabel, getNavTitle, normalizeText } from '../data/catalog';
import type { PortalProduct } from '../data/catalog';
import Seo from '@/components/seo/Seo';
import ProductGridSkeleton from '../components/catalog/ProductGridSkeleton';
import ProductResultCard from '../components/catalog/ProductResultCard';
import ProductSearch from '../components/catalog/ProductSearch';

export default function ProductsList() {
  const { t, translateCatalogLabel } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q')?.trim() ?? '';
  const gender = searchParams.get('gender')?.trim() ?? '';
  const nav = searchParams.get('nav');
  const filter = searchParams.get('filter');
  const { items: products, loading, error, loadMore, retry, hasMore, total } = usePaginatedProducts(1, 12, {
    search,
    gender,
    nav,
    filter,
  });
  const [sectionRef, isVisible] = useScrollAnimation();
  const hasActiveFilters = Boolean(search || gender || nav || filter);
  const heading = useMemo(() => {
    if (search) return t('catalog.searchResults', { value: search });
    if (gender) {
      const genderLabels: Record<string, string> = {
        femme: t('catalog.women'),
        women: t('catalog.women'),
        homme: t('catalog.men'),
        men: t('catalog.men'),
        enfant: t('catalog.children'),
        children: t('catalog.children'),
      };
      return genderLabels[normalizeText(gender)] ?? gender;
    }
    if (filter) return translateCatalogLabel(formatFilterLabel(filter));
    if (nav) return translateCatalogLabel(getNavTitle(nav));
    return t('catalog.allProducts');
  }, [filter, gender, nav, search, t, translateCatalogLabel]);

  const clearFilters = () => setSearchParams({});
  const submitSearch = (query: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (query) nextParams.set('q', query);
    else nextParams.delete('q');
    setSearchParams(nextParams);
  };
  const openProduct = (product: PortalProduct) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-portal-bg">
      <Seo
        title={`${heading} | KUKUZA`}
        description={search
          ? `Découvrez les produits KUKUZA correspondant à « ${search} ».`
          : 'Parcourez le catalogue KUKUZA : mode, accessoires, décoration et produits de créateurs africains.'}
        path="/products"
        noIndex={Boolean(search || gender || nav || filter)}
      />
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

                <ProductSearch search={search} products={products} onSearch={submitSearch} />

                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                    {search && (
                      <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                        {t('catalog.searchChip')} : {search}
                      </span>
                    )}
                    {gender && (
                      <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-700/10">
                        {t('catalog.gender')} : {heading}
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

            {loading && products.length === 0 && <ProductGridSkeleton />}

            {!loading && error && (
              <div role="alert" className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <h2 className="text-lg font-semibold text-red-900">{t('catalog.unavailable')}</h2>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button type="button" onClick={retry} className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                  {t('catalog.retry')}
                </button>
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

            {products.length > 0 && (
              <>
                <div aria-busy={loading} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, index) => (
                    <div key={product.id} className={isVisible ? 'scale-in' : ''} style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductResultCard product={product} onOpen={openProduct} />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  {hasMore ? (
                    <button
                      type="button"
                      className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
                      onClick={loadMore}
                      disabled={loading || Boolean(error)}
                    >
                      {loading ? t('catalog.loading') : t('catalog.loadMore')}
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
