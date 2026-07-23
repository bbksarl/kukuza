import React, { ReactNode } from 'react';
import { KukuzaLogo } from '@/features/auth/components/common/KukuzaLogo';
import { Link } from 'react-router-dom';
import HomeIcon from '@/features/auth/components/icons/HomeIcon';
import backgroundImage from '@/assets/auth/bg.png';
import { useLanguage } from '@/core/i18n';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t, language, setLanguage } = useLanguage();
  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${backgroundImage})`,
      }}
    >
      {/* Home Button */}
      <Link to="/" className="home-button">
        <HomeIcon />
        <span className="hidden xs:inline">{t('auth.home')}</span>
      </Link>

      <label className="absolute right-4 top-4 z-10">
        <span className="sr-only">{t('language.choose')}</span>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
          className="rounded-md border border-white/30 bg-black/30 px-2 py-1 text-xs font-semibold text-white backdrop-blur"
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>
      </label>

      {/* Decorative Kukuza logo placed on the left side of the layout - hidden on mobile and small tablets */}
      <div className="kukuza-logo" aria-hidden>
        <KukuzaLogo className="kukuza-logo-inner" />
      </div>

      <div className="auth-form-container">
        {children}
      </div>
    </div>
  );
};
