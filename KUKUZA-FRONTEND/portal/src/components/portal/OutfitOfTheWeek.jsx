import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useCarousel } from '../../hooks/useCarousel';
import './outfitoftheweek.css';

export default function OutfitOfTheWeek() {
  const [sectionRef, isVisible] = useScrollAnimation();

  const outfits = [
    {
      id: 'femme',
      title: "L'ÉLÉGANCE INTEMPORELLE",
      description: "Robe noire drapée, sophistiquée à souhait. Le détail de l'épaule et le sac taupe chic créent le look parfait pour briller en soirée.",
      images: [
        { src: '/assets/outfit/im3.png', alt: 'Sandales élégantes' },
        { src: '/assets/outfit/im2.png', alt: 'Sac à main élégant' },
        { src: '/assets/outfit/im1.png', alt: 'Femme en robe noire élégante' }
      ]
    },
    {
      id: 'homme',
      title: "STYLE ET SOPHISTICATION",
      description: "Un look masculin raffiné qui allie élégance et modernité. Des accessoires soigneusement sélectionnés pour un style impeccable.",
      images: [
        { src: '/assets/outfit/im4.png', alt: 'Sandales homme élégantes' },
        { src: '/assets/outfit/im5.png', alt: 'Sac homme élégant' },
        { src: '/assets/outfit/im6.png', alt: 'Homme en tenue élégante' }
      ]
    }
  ];

  const { currentIndex, isPaused, setIsPaused, goToSlide } = useCarousel(outfits);

  const currentOutfit = outfits[currentIndex];

  return (
    <section 
      ref={sectionRef}
      className={`outfit-section py-16 px-4 ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className={`outfit-main-title text-3xl md:text-4xl font-bold text-center mb-4 ${isVisible ? 'fade-in-down' : ''}`}>
          TENUE DE LA SEMAINE
        </h2>
        <p className={`outfit-main-description text-center text-gray-600 mb-12 max-w-3xl mx-auto ${isVisible ? 'fade-in-up' : ''}`}>
          Découvrez nos sélections hebdomadaires pour elle et pour lui
        </p>
        
        <div 
          className="outfit-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="outfit-group">
            <h3 className="outfit-group-title">
              {currentOutfit.title}
            </h3>
            <p className="outfit-group-description">
              {currentOutfit.description}
            </p>
            
            <div className={`outfit-grid ${isVisible ? 'scale-in' : ''}`}>
              <div className={`outfit-item outfit-item-1 ${isVisible ? 'fade-in-left' : ''}`} style={{ animationDelay: '200ms' }}>
                <img
                  src={currentOutfit.images[0].src}
                  alt={currentOutfit.images[0].alt}
                  className="outfit-image"
                />
              </div>
              
              <div className={`outfit-item outfit-item-2 ${isVisible ? 'scale-in-bounce' : ''}`} style={{ animationDelay: '400ms' }}>
                <img
                  src={currentOutfit.images[1].src}
                  alt={currentOutfit.images[1].alt}
                  className="outfit-image"
                />
              </div>
              
              <div className={`outfit-item outfit-item-3 ${isVisible ? 'fade-in-right' : ''}`} style={{ animationDelay: '600ms' }}>
                <img
                  src={currentOutfit.images[2].src}
                  alt={currentOutfit.images[2].alt}
                  className="outfit-image"
                />
              </div>
            </div>
          </div>

          <div className="outfit-dots">
            {outfits.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`outfit-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Aller au look ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}