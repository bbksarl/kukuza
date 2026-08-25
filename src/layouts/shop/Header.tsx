import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import logo from '@/assets/shop/logo.png';
import { useLanguage } from '@/core/i18n';
import { DEFAULT_BOUTIQUE } from '@/features/shop/data/defaultBoutique';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = DEFAULT_BOUTIQUE.ownerName,
  userEmail = DEFAULT_BOUTIQUE.ownerName,
  notificationCount = 0,
  onMenuClick = () => {}
}) => {
  const { t, language, setLanguage } = useLanguage();
  return (
    <header className="shop-dashboard-header sticky top-0 h-[74px] bg-white border-b border-(--color-border) flex items-center justify-between px-4 md:px-7 z-40 gap-4">
      {/* Menu Button for Mobile */}
      <button 
        onClick={onMenuClick}
        className="md:hidden icon-btn"
        title={t('shop.menu')}
        aria-label={t('shop.menu')}
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div className="shop-header-logo flex items-center flex-shrink-0">
        <img 
          src={logo} 
          alt="KUKUZA" 
          className="h-7 md:h-8 w-auto object-contain"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden sm:block" />

      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <button className="icon-btn relative" title={t('shop.notifications')} aria-label={t('shop.notifications')}>
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-(--color-error) text-white text-2xs font-semibold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
          className="hidden lg:block rounded-md border border-(--color-border) bg-white px-2 py-1 text-xs font-semibold text-(--color-text-secondary)"
          aria-label={t('language.choose')}
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>

        {/* User Profile - Hidden on mobile, visible on sm+ */}
        <button className="hidden sm:flex items-center gap-3 hover:bg-(--color-surface-hover) rounded-lg px-3 py-2 transition-colors">
          <div className="w-8 md:w-10 h-8 md:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-(--color-text-secondary)" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs md:text-sm font-semibold text-(--color-text-primary) truncate">
              {userName}
            </div>
            <div className="text-2xs text-(--color-text-secondary) truncate">
              {userEmail}
            </div>
          </div>
        </button>

        {/* User Profile Icon Only - Visible on mobile */}
        <button className="sm:hidden icon-btn">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} className="text-(--color-text-secondary)" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
