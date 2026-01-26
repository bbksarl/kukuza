import React from 'react';
import './skincare.css';

export default function Skincare() {
  return (
    <section className="skincare-section">
      {/* Background image */}
      <div 
        className="skincare-background"
        style={{ backgroundImage: 'url(/assets/skincare/im.png)' }}
        role="img"
        aria-label="Collection de soins de luxe"
      />

      {/* Dark overlay for better text readability */}
      <div className="skincare-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="skincare-content">
        <h2 className="skincare-title">SKINCARE</h2>
        <p className="skincare-description">
          Découvrez notre collection de soins de luxe pour une routine beauté complète
        </p>
        <button className="skincare-cta" aria-label="Découvrir la collection Skincare">
          Découvrir
        </button>
      </div>
    </section>
  );
}