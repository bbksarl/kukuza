import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/core/i18n';
import { formatFilterLabel, type PortalProduct } from '../../data/catalog';
import { getProductSuggestions } from '../../utils/productSuggestions';

interface ProductSearchProps {
  search: string;
  products: readonly PortalProduct[];
  onSearch: (query: string) => void;
}

export default function ProductSearch({ search, products, onSearch }: ProductSearchProps) {
  const { t, translateCatalogLabel } = useLanguage();
  const inputId = useId();
  const listId = `${inputId}-suggestions`;
  const [query, setQuery] = useState(search);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useMemo(() => getProductSuggestions(products, query), [products, query]);
  const activeSuggestion = Math.min(activeIndex, Math.max(0, suggestions.length - 1));

  useEffect(() => {
    setQuery(search);
    setIsSuggestionsOpen(false);
    setActiveIndex(0);
  }, [search]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    setQuery(trimmed);
    setIsSuggestionsOpen(false);
    onSearch(trimmed);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      setIsSuggestionsOpen(false);
      return;
    }
    if (!isSuggestionsOpen || suggestions.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((activeSuggestion + direction + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && suggestions[activeSuggestion]) {
      event.preventDefault();
      submit(suggestions[activeSuggestion].name);
    }
  };

  return (
    <form className="flex w-full max-w-xl flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); submit(query); }} role="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsSuggestionsOpen(false);
      }}>
      <label className="sr-only" htmlFor={inputId}>{t('catalog.searchLabel')}</label>
      <div className="relative flex-1">
        <div className="flex min-h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 transition focus-within:border-teal-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-700/10">
          <Search size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setIsSuggestionsOpen(true);
            }}
            onFocus={() => setIsSuggestionsOpen(Boolean(query.trim()))}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('search.placeholder')}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isSuggestionsOpen && suggestions.length > 0}
            aria-controls={isSuggestionsOpen && suggestions.length > 0 ? listId : undefined}
            aria-activedescendant={isSuggestionsOpen && suggestions[activeSuggestion] ? `${listId}-${activeSuggestion}` : undefined}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {isSuggestionsOpen && suggestions.length > 0 && (
          <div
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {t('catalog.suggestions')}
            </p>
            {suggestions.map((product, index) => (
              <button
                key={product.id}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={index === activeSuggestion}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${index === activeSuggestion ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => submit(product.name)}
              >
                <img
                  src={product.image_url}
                  alt=""
                  className="h-10 w-10 rounded-lg bg-slate-100 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{product.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {product.boutique_name || product.brand || product.creator_name}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-teal-700">
                  {translateCatalogLabel(formatFilterLabel(product.category))}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="min-h-12 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        {t('search.submit')}
      </button>
    </form>
  );
}
