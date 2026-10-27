import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/core/i18n';

interface HeaderSearchProps {
  query: string;
  onSearch: (query: string) => void;
  onClose: () => void;
}

export default function HeaderSearch({ query, onSearch, onClose }: HeaderSearchProps) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(query);

  return (
    <div id="portal-search-panel" className="absolute inset-x-0 top-full border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-5 lg:px-7">
        <form
          role="search"
          className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center"
          onSubmit={(event) => { event.preventDefault(); onSearch(draft); }}
        >
          <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Search size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              autoFocus
              aria-label={t('catalog.searchLabel')}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            {t('search.submit')}
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900">
            {t('navigation.close')}
          </button>
        </form>
        {query && (
          <div className="mx-auto mt-3 flex max-w-5xl items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span>{t('search.active')}: {query}</span>
            <button type="button" className="font-semibold text-slate-900" onClick={() => onSearch('')}>
              {t('search.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
