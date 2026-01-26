import React from 'react';
import { KukuzaLogo } from '../common/KukuzaLogo';
import { Link } from 'react-router-dom';
import HomeIcon from '../icons/HomeIcon';

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      {/* Home Button */}
      <Link to="/" className="home-button">
        <HomeIcon />
        <span className="hidden sm:inline">Accueil</span>
      </Link>

      {/* Decorative Kukuza logo placed on the left side of the layout - hidden on mobile */}
      <div className="kukuza-logo hidden md:block" aria-hidden>
        <KukuzaLogo className="kukuza-logo-inner" />
      </div>

      <div className="auth-form-container">
        {children}
      </div>
    </div>
  );
};