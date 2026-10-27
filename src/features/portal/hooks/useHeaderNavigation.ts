import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { DropdownType, NavItem } from '../data/catalog';

type PanelName = 'menu' | 'search' | 'language';
export type HeaderPanel = { kind: PanelName } | { kind: 'filters'; dropdown: DropdownType } | null;

export function useHeaderNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [panel, setPanel] = useState<HeaderPanel>(null);
  const headerRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const closePanel = useCallback((restoreFocus = false) => {
    setPanel(null);
    if (restoreFocus) openerRef.current?.focus();
  }, []);

  useEffect(() => {
    closePanel();
  }, [location.pathname, location.search, location.hash, closePanel]);

  useEffect(() => {
    if (!panel) return;
    const onOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) closePanel();
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel(true);
    };
    document.addEventListener('mousedown', onOutsideClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [panel, closePanel]);

  const rememberOpener = () => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };

  const togglePanel = (kind: PanelName) => {
    rememberOpener();
    setPanel((current) => current?.kind === kind ? null : { kind });
  };

  const navigateToProducts = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    update(params);
    navigate({ pathname: '/products', search: params.toString() });
    closePanel();
  };

  const selectNav = (item: NavItem) => {
    const dropdown = item.dropdownType;
    if (item.hasDropdown && dropdown) {
      // On mobile the category button disappears with the menu; return to its opener.
      if (panel?.kind !== 'menu') rememberOpener();
      setPanel((current) => current?.kind === 'filters' && current.dropdown === dropdown
        ? null
        : { kind: 'filters', dropdown });
      return;
    }
    navigateToProducts((params) => {
      params.set('nav', item.navType);
      params.delete('filter');
    });
  };

  const selectFilter = (dropdown: DropdownType, filter: string) => {
    navigateToProducts((params) => {
      params.set('nav', dropdown);
      params.set('filter', filter);
    });
  };

  const clearFilter = () => {
    navigateToProducts((params) => {
      params.delete('nav');
      params.delete('filter');
    });
  };

  const search = (query: string) => {
    navigateToProducts((params) => {
      const value = query.trim();
      if (value) params.set('q', value);
      else params.delete('q');
    });
  };

  return {
    headerRef, panel, togglePanel, closePanel, selectNav, selectFilter, clearFilter, search,
    selectedNav: searchParams.get('nav'),
    selectedFilter: searchParams.get('filter'),
    query: searchParams.get('q') ?? '',
    pathname: location.pathname,
    hash: location.hash,
  };
}
