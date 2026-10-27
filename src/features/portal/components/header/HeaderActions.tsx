import { Search, User, Heart, ShoppingBag, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, type Language } from '@/core/i18n';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';

const LANGUAGE_OPTIONS: Array<{ code: Language; nativeLabel: string }> = [
  { code: 'fr', nativeLabel: 'FR' },
  { code: 'en', nativeLabel: 'EN' },
];

interface HeaderActionsProps {
  isSolidHeader: boolean;
  isSearchOpen: boolean;
  isLanguageOpen: boolean;
  onToggleSearch: () => void;
  onToggleLanguage: () => void;
  onClose: () => void;
}

export default function HeaderActions({
  isSolidHeader, isSearchOpen, isLanguageOpen, onToggleSearch, onToggleLanguage, onClose,
}: HeaderActionsProps) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { totalQuantity } = useCart();
  const { items: favoriteItems } = useFavorites();
  const actionBtn = 'inline-flex items-center justify-center rounded-full p-2 transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-primary/40';

  return (
    <div className="flex items-center gap-2.5">
      <button
        className={`${actionBtn} ${isSolidHeader ? 'text-slate-900' : 'text-white'} ${
          isSearchOpen ? 'bg-white/12 ring-2 ring-white/20 md:bg-slate-900/5 md:ring-slate-900/10' : ''
        }`}
        aria-label={t('navigation.search')}
        aria-expanded={isSearchOpen}
        aria-controls="portal-search-panel"
        onClick={onToggleSearch}
      >
        <Search size={20} />
      </button>
      <button
        className={`${actionBtn} ${isSolidHeader ? 'text-slate-900' : 'text-white'}`}
        aria-label={t('navigation.account')}
        onClick={() => navigate('/auth/login')}
      >
        <User size={20} />
      </button>
      <button
        className={`${actionBtn} relative ${isSolidHeader ? 'text-slate-900' : 'text-white'}`}
        aria-label={`${t('navigation.favorites')}${favoriteItems.length > 0 ? ` (${favoriteItems.length})` : ''}`}
        onClick={() => navigate('/favorites')}
      >
        <Heart size={20} />
        {favoriteItems.length > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
            {favoriteItems.length > 99 ? '99+' : favoriteItems.length}
          </span>
        )}
      </button>
      <button
        className={`${actionBtn} relative ${isSolidHeader ? 'text-slate-900' : 'text-white'}`}
        aria-label={`${t('navigation.cart')}${totalQuantity > 0 ? ` (${totalQuantity})` : ''}`}
        onClick={() => navigate('/cart')}
      >
        <ShoppingBag size={20} />
        {totalQuantity > 0 && (
          <span
            className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white"
            aria-live="polite"
          >
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </span>
        )}
      </button>
      <div className="relative">
        <button
          type="button"
          className={`${actionBtn} ${isSolidHeader ? 'text-slate-900' : 'text-white'} ${isLanguageOpen ? 'bg-white/15 ring-2 ring-white/20 md:bg-slate-900/5 md:ring-slate-900/10' : ''}`}
          aria-label={`${t('language.choose')} (${language.toUpperCase()})`}
          aria-haspopup="listbox"
          aria-expanded={isLanguageOpen}
          onClick={onToggleLanguage}
        >
          <Globe size={20} aria-hidden="true" />
          <span className="sr-only">{language === 'fr' ? t('language.french') : t('language.english')}</span>
        </button>

        {isLanguageOpen && (
          <div
            role="listbox"
            aria-label={t('language.choose')}
            onKeyDown={(event) => {
              if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
              const current = options.indexOf(document.activeElement as HTMLButtonElement);
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
                : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
              options[next]?.focus();
            }}
            className="absolute right-0 top-full z-[70] mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-2xl"
          >
            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {t('language.label')}
            </p>
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={language === option.code}
                autoFocus={language === option.code}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  language === option.code
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700'
                }`}
                onClick={() => { setLanguage(option.code); onClose(); }}
              >
                <span>{option.code === 'fr' ? t('language.french') : t('language.english')}</span>
                <span className="text-[10px] font-bold tracking-wider text-slate-400">{option.nativeLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
