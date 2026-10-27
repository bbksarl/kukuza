import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/core/i18n';
import { useHeaderNavigation } from '../../hooks/useHeaderNavigation';
import HeaderActions from '../header/HeaderActions';
import HeaderNavigation from '../header/HeaderNavigation';
import HeaderSearch from '../header/HeaderSearch';

export default function Header({ logoSrc = '/assets/logo.png', logoAlt = 'KUKUZA' }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const navigation = useHeaderNavigation();
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 0);
  const isSolidHeader = isScrolled || navigation.pathname !== '/';
  const isMenuOpen = navigation.panel?.kind === 'menu';

  useEffect(() => {
    const style = document.documentElement.style;
    const properties = ['--portal-header-height', 'scroll-padding-top'];
    const previous = properties.map((name) => ({ name, value: style.getPropertyValue(name), priority: style.getPropertyPriority(name) }));
    properties.forEach((name) => style.setProperty(name, '64px'));
    return () => {
      previous.forEach(({ name, value, priority }) => {
        if (value) style.setProperty(name, value, priority);
        else style.removeProperty(name);
      });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={navigation.headerRef}
      className={`fixed inset-x-0 top-0 z-[60] overflow-visible transition-all duration-200 ${isSolidHeader
        ? 'border-b border-slate-900/5 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
        : 'border-b border-transparent bg-transparent'}`}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
        <button
          type="button"
          className={`relative z-40 flex items-center justify-center rounded-md p-2 transition duration-200 md:hidden ${isSolidHeader ? 'text-slate-900' : 'text-white'}`}
          onClick={() => navigation.togglePanel('menu')}
          aria-label={t('navigation.menu')}
          aria-expanded={isMenuOpen}
          aria-controls="portal-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <button type="button" className="flex shrink-0 items-center" onClick={() => navigate('/')}>
          <img src={logoSrc} alt={logoAlt} className={`h-8 w-auto transition ${isSolidHeader ? '' : 'invert brightness-0 contrast-200'}`} />
        </button>
        <HeaderNavigation
          isMenuOpen={isMenuOpen}
          isSolidHeader={isSolidHeader}
          activeDropdown={navigation.panel?.kind === 'filters' ? navigation.panel.dropdown : null}
          selectedNav={navigation.selectedNav}
          selectedFilter={navigation.selectedFilter}
          pathname={navigation.pathname}
          hash={navigation.hash}
          onSelectNav={navigation.selectNav}
          onSelectFilter={navigation.selectFilter}
          onClearFilter={navigation.clearFilter}
          onClose={() => navigation.closePanel(true)}
        />
        <HeaderActions
          isSolidHeader={isSolidHeader}
          isSearchOpen={navigation.panel?.kind === 'search'}
          isLanguageOpen={navigation.panel?.kind === 'language'}
          onToggleSearch={() => navigation.togglePanel('search')}
          onToggleLanguage={() => navigation.togglePanel('language')}
          onClose={() => navigation.closePanel(true)}
        />
      </div>
      {navigation.panel?.kind === 'search' && (
        <HeaderSearch query={navigation.query} onSearch={navigation.search} onClose={() => navigation.closePanel(true)} />
      )}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden" onClick={() => navigation.closePanel(true)} aria-hidden="true" />
      )}
    </header>
  );
}
