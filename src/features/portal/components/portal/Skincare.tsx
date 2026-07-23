import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import './skincaresection.css';

export default function SkincareSection() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const { t } = useLanguage();

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
        aria-label={t('sections.skinCollection')}
      />

      {/* Dark overlay for better text readability */}
      <div className="skincare-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="skincare-content">
        <h2 className={`skincare-title ${isVisible ? 'reveal-text' : ''}`}>SKINCARE</h2>
        <p className={`skincare-description ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '300ms' }}>
          {t('sections.skinDescription')}
        </p>
        <button 
          className={`skincare-cta ${isVisible ? 'scale-in-bounce' : ''}`}
          style={{ animationDelay: '500ms' }}
          aria-label={t('sections.discover')}
        >
          {t('sections.discover')}
        </button>
      </div>
    </section>
  );
}
