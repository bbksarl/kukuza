import { ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/core/i18n';
import { formatFilterLabel, groupFilters, NAV_ITEMS, type DropdownType, type NavItem } from '../../data/catalog';

interface HeaderNavigationProps {
  isMenuOpen: boolean;
  isSolidHeader: boolean;
  activeDropdown: DropdownType | null;
  selectedNav: string | null;
  selectedFilter: string | null;
  pathname: string;
  hash: string;
  onSelectNav: (item: NavItem) => void;
  onSelectFilter: (dropdown: DropdownType, filter: string) => void;
  onClearFilter: () => void;
  onClose: () => void;
}

export default function HeaderNavigation({
  isMenuOpen, isSolidHeader, activeDropdown, selectedNav, selectedFilter,
  pathname, hash, onSelectNav, onSelectFilter, onClearFilter, onClose,
}: HeaderNavigationProps) {
  const { t, translateCatalogLabel } = useLanguage();
  const activeNavItem = NAV_ITEMS.find((item) => item.dropdownType === activeDropdown);

  return (
    <>
      <nav
        id="portal-navigation"
        className={`absolute left-0 top-16 z-40 w-full flex-col gap-1 bg-white px-4 pb-5 pt-3 shadow-2xl md:static md:flex md:w-auto md:flex-row md:items-center md:gap-2.5 md:bg-transparent md:p-0 md:shadow-none ${isMenuOpen ? 'flex' : 'hidden'}`}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = selectedNav ? selectedNav === item.navType : pathname === '/' && hash === item.hash;
          const hasSelectedFilter = selectedNav === item.navType && selectedFilter;
          return (
            <button
              key={item.hash}
              type="button"
              className={`relative flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold tracking-[0.4px] text-slate-900 transition-colors hover:text-portal-primary ${isSolidHeader ? '' : 'md:text-white md:hover:text-portal-primary'} ${isActive ? 'underline underline-offset-4' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-expanded={item.hasDropdown ? activeDropdown === item.dropdownType : undefined}
              aria-controls={item.hasDropdown && activeDropdown === item.dropdownType ? 'portal-filters' : undefined}
              onClick={() => onSelectNav(item)}
            >
              <span className="flex items-center gap-2">
                {translateCatalogLabel(formatFilterLabel(item.title))}
                {hasSelectedFilter && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-portal-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-portal-primary shadow">
                    {translateCatalogLabel(formatFilterLabel(selectedFilter))}
                  </span>
                )}
              </span>
              {item.hasDropdown && <ChevronDown size={12} className={`transition duration-200 ${activeDropdown === item.dropdownType ? 'rotate-180' : ''}`} />}
            </button>
          );
        })}
      </nav>

      {activeDropdown && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden" onClick={onClose} aria-hidden="true" />
          <div
            id="portal-filters"
            className="fixed inset-y-0 left-0 z-50 flex w-[360px] max-w-[85vw] flex-col overflow-hidden rounded-r-2xl border border-teal-700/10 bg-white shadow-2xl md:absolute md:bottom-auto md:left-1/2 md:top-full md:mt-3 md:max-h-[540px] md:w-[90vw] md:max-w-[960px] md:-translate-x-1/2 md:rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-teal-700/15 px-6 py-4">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {translateCatalogLabel(formatFilterLabel(activeNavItem?.title ?? activeDropdown))}
                </h3>
                <p className="text-sm text-slate-500">{t('navigation.refineSelection')}</p>
              </div>
              {selectedNav === activeDropdown && selectedFilter && (
                <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50" onClick={onClearFilter}>
                  {t('navigation.reset')}
                </button>
              )}
              <button type="button" className="rounded-full bg-teal-700/10 p-2 text-teal-700 hover:bg-teal-700/20" onClick={onClose} aria-label={t('navigation.close')}>
                <X size={22} />
              </button>
            </div>
            <div className="grid gap-4 overflow-y-auto p-5 text-slate-800 md:grid-cols-3 md:p-6">
              {groupFilters(activeDropdown).map(([category, filters]) => (
                <div key={category} className="flex flex-col gap-2">
                  <div className="border-b-2 border-teal-700 pb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-teal-700">
                    {translateCatalogLabel(formatFilterLabel(category))}
                  </div>
                  {filters.map((filter) => {
                    const isSelected = selectedNav === activeDropdown && selectedFilter === filter.label;
                    return (
                      <button
                        key={filter.label}
                        type="button"
                        aria-pressed={isSelected}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition hover:translate-x-1 hover:bg-teal-50 hover:text-teal-700 ${isSelected ? 'bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow' : 'bg-transparent text-slate-800'}`}
                        onClick={() => onSelectFilter(activeDropdown, filter.label)}
                      >
                        {translateCatalogLabel(formatFilterLabel(filter.label))}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
