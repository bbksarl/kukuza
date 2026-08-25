import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Plus, Package, LogOut, X } from 'lucide-react';
import { useLanguage } from '@/core/i18n';
import { DEFAULT_BOUTIQUE } from '@/features/shop/data/defaultBoutique';

interface SidebarProps {
  activePath?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath = '/shop/dashboard', isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: t('shop.dashboard'),
      path: '/shop/dashboard'
    },
    {
      icon: <ShoppingBag size={20} />,
      label: t('shop.sales'),
      path: '/shop/ventes'
    },
    {
      icon: <Plus size={20} />,
      label: t('shop.addProduct'),
      path: '/shop/produits/ajouter'
    },
    {
      icon: <Package size={20} />,
      label: t('shop.products'),
      path: '/shop/produits'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Desktop Fixed */}
      <aside className={`shop-dashboard-sidebar fixed left-0 top-0 h-screen w-[80px] bg-white border-r border-(--color-border) flex flex-col items-center z-50 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Boutique identity */}
        <div className="shop-sidebar-profile flex w-full flex-col items-center justify-center">
          <div
            className="w-10 h-10 bg-(--color-primary) rounded-full flex items-center justify-center"
            title={DEFAULT_BOUTIQUE.name}
            aria-label={DEFAULT_BOUTIQUE.name}
          >
            <span className="text-white text-[10px] font-semibold text-center">{DEFAULT_BOUTIQUE.initials}</span>
          </div>
          <span className="shop-sidebar-owner mt-2 text-center text-[11px] font-semibold leading-[1.2] text-(--color-text-primary)">
            {DEFAULT_BOUTIQUE.ownerName}
          </span>
          <button
            onClick={onClose}
            className="absolute right-2 top-3 md:hidden text-(--color-text-secondary) hover:text-(--color-text-primary)"
            title={t('shop.close')}
            aria-label={t('shop.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 w-full">
          <ul className="space-y-0">
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`shop-sidebar-nav-item w-full flex flex-col items-center gap-1 py-3 px-1 transition-colors ${
                      isActive
                        ? 'text-(--color-primary) bg-(--color-primary-lightest)'
                        : 'text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-hover)'
                    }`}
                    title={item.label}
                  >
                    <span className={isActive ? 'text-(--color-primary)' : ''}>
                      {item.icon}
                    </span>
                    <span className="text-2xs text-center font-medium break-words max-w-[74px] leading-tight">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          className="shop-sidebar-logout w-full flex flex-col items-center gap-2 py-3 px-2 text-(--color-text-secondary) hover:text-(--color-error) hover:bg-red-50 transition-colors"
          title={t('shop.logout')}
          aria-label={t('shop.logout')}
        >
          <LogOut size={20} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
