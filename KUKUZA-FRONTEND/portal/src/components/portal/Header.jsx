import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Globe, Menu, X, ChevronDown } from 'lucide-react';
import './animations.css';

export default function Header({ logoSrc = '/assets/logo.png', logoAlt = 'KUKUZA' }){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#nouveautes');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const groupedNouveautesFilters = nouveautesFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedCreateursFilters = createursFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) {
      acc[filter.category] = [];
    }
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedVetementsFilters = vetementsFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedChaussuresFilters = chaussuresFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedDecorFilters = decorFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedSacsFilters = sacsFilters.reduce((acc, filter) => {
    if (!acc[filter.category]) acc[filter.category] = [];
    acc[filter.category].push(filter);
    return acc;
  }, {});

  const groupedAccessoiresFilters = accessoiresFilters.reduce((acc, filter) => {
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
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    // Keep dropdown open on desktop, close on mobile
    if (isMobile) {
      setActiveDropdown(null);
      setIsMenuOpen(false);
    }
  };

  const clearFilter = () => {
    setSelectedFilter(null);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest('.portal-header__nav-item')) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown && !isMobile) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown, isMobile]);

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

  return (
    <header 
      className={`w-full fixed top-0 left-0 right-0 h-16 z-[60] transition-all duration-[240ms] ease-out
                 max-[768px]:overflow-hidden ${
        isScrolled ? 'header-glass-scrolled' : 'header-glass-top'
      }`}
      style={{ overflow: 'visible' }}>
      <div className="max-w-full mx-auto px-8 py-3 flex items-center justify-between gap-6 overflow-visible
                      max-[1024px]:px-6 max-[768px]:px-4 max-[768px]:py-2.5 max-[640px]:px-3 max-[640px]:py-2">
        <button 
          className={`hidden max-[768px]:flex bg-transparent border-none cursor-pointer p-1 items-center justify-center
                     transition-colors duration-200 ${isScrolled ? 'text-slate-900' : 'text-white'}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <a href="/" className="flex items-center no-underline shrink-0">
          <img 
            src={logoSrc} 
            alt={logoAlt} 
            className={`h-10 w-auto object-contain transition-[filter] duration-[240ms] ease-out
                       max-[768px]:h-[34px] max-[640px]:h-[30px]
                       ${isScrolled ? '' : 'logo-white-filter'}`}
          />
        </a>
        
        <nav className={`flex gap-4 flex-1 justify-center items-center
                        max-[1024px]:gap-3
                        max-[768px]:fixed max-[768px]:top-16 max-[768px]:flex-col max-[768px]:items-stretch
                        max-[768px]:z-[120] max-[768px]:h-[calc(100vh-4rem)] max-[768px]:py-8 max-[768px]:px-5
                        max-[768px]:overflow-y-auto max-[768px]:overflow-x-hidden max-[768px]:scrollbar-thin
                        max-[768px]:mobile-nav-gradient max-[768px]:rounded-tr-3xl max-[768px]:rounded-br-3xl
                        max-[768px]:border-r max-[768px]:border-teal-700/[0.08] max-[768px]:transition-all max-[768px]:duration-[320ms]
                        max-[768px]:w-[360px] max-[768px]:max-w-[85vw]
                        ${isMenuOpen ? 'max-[768px]:left-0 max-[768px]:mobile-nav-shadow-open' : 'max-[768px]:-left-[380px] max-[768px]:mobile-nav-shadow'}`}>
          {navItems.map((item) => (
            <div
              key={item.hash}
              className="portal-header__nav-item relative flex items-center
                        max-[768px]:w-full max-[768px]:p-0 max-[768px]:mb-1.5 max-[768px]:flex-col
                        max-[768px]:rounded-[14px] max-[768px]:bg-transparent max-[768px]:transition-all max-[768px]:duration-[240ms]
                        max-[768px]:hover:bg-teal-700/[0.04]"
            >
              <a
                href={item.hash}
                className={`no-underline font-semibold text-[13px] tracking-[0.6px] whitespace-nowrap px-2 py-1.5
                           transition-colors duration-[240ms] ease-out flex items-center gap-1
                           hover:text-[var(--portal-primary)]
                           max-[768px]:text-slate-900 max-[768px]:text-[15px] max-[768px]:tracking-[0.2px] max-[768px]:px-[18px]
                           max-[768px]:py-4 max-[768px]:w-full max-[768px]:justify-between max-[768px]:rounded-[14px]
                           max-[768px]:hover:text-teal-700 max-[768px]:hover:bg-teal-700/[0.06]
                           max-[640px]:text-xs max-[640px]:px-1.5
                           ${isScrolled ? 'text-slate-900' : 'text-white'}
                           ${currentHash === item.hash ? 'max-[768px]:text-teal-700 max-[768px]:bg-gradient-to-r max-[768px]:from-teal-700/10 max-[768px]:to-teal-700/[0.04] max-[768px]:font-bold' : ''}`}
                aria-current={currentHash === item.hash ? 'page' : undefined}
                aria-haspopup={item.hasDropdown ? 'true' : undefined}
                aria-expanded={item.hasDropdown ? (activeDropdown === item.hash).toString() : undefined}
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === item.hash ? null : item.hash);
                    return;
                  }
                  setIsMenuOpen(false);
                }}
              >
                <span className="flex-1">{item.title}</span>
                {(item.hash === '#vetements' || item.hash === '#chaussures' || item.hash === '#sacs' || item.hash === '#decor' || item.hash === '#accessoires') && selectedFilter && (
                  <span className="inline-block ml-2 text-white text-[11px] px-2 py-1 rounded-full font-semibold
                                 filter-badge-gradient shadow-[0_2px_8px_rgba(15,118,110,0.25)]
                                 max-[768px]:ml-2">
                    {selectedFilter}
                  </span>
                )}
                {item.hasDropdown && (
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 shrink-0 opacity-60
                              max-[768px]:opacity-60 hover:opacity-100
                              ${activeDropdown === item.hash && !isMobile ? 'rotate-180 opacity-100' : ''}`}
                  />
                )}
              </a>

              {/* Desktop dropdown - shown directly below nav item */}
              {item.hasDropdown && activeDropdown === item.hash && !isMobile && (
                <div 
                  className="absolute bg-white rounded-[18px] border border-teal-700/15 text-gray-800
                            shadow-[0_16px_56px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)]
                            max-h-[70vh] overflow-y-auto overflow-x-hidden"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 16px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: item.dropdownType === 'nouveautes' ? '700px' : item.dropdownType === 'decor' ? '750px' : '480px',
                    maxWidth: 'calc(100vw - 80px)',
                    minWidth: item.dropdownType === 'nouveautes' ? '600px' : item.dropdownType === 'decor' ? '650px' : '480px',
                    zIndex: 99999,
                    backgroundColor: '#ffffff',
                    display: 'block',
                    opacity: 1,
                    visibility: 'visible'
                  }}>
                  {/* Triangle pointer */}
                  <div 
                    className="absolute bg-white border-l border-t border-teal-700/15"
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      pointerEvents: 'none'
                    }}
                  ></div>
                  {selectedFilter && (
                    <button 
                      className="absolute top-4 right-5 border-none bg-teal-700/10 text-teal-700 font-bold cursor-pointer
                                px-3.5 py-2 rounded-[10px] transition-all duration-200 text-[13px] z-[2]
                                hover:bg-teal-700/15 hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(15,118,110,0.2)]
                                active:translate-y-0"
                      onClick={clearFilter}
                    >
                      Réinitialiser
                    </button>
                  )}
                  <div className="px-6 py-5 pb-6 grid grid-cols-3 gap-5">
                    {(() => {
                      if (item.dropdownType === 'nouveautes') return Object.entries(groupedNouveautesFilters);
                      if (item.dropdownType === 'createurs') return Object.entries(groupedCreateursFilters);
                      if (item.dropdownType === 'vetements') {
                        const order = ['Catégorie', 'Taille', 'Prix'];
                        return order.map((cat) => [cat, groupedVetementsFilters[cat] || []]);
                      }
                      if (item.dropdownType === 'chaussures') {
                        const order = ['Catégorie', 'Prix'];
                        return order.map((cat) => [cat, groupedChaussuresFilters[cat] || []]);
                      }
                      if (item.dropdownType === 'decor') {
                        const order = ['Catégorie', 'Style', 'Prix'];
                        return order.map((cat) => [cat, groupedDecorFilters[cat] || []]);
                      }
                      if (item.dropdownType === 'sacs') {
                        const order = ['Catégorie', 'Matière', 'Prix'];
                        return order.map((cat) => [cat, groupedSacsFilters[cat] || []]);
                      }
                      if (item.dropdownType === 'accessoires') {
                        const order = ['Catégorie', 'Matière', 'Prix'];
                        return order.map((cat) => [cat, groupedAccessoiresFilters[cat] || []]);
                      }
                      return [];
                    })().map(([category, filters]) => (
                      <div key={category} className="flex flex-col gap-2 min-w-[180px] min-h-[40px]">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-teal-700 px-3.5 py-2.5 pb-2
                                      mb-2 border-b-2 border-teal-700 sticky top-0 bg-white z-[1]">
                          {category}
                        </div>
                        {filters.map((filter) => (
                          <button
                            key={filter.label}
                            className={`w-full text-left px-3.5 py-2.5 border-none bg-transparent text-gray-800 text-sm font-medium
                                      cursor-pointer rounded-[10px] transition-all duration-200 block relative leading-[1.4]
                                      hover:bg-teal-700/[0.08] hover:text-teal-700 hover:translate-x-0.5 hover:pl-4
                                      ${selectedFilter === filter.label ? 
                                        'dropdown-item-active-gradient text-white font-semibold shadow-[0_4px_14px_rgba(15,118,110,0.35)] pl-3.5 hover:translate-x-0.5 hover:scale-[1.02] hover:shadow-[0_6px_18px_rgba(15,118,110,0.45)] hover:pl-4' : 
                                        ''}`}
                            onClick={() => handleFilterClick(filter.label)}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile dropdown modal window */}
        {activeDropdown && isMobile && (
          <>
            <div 
              className="fixed top-0 left-0 w-screen h-screen overlay-blur z-[130] animate-overlay-fade"
              onClick={() => setActiveDropdown(null)}
            ></div>
            <div className="fixed top-0 left-0 w-[360px] max-w-[85vw] h-screen mobile-nav-gradient 
                          rounded-tr-3xl rounded-br-3xl dropdown-modal-shadow z-[140] overflow-hidden
                          animate-slide-left flex flex-col">
              <div className="flex items-center justify-between px-6 py-8 pb-5 border-b-2 border-teal-700/15
                            dropdown-header-gradient shrink-0 relative
                            after:content-[''] after:absolute after:-bottom-0.5 after:left-6 after:w-[60px] after:h-0.5
                            after:bg-gradient-to-r after:from-teal-700 after:to-teal-500 after:rounded-sm">
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-slate-900 m-0 tracking-tight">
                  {navItems.find(item => item.hash === activeDropdown)?.title}
                </h3>
                <button 
                  className="bg-teal-700/10 border-none w-11 h-11 rounded-full flex items-center justify-center
                           cursor-pointer text-teal-700 transition-all duration-[240ms] shrink-0
                           hover:bg-teal-700/20 hover:rotate-90 active:rotate-90 active:scale-95"
                  onClick={() => setActiveDropdown(null)}
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
              {selectedFilter && (
                <button 
                  className="mx-5 my-0 mb-5 px-[18px] py-3 filter-badge-gradient text-white border-none
                           rounded-xl font-semibold text-sm cursor-pointer transition-all duration-[240ms]
                           shadow-[0_4px_12px_rgba(15,118,110,0.25)] w-[calc(100%-40px)]
                           hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,118,110,0.35)]
                           active:translate-y-0"
                  onClick={clearFilter}
                >
                  Réinitialiser
                </button>
              )}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 pb-8 scrollbar-thin">
                <div className="block p-0">
                  {(() => {
                    const currentItem = navItems.find(item => item.hash === activeDropdown);
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
                  })().map(([category, filters]) => (
                    <div key={category} className="py-3 mb-4 border-b border-teal-700/12 rounded-none last:border-b-0 last:mb-0">
                      <div className="px-3 py-2.5 mb-2.5 text-[11px] font-extrabold tracking-wider
                                    dropdown-category-gradient rounded-lg text-teal-700 uppercase">
                        {category}
                      </div>
                      {filters.map((filter) => (
                        <button
                          key={filter.label}
                          className={`px-4 py-3.5 text-[15px] text-gray-800 rounded-[10px] font-medium
                                    transition-all duration-[220ms] relative bg-transparent border-none w-full
                                    text-left cursor-pointer mb-1
                                    hover:bg-teal-700/[0.08] hover:text-teal-700 hover:translate-x-1.5 hover:pl-5
                                    active:translate-x-1 active:scale-[0.98]
                                    ${selectedFilter === filter.label ? 
                                      'dropdown-item-active-gradient text-white font-semibold shadow-[0_4px_12px_rgba(15,118,110,0.3)] hover:translate-x-1.5 hover:scale-[1.02] hover:shadow-[0_6px_16px_rgba(15,118,110,0.4)]' : 
                                      ''}`}
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
        
        <div className="flex gap-3.5 items-center shrink-0 max-[640px]:gap-2">
          <button 
            className={`bg-transparent border-none cursor-pointer p-1.5 inline-flex items-center justify-center
                       transition-all duration-200
                       hover:scale-110
                       ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Search"
          >
            <Search size={20} className="max-[768px]:w-[18px] max-[768px]:h-[18px] max-[640px]:w-4 max-[640px]:h-4" />
          </button>
          <button 
            className={`bg-transparent border-none cursor-pointer p-1.5 inline-flex items-center justify-center
                       transition-all duration-200
                       hover:scale-110
                       ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Account"
          >
            <User size={20} className="max-[768px]:w-[18px] max-[768px]:h-[18px] max-[640px]:w-4 max-[640px]:h-4" />
          </button>
          <button 
            className={`bg-transparent border-none cursor-pointer p-1.5 inline-flex items-center justify-center
                       transition-all duration-200
                       hover:scale-110
                       ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Favorites"
          >
            <Heart size={20} className="max-[768px]:w-[18px] max-[768px]:h-[18px] max-[640px]:w-4 max-[640px]:h-4" />
          </button>
          <button 
            className={`relative bg-transparent border-none cursor-pointer p-1.5 inline-flex items-center justify-center
                       transition-all duration-200
                       hover:scale-110
                       ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Cart"
          >
            <ShoppingBag size={20} className="max-[768px]:w-[18px] max-[768px]:h-[18px] max-[640px]:w-4 max-[640px]:h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold
                           px-1.5 py-0.5 rounded-xl min-w-[18px] text-center">
              1
            </span>
          </button>
          <button 
            className={`bg-transparent border-none cursor-pointer p-1.5 inline-flex items-center justify-center
                       transition-all duration-200
                       hover:scale-110
                       ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            aria-label="Language"
          >
            <Globe size={20} className="max-[768px]:w-[18px] max-[768px]:h-[18px] max-[640px]:w-4 max-[640px]:h-4" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="block fixed top-16 left-0 w-screen h-[calc(100vh-4rem)] overlay-blur z-[99] animate-overlay-fade
                     max-[768px]:block hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
}