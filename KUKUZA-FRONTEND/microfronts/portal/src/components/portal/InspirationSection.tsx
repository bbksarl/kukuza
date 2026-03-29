import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './inspiration.css';

export default function InspirationSection() {
  const [sectionRef, isVisible] = useScrollAnimation();

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
          <h2 className={isVisible ? 'reveal-text' : ''} style={{ animationDelay: '300ms' }}>INSPIREZ-VOUS DE NOS OUTFITS</h2>
          <p className={isVisible ? 'fade-in-up' : ''} style={{ animationDelay: '500ms' }}>
            Plongez au cœur de notre univers créatif. Entre lignes
            architecturales et matières d'exception, découvrez les
            silhouettes qui inspirent nos collections. Une ode à la
            simplicité radicale et à l'élégance intemporelle
          </p>
          <button className={`inspiration-button ${isVisible ? 'scale-in-bounce' : ''}`} style={{ animationDelay: '700ms' }}>Découvrir</button>
        </div>
      </div>
    </section>
  );
}
