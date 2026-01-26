import React from 'react';
import logoSrc from '../../assets/logo.png';

export const KukuzaLogo = ({ className = 'w-full h-auto' }) => (
  <div className={`kukuza-logo-img ${className}`} aria-hidden="true">
    <img src={logoSrc} alt="Kukuza" style={{ width: '100%', height: 'auto', display: 'block' }} />
  </div>
);