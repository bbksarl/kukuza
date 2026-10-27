import { useLanguage } from '@/core/i18n';
import { runtimeConfig } from '@/config/runtime';
import { formatFilterLabel, type PortalProduct } from '../../data/catalog';

export default function ProductResultCard({ product, onOpen }: { product: PortalProduct; onOpen: (product: PortalProduct) => void }) {
  const { t, language, translateCatalogLabel } = useLanguage();
  const creator = product.boutique_name || product.brand || product.creator_name || 'Boutique';
  const currencyFormatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: runtimeConfig.currency,
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
              if (!event.currentTarget.src.endsWith('/assets/logo.png')) {
                event.currentTarget.src = '/assets/logo.png';
              }
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

