import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import './inspiration.css';

export default function InspirationSection() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section 
      ref={sectionRef}
      className={`inspiration-section ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="inspiration-container">
        <div className={`inspiration-image ${isVisible ? 'fade-in-left' : ''}`}>
          <img src="/assets/inspiration/im.png" alt="Fashion Inspiration" />
        </div>
        <div className={`inspiration-content ${isVisible ? 'fade-in-right' : ''}`} style={{ animationDelay: '200ms' }}>
          <h2 className={isVisible ? 'reveal-text' : ''} style={{ animationDelay: '300ms' }}>{t('sections.inspirationTitle')}</h2>
          <p className={isVisible ? 'fade-in-up' : ''} style={{ animationDelay: '500ms' }}>
            {t('sections.inspirationDescription')}
          </p>
          <button className={`inspiration-button ${isVisible ? 'scale-in-bounce' : ''}`} style={{ animationDelay: '700ms' }}>{t('sections.discover')}</button>
        </div>
      </div>
    </section>
  );
}
