import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './skincaresection.css';

export default function SkincareSection() {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section 
      ref={sectionRef}
      className={`skincare-section ${isVisible ? 'fade-in' : ''}`}
    >
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
        <h2 className={`skincare-title ${isVisible ? 'reveal-text' : ''}`}>SKINCARE</h2>
        <p className={`skincare-description ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '300ms' }}>
          Découvrez notre collection de soins de luxe pour une routine beauté complète
        </p>
        <button 
          className={`skincare-cta ${isVisible ? 'scale-in-bounce' : ''}`}
          style={{ animationDelay: '500ms' }}
          aria-label="Découvrir la collection Skincare"
        >
          Découvrir
        </button>
      </div>
    </section>
  );
}
