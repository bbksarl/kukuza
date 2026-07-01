import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Globe, Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ logoSrc = '/assets/logo.png', logoAlt = 'KUKUZA' }){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#nouveautes');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const nouveautesFilters = [
    { label: 'Cette semaine', category: 'Temps' },
    { label: 'Semaine précédente', category: 'Temps' },
    { label: 'Les essentiels', category: 'Collections' },
    { label: 'Il fait froid dehors', category: 'Collections' },
    { label: 'Sélection ski', category: 'Collections' },
    { label: 'Vacances', category: 'Collections' },
    { label: 'Tendances du moment', category: 'Collections' },
    { label: 'Nouvelle saison', category: 'Collections' },
    { label: 'Nouveautés', category: 'Catégories' },
    { label: 'Vêtements', category: 'Catégories' },
    { label: 'Chaussures', category: 'Catégories' },
    { label: 'Sacs', category: 'Catégories' },
    { label: 'Accessoires', category: 'Catégories' },
    { label: 'Bijoux', category: 'Catégories' }
  ];

  const createursFilters = [
    { label: 'Atelier Rabbal', category: 'A-C' },
    { label: 'BTOURE', category: 'A-C' },
    { label: 'Bellesansmaquillage', category: 'A-C' },
    { label: 'ByMakan', category: 'A-C' },
    { label: 'Colle Sow Ardo', category: 'A-C' },
    { label: 'Algueye', category: 'A-C' },
    { label: 'Jeyna A', category: 'J-O' },
    { label: 'Nene Yayah', category: 'J-O' },
    { label: 'Owens', category: 'J-O' },
    { label: 'Sokoundou', category: 'S-Z' }
  ];

  const vetementsFilters = [
    { label: 'Tous les vêtements', category: 'Catégorie' },
    { label: 'Tops', category: 'Catégorie' },
    { label: 'Robes', category: 'Catégorie' },
    { label: 'Pantalons', category: 'Catégorie' },
    { label: 'Jupes', category: 'Catégorie' },
    { label: 'Vestes & Manteaux', category: 'Catégorie' },
    { label: 'Lingerie', category: 'Catégorie' },
    { label: 'XS', category: 'Taille' },
    { label: 'S', category: 'Taille' },
    { label: 'M', category: 'Taille' },
    { label: 'L', category: 'Taille' },
    { label: 'XL', category: 'Taille' },
    { label: 'Prix: < 50€', category: 'Prix' },
    { label: 'Prix: 50€ - 100€', category: 'Prix' },
    { label: 'Prix: > 100€', category: 'Prix' }
  ];

  const chaussuresFilters = [
    { label: 'Tous les modèles', category: 'Catégorie' },
    { label: 'Sneakers', category: 'Catégorie' },
    { label: 'Bottes', category: 'Catégorie' },
    { label: 'Sandales', category: 'Catégorie' },
    { label: 'Mocassins', category: 'Catégorie' },
    { label: 'Escarpins', category: 'Catégorie' },
    { label: 'Prix: < 50€', category: 'Prix' },
    { label: 'Prix: 50€ - 100€', category: 'Prix' },
    { label: 'Prix: > 100€', category: 'Prix' }
  ];

  const decorFilters = [
    { label: 'Tous les articles', category: 'Catégorie' },
    { label: 'Décoration', category: 'Catégorie' },
    { label: 'Mobilier', category: 'Catégorie' },
    { label: 'Luminaires', category: 'Catégorie' },
    { label: 'Textiles & Literie', category: 'Catégorie' },
    { label: 'Cadeaux', category: 'Catégorie' },
    { label: 'Style: Minimaliste', category: 'Style' },
    { label: 'Style: Bohème', category: 'Style' },
    { label: 'Style: Industriel', category: 'Style' },
    { label: 'Prix: < 50€', category: 'Prix' },
    { label: 'Prix: 50€ - 200€', category: 'Prix' },
    { label: 'Prix: > 200€', category: 'Prix' }
  ];

  const sacsFilters = [
    { label: 'Tous les sacs', category: 'Catégorie' },
    { label: 'Tote', category: 'Catégorie' },
    { label: 'Crossbody', category: 'Catégorie' },
    { label: 'Clutch', category: 'Catégorie' },
    { label: 'Sac à dos', category: 'Catégorie' },
    { label: 'Matière: Cuir', category: 'Matière' },
    { label: 'Matière: Toile', category: 'Matière' },
    { label: 'Matière: Synthétique', category: 'Matière' },
    { label: 'Prix: < 50€', category: 'Prix' },
    { label: 'Prix: 50€ - 150€', category: 'Prix' },
    { label: 'Prix: > 150€', category: 'Prix' }
  ];

  const accessoiresFilters = [
    { label: 'Tous les accessoires', category: 'Catégorie' },
    { label: 'Ceintures', category: 'Catégorie' },
    { label: 'Écharpes', category: 'Catégorie' },
    { label: 'Chapeaux', category: 'Catégorie' },
    { label: 'Lunettes', category: 'Catégorie' },
    { label: 'Bijoux fins', category: 'Catégorie' },
    { label: 'Matière: Cuir', category: 'Matière' },
    { label: 'Matière: Métal', category: 'Matière' },
    { label: 'Matière: Tissu', category: 'Matière' },
    { label: 'Prix: < 30€', category: 'Prix' },
    { label: 'Prix: 30€ - 80€', category: 'Prix' },
    { label: 'Prix: > 80€', category: 'Prix' }
  ];

  const groupedNouveautesFilters = nouveautesFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedCreateursFilters = createursFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedVetementsFilters = vetementsFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedChaussuresFilters = chaussuresFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedDecorFilters = decorFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedSacsFilters = sacsFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedAccessoiresFilters = accessoiresFilters.reduce((acc: any, filter: any) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash || '#nouveautes');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleFilterClick = (filter: any) => {
    setSelectedFilter(filter);
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const clearFilter = () => {
    setSelectedFilter(null);
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const navItems = [
    { hash: '#nouveautes', title: 'NOUVEAUTÉS', hasDropdown: true, dropdownType: 'nouveautes' },
    { hash: '#createurs', title: 'CRÉATEURS', hasDropdown: true, dropdownType: 'createurs' },
    { hash: '#vetements', title: 'VÊTEMENTS', hasDropdown: true, dropdownType: 'vetements' },
    { hash: '#chaussures', title: 'CHAUSSURES', hasDropdown: true, dropdownType: 'chaussures' },
    { hash: '#decor', title: 'DÉCOR ET LIFESTYLE', hasDropdown: true, dropdownType: 'decor' },
    { hash: '#sacs', title: 'SACS', hasDropdown: true, dropdownType: 'sacs' },
    { hash: '#accessoires', title: 'ACCESSOIRES', hasDropdown: true, dropdownType: 'accessoires' },
    { hash: '#promotion', title: 'PROMOTION', hasDropdown: false },
  ];

  const linkBase = `flex items-center justify-between gap-1.5 font-semibold tracking-[0.4px] transition-colors duration-200 rounded-lg relative`;
  const linkColor = isScrolled ? 'text-slate-900 hover:text-portal-primary' : 'text-white hover:text-portal-primary';
  const actionBtn = `inline-flex items-center justify-center rounded-full p-2 transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-primary/40`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] overflow-visible transition-all duration-200 ${
        isScrolled
          ? 'bg-white backdrop-blur-md border-b border-slate-900/5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
        <button
          className={`flex items-center justify-center rounded-md p-2 transition duration-200 md:hidden ${
            isScrolled ? 'text-slate-900' : 'text-white'
          }`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <a href="/" className="flex shrink-0 items-center">
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`h-8 w-auto transition ${isScrolled ? '' : 'invert brightness-0 contrast-200'}`}
          />
        </a>

        <nav
          className={`absolute left-0 top-16 flex w-full flex-col gap-1 bg-white/95 px-4 pb-5 pt-3 shadow-2xl transition-all duration-300 md:static md:w-auto md:flex-row md:items-center md:gap-2.5 md:bg-transparent md:p-0 md:shadow-none ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {navItems.map((item) => (
            <div key={item.hash} className="relative">
              <a
                href={item.hash}
                className={`${linkBase} ${linkColor} px-2 py-1.5 text-[11px] md:text-[11px]`}
                aria-current={currentHash === item.hash ? 'page' : undefined}
                aria-haspopup={item.hasDropdown ? 'true' : undefined}
                aria-expanded={item.hasDropdown ? activeDropdown === item.hash : undefined}
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault();
                    if (activeDropdown !== item.hash) setSelectedFilter(null);
                    setActiveDropdown(activeDropdown === item.hash ? null : item.hash);
                    setIsSearchOpen(false);
                    return;
                  }
                  setIsMenuOpen(false);
                  setSelectedFilter(null);
                  setIsSearchOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  {item.title}
                  {item.hasDropdown && selectedFilter && activeDropdown === item.hash && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow md:bg-portal-primary/10 md:text-portal-primary">
                      {selectedFilter}
                    </span>
                  )}
                </span>
                {item.hasDropdown && (
                    <ChevronDown
                    size={12}
                    className={`transition duration-200 ${
                      activeDropdown === item.hash ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-600' : 'text-white/80'}`}
                  />
                )}
              </a>
            </div>
          ))}
        </nav>

        {activeDropdown && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
              onClick={() => setActiveDropdown(null)}
            />

            <div className="absolute left-1/2 top-full z-50 hidden w-[90vw] max-w-[960px] -translate-x-1/2 pt-3 md:block">
              <div className="relative rounded-2xl border border-teal-700/10 bg-white shadow-2xl">
                {selectedFilter && (
                  <button
                    className="absolute right-4 top-3 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                    onClick={clearFilter}
                  >
                    Réinitialiser
                  </button>
                )}
                <div className="grid max-h-[500px] grid-cols-3 gap-4 overflow-y-auto p-6 text-slate-800">
                  {(() => {
                    const currentItem = navItems.find((item) => item.hash === activeDropdown);
                    if (!currentItem) return [];
                    if (currentItem.dropdownType === 'nouveautes') return Object.entries(groupedNouveautesFilters);
                    if (currentItem.dropdownType === 'createurs') return Object.entries(groupedCreateursFilters);
                    if (currentItem.dropdownType === 'vetements') {
                      const order = ['Catégorie', 'Taille', 'Prix'];
                      return order.map((cat) => [cat, groupedVetementsFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'chaussures') {
                      const order = ['Catégorie', 'Prix'];
                      return order.map((cat) => [cat, groupedChaussuresFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'decor') {
                      const order = ['Catégorie', 'Style', 'Prix'];
                      return order.map((cat) => [cat, groupedDecorFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'sacs') {
                      const order = ['Catégorie', 'Matière', 'Prix'];
                      return order.map((cat) => [cat, groupedSacsFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'accessoires') {
                      const order = ['Catégorie', 'Matière', 'Prix'];
                      return order.map((cat) => [cat, groupedAccessoiresFilters[cat] || []]);
                    }
                    return [];
                  })().map(([category, filters]: any) => (
                    <div key={category} className="flex flex-col gap-2">
                      <div className="border-b-2 border-teal-700 pb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-teal-700">
                        {category}
                      </div>
                      {filters.map((filter: any) => (
                        <button
                          key={filter.label}
                          className={`w-full rounded-lg px-3 py-2 text-left text-[11px] font-medium transition hover:translate-x-1 hover:bg-teal-50 hover:text-teal-700 ${
                            selectedFilter === filter.label
                              ? 'bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow'
                              : 'bg-transparent text-slate-800'
                          }`}
                          onClick={() => handleFilterClick(filter.label)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fixed inset-y-0 left-0 z-50 flex w-[360px] max-w-[85vw] flex-col overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 shadow-2xl md:hidden">
              <div className="flex items-center justify-between border-b border-teal-700/15 bg-gradient-to-r from-teal-700/10 to-teal-700/0 px-6 py-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {navItems.find((item) => item.hash === activeDropdown)?.title}
                  </h3>
                  <p className="text-sm text-slate-500">Affinez votre sélection</p>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700/10 text-teal-700 transition hover:bg-teal-700/20"
                  onClick={() => setActiveDropdown(null)}
                  aria-label="Fermer"
                >
                  <X size={22} />
                </button>
              </div>

              {selectedFilter && (
                <button
                  className="mx-5 mt-4 rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg"
                  onClick={clearFilter}
                >
                  Réinitialiser
                </button>
              )}

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  {(() => {
                    const currentItem = navItems.find((item) => item.hash === activeDropdown);
                    if (!currentItem) return [];
                    if (currentItem.dropdownType === 'nouveautes') return Object.entries(groupedNouveautesFilters);
                    if (currentItem.dropdownType === 'createurs') return Object.entries(groupedCreateursFilters);
                    if (currentItem.dropdownType === 'vetements') {
                      const order = ['Catégorie', 'Taille', 'Prix'];
                      return order.map((cat) => [cat, groupedVetementsFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'chaussures') {
                      const order = ['Catégorie', 'Prix'];
                      return order.map((cat) => [cat, groupedChaussuresFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'decor') {
                      const order = ['Catégorie', 'Style', 'Prix'];
                      return order.map((cat) => [cat, groupedDecorFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'sacs') {
                      const order = ['Catégorie', 'Matière', 'Prix'];
                      return order.map((cat) => [cat, groupedSacsFilters[cat] || []]);
                    }
                    if (currentItem.dropdownType === 'accessoires') {
                      const order = ['Catégorie', 'Matière', 'Prix'];
                      return order.map((cat) => [cat, groupedAccessoiresFilters[cat] || []]);
                    }
                    return [];
                  })().map(([category, filters]: any) => (
                    <div key={category} className="space-y-2 border-b border-teal-700/10 pb-4 last:border-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-[1px] text-teal-700">
                        {category}
                      </div>
                      {filters.map((filter: any) => (
                        <button
                          key={filter.label}
                          className={`w-full rounded-lg px-4 py-2 text-left text-[12px] font-medium transition hover:translate-x-1 hover:bg-teal-50 hover:text-teal-700 ${
                            selectedFilter === filter.label
                              ? 'bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow'
                              : 'bg-transparent text-slate-800'
                          }`}
                          onClick={() => handleFilterClick(filter.label)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

          <div className="flex items-center gap-2.5">
          <button
            className={`${actionBtn} ${isScrolled ? 'text-slate-900' : 'text-white'} ${
              isSearchOpen ? 'bg-white/12 ring-2 ring-white/20 md:bg-slate-900/5 md:ring-slate-900/10' : ''
            }`}
            aria-label="Search"
            aria-expanded={isSearchOpen}
            aria-controls="portal-search-panel"
            onClick={toggleSearch}
          >
            <Search size={20} />
          </button>
          <button
            className={`${actionBtn} ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Account"
            onClick={() => (window.location.href = 'http://localhost:3001/login')}
          >
            <User size={20} />
          </button>
          <button className={`${actionBtn} ${isScrolled ? 'text-slate-900' : 'text-white'}`} aria-label="Favorites">
            <Heart size={20} />
          </button>
          <button
            className={`${actionBtn} relative ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
              1
            </span>
          </button>
          <button className={`${actionBtn} ${isScrolled ? 'text-slate-900' : 'text-white'}`} aria-label="Language">
            <Globe size={20} />
          </button>
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
        <div className="border-t border-slate-200/80">
          <div className="mx-auto max-w-screen-2xl px-3 py-3 sm:px-5 lg:px-7">
            <form
              className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <Search size={17} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit, une marque ou une catégorie"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:text-white"
                onClick={() => setIsSearchOpen(false)}
              >
                Fermer
              </button>
            </form>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
}
