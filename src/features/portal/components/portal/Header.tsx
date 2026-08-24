import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, User, Heart, ShoppingBag, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage, type Language } from '@/core/i18n';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import { formatFilterLabel, groupFilters, NAV_ITEMS, type DropdownType, type NavItem } from '../../data/catalog';

type FilterGroupEntry = [string, { label: string; category: string }[]];

const LANGUAGE_OPTIONS: Array<{ code: Language; nativeLabel: string }> = [
  { code: 'fr', nativeLabel: 'FR' },
  { code: 'en', nativeLabel: 'EN' },
];

function FilterGroups({
  dropdownType,
  selectedFilter,
  onSelect,
  translateCatalogLabel,
}: {
  dropdownType: DropdownType;
  selectedFilter: string | null;
  onSelect: (filterLabel: string) => void;
  translateCatalogLabel: (value: string | null | undefined) => string;
}) {
  const groups = groupFilters(dropdownType) as FilterGroupEntry[];

  return (
    <>
      {groups.map(([category, filters]) => (
        <div key={category} className="flex flex-col gap-2">
          <div className="border-b-2 border-teal-700 pb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-teal-700">
            {translateCatalogLabel(formatFilterLabel(category))}
          </div>
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.label;

            return (
              <button
                key={filter.label}
                className={`w-full rounded-lg px-3 py-2 text-left text-[11px] font-medium transition hover:translate-x-1 hover:bg-teal-50 hover:text-teal-700 ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow'
                    : 'bg-transparent text-slate-800'
                }`}
                onClick={() => onSelect(filter.label)}
              >
                {translateCatalogLabel(formatFilterLabel(filter.label))}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Header({ logoSrc = '/assets/logo.png', logoAlt = 'KUKUZA' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { language, setLanguage, t, translateCatalogLabel } = useLanguage();
  const { totalQuantity } = useCart();
  const { items: favoriteItems } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const selectedNav = searchParams.get('nav');
  const selectedFilter = searchParams.get('filter');

  useEffect(() => {
    const previousHeaderHeight = document.documentElement.style.getPropertyValue('--portal-header-height');
    document.documentElement.style.setProperty('--portal-header-height', '64px');
    document.documentElement.style.setProperty('scroll-padding-top', '64px');
    return () => {
      if (previousHeaderHeight) {
        document.documentElement.style.setProperty('--portal-header-height', previousHeaderHeight);
      }
    };
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setIsLanguageOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isLanguageOpen) return undefined;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLanguageOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isLanguageOpen]);

  const activeNavItem = useMemo(
    () => NAV_ITEMS.find((item) => item.navType === selectedNav || item.dropdownType === activeDropdown),
    [activeDropdown, selectedNav]
  );

  const navigateToProducts = (updater: (params: URLSearchParams) => void) => {
    const nextParams = new URLSearchParams(searchParams);
    updater(nextParams);
    navigate({
      pathname: '/products',
      search: nextParams.toString(),
    });
  };

  const handleFilterClick = (dropdownType: DropdownType, filterLabel: string) => {
    navigateToProducts((params) => {
      params.set('nav', dropdownType);
      params.set('filter', filterLabel);
    });
    setIsSearchOpen(false);
  };

  const clearFilter = () => {
    navigateToProducts((params) => {
      params.delete('nav');
      params.delete('filter');
    });
    setActiveDropdown(null);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToProducts((params) => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        params.set('q', trimmedQuery);
      } else {
        params.delete('q');
      }
    });
    setIsSearchOpen(false);
  };

  const handleNavClick = (item: NavItem) => {
    const dropdownType = item.dropdownType;
    if (item.hasDropdown && dropdownType) {
      setActiveDropdown((prev) => (prev === dropdownType ? null : dropdownType));
      setIsSearchOpen(false);
      return;
    }

    navigateToProducts((params) => {
      params.set('nav', item.navType);
      params.delete('filter');
    });
    setIsSearchOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
    setIsLanguageOpen(false);
  };

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsLanguageOpen(false);
  };

  const isItemActive = (item: NavItem) => {
    if (selectedNav) {
      return selectedNav === item.navType;
    }
    return location.pathname === '/' && location.hash === item.hash;
  };

  const isSolidHeader = isScrolled || location.pathname !== '/';
  const linkBase = 'flex items-center justify-between gap-1.5 font-semibold tracking-[0.4px] transition-colors duration-200 rounded-lg relative';
  const linkColor = isSolidHeader ? 'text-slate-900 hover:text-portal-primary' : 'text-white hover:text-portal-primary';
  const actionBtn = 'inline-flex items-center justify-center rounded-full p-2 transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-primary/40';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] overflow-visible transition-all duration-200 ${
        isSolidHeader
          ? 'bg-white backdrop-blur-md border-b border-slate-900/5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
        <button
          className={`flex items-center justify-center rounded-md p-2 transition duration-200 md:hidden ${
            isSolidHeader ? 'text-slate-900' : 'text-white'
          }`}
          onClick={toggleMenu}
          aria-label={t('navigation.menu')}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <button className="flex shrink-0 items-center" onClick={() => navigate('/')}>
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`h-8 w-auto transition ${isSolidHeader ? '' : 'invert brightness-0 contrast-200'}`}
          />
        </button>

        <nav
          className={`absolute left-0 top-16 flex w-full flex-col gap-1 bg-white/95 px-4 pb-5 pt-3 shadow-2xl transition-all duration-300 md:static md:w-auto md:flex-row md:items-center md:gap-2.5 md:bg-transparent md:p-0 md:shadow-none ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item);
            const hasSelectedFilter = selectedNav === item.navType && selectedFilter;

            return (
              <div key={item.hash} className="relative">
                <button
                  type="button"
                  className={`${linkBase} ${linkColor} px-2 py-1.5 text-[11px] md:text-[11px] ${isActive ? 'underline underline-offset-4' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-haspopup={item.hasDropdown ? 'true' : undefined}
                  aria-expanded={item.hasDropdown ? activeDropdown === item.dropdownType : undefined}
                  onClick={() => handleNavClick(item)}
                >
                  <span className="flex items-center gap-2">
                    {translateCatalogLabel(formatFilterLabel(item.title))}
                    {hasSelectedFilter && (
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow ${
                          isSolidHeader
                            ? 'bg-slate-900 text-white'
                            : 'bg-white/10 text-white md:bg-portal-primary/10 md:text-portal-primary'
                        }`}
                      >
                        {translateCatalogLabel(formatFilterLabel(selectedFilter))}
                      </span>
                    )}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={12}
                      className={`transition duration-200 ${
                        activeDropdown === item.dropdownType ? 'rotate-180' : ''
                      } ${isSolidHeader ? 'text-slate-600' : 'text-white/80'}`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {activeDropdown && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
              onClick={() => setActiveDropdown(null)}
            />

            <div className="absolute left-1/2 top-full z-50 hidden w-[90vw] max-w-[960px] -translate-x-1/2 pt-3 md:block">
              <div className="relative rounded-2xl border border-teal-700/10 bg-white shadow-2xl">
                {selectedNav === activeDropdown && selectedFilter && (
                  <button
                    className="absolute right-4 top-3 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                    onClick={clearFilter}
                  >
                    {t('navigation.reset')}
                  </button>
                )}
                <div className="grid max-h-[500px] grid-cols-3 gap-4 overflow-y-auto p-6 text-slate-800">
                  <FilterGroups
                    dropdownType={activeDropdown}
                    selectedFilter={selectedNav === activeDropdown ? selectedFilter : null}
                    onSelect={(filterLabel) => handleFilterClick(activeDropdown, filterLabel)}
                    translateCatalogLabel={translateCatalogLabel}
                  />
                </div>
              </div>
            </div>

            <div className="fixed inset-y-0 left-0 z-50 flex w-[360px] max-w-[85vw] flex-col overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 shadow-2xl md:hidden">
              <div className="flex items-center justify-between border-b border-teal-700/15 bg-gradient-to-r from-teal-700/10 to-teal-700/0 px-6 py-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {translateCatalogLabel(formatFilterLabel(activeNavItem?.title ?? activeDropdown))}
                  </h3>
                  <p className="text-sm text-slate-500">{t('navigation.refineSelection')}</p>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700/10 text-teal-700 transition hover:bg-teal-700/20"
                  onClick={() => setActiveDropdown(null)}
                  aria-label={t('navigation.close')}
                >
                  <X size={22} />
                </button>
              </div>

              {selectedNav === activeDropdown && selectedFilter && (
                <button
                  className="mx-5 mt-4 rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
                  onClick={clearFilter}
                >
                  {t('navigation.reset')}
                </button>
              )}

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  {(groupFilters(activeDropdown) as FilterGroupEntry[]).map(([category, filters]) => (
                    <div key={category} className="space-y-2 border-b border-teal-700/10 pb-4 last:border-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-[1px] text-teal-700">
                        {translateCatalogLabel(formatFilterLabel(category))}
                      </div>
                      {filters.map((filter) => {
                        const isSelected = selectedNav === activeDropdown && selectedFilter === filter.label;

                        return (
                          <button
                            key={filter.label}
                            className={`w-full rounded-lg px-4 py-2 text-left text-[12px] font-medium transition hover:translate-x-1 hover:bg-teal-50 hover:text-teal-700 ${
                              isSelected
                                ? 'bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow'
                                : 'bg-transparent text-slate-800'
                            }`}
                            onClick={() => handleFilterClick(activeDropdown, filter.label)}
                          >
                            {translateCatalogLabel(formatFilterLabel(filter.label))}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-2.5">
          <button
            className={`${actionBtn} ${isSolidHeader ? 'text-slate-900' : 'text-white'} ${
              isSearchOpen ? 'bg-white/12 ring-2 ring-white/20 md:bg-slate-900/5 md:ring-slate-900/10' : ''
            }`}
            aria-label={t('navigation.search')}
            aria-expanded={isSearchOpen}
            aria-controls="portal-search-panel"
            onClick={toggleSearch}
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
          <div ref={languageMenuRef} className="relative">
            <button
              type="button"
              className={`${actionBtn} ${isSolidHeader ? 'text-slate-900' : 'text-white'} ${isLanguageOpen ? 'bg-white/15 ring-2 ring-white/20 md:bg-slate-900/5 md:ring-slate-900/10' : ''}`}
              aria-label={`${t('language.choose')} (${language.toUpperCase()})`}
              aria-haspopup="listbox"
              aria-expanded={isLanguageOpen}
              onClick={() => {
                setIsLanguageOpen((prev) => !prev);
                setIsSearchOpen(false);
                setActiveDropdown(null);
                setIsMenuOpen(false);
              }}
            >
              <Globe size={20} aria-hidden="true" />
              <span className="sr-only">{language === 'fr' ? t('language.french') : t('language.english')}</span>
            </button>

            {isLanguageOpen && (
              <div
                role="listbox"
                aria-label={t('language.choose')}
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      language === option.code
                        ? 'bg-teal-50 text-teal-800'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700'
                    }`}
                    onClick={() => selectLanguage(option.code)}
                  >
                    <span>{option.code === 'fr' ? t('language.french') : t('language.english')}</span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400">{option.nativeLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        id="portal-search-panel"
        className={`absolute inset-x-0 top-full transition-all duration-300 ${
          isSearchOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-5 lg:px-7">
            <form
              className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center"
              onSubmit={submitSearch}
            >
              <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <Search size={17} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {t('search.submit')}
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                onClick={() => setIsSearchOpen(false)}
              >
                {t('navigation.close')}
              </button>
            </form>

            {searchParams.get('q') && (
              <div className="mx-auto mt-3 flex max-w-5xl items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>{t('search.active')}: {searchParams.get('q')}</span>
                <button
                  type="button"
                  className="font-semibold text-slate-900"
                  onClick={() => {
                    navigateToProducts((params) => {
                      params.delete('q');
                    });
                    setSearchQuery('');
                  }}
                >
                  {t('search.clear')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
}
