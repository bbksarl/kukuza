import React from 'react';
import { useCreators } from '../../hooks/useCreators';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Boutiques(){
  const { creators, loading, error } = useCreators();
  const [sectionRef, isVisible] = useScrollAnimation();

  const logos = creators.map(creator => creator.profile_image_url || '/assets/logo.png');

  if (loading) {
    return (
      <section className="py-8 px-5 text-center bg-portal-bg">
        <div className="text-center py-8">Loading boutiques...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-5 text-center bg-portal-bg">
        <div className="text-center py-8 text-red-500">Error loading boutiques: {error}</div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`py-8 px-5 text-center bg-portal-bg ${isVisible ? 'fade-in-up' : ''}`}
    >
      <div className="relative overflow-hidden w-full boutiques-mask" role="region" aria-label="Carousel des boutiques">
        <div className="flex gap-5 items-center w-fit animate-marquee
                        max-[1280px]:animate-marquee-tablet 
                        max-[1024px]:animate-marquee-mobile 
                        max-[768px]:animate-marquee-sm 
                        max-[640px]:animate-marquee-xs 
                        max-[1024px]:gap-[18px] 
                        max-[768px]:gap-4 
                        max-[640px]:gap-3.5 
                        max-[480px]:gap-3">
          {logos.map((src, idx) => (
            <div 
              key={idx} 
              className="flex-none w-[180px] flex items-center justify-center p-4 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:w-40 md:p-3.5 sm:w-[140px] sm:p-3 xs:w-[120px] xs:p-2.5 max-[480px]:w-[100px] max-[480px]:p-2"
            >
              <img 
                src={src} 
                alt={`Logo boutique ${idx + 1}`}
                className="max-h-[60px] max-w-full object-contain grayscale-[20%] transition-[filter] duration-300 ease-in-out hover:grayscale-0 md:max-h-[54px] sm:max-h-12 xs:max-h-10 max-[480px]:max-h-9"
              />
            </div>
          ))}
          {logos.map((src, idx) => (
            <div 
              key={`clone-${idx}`} 
              className="flex-none w-[180px] flex items-center justify-center p-4 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:w-40 md:p-3.5 sm:w-[140px] sm:p-3 xs:w-[120px] xs:p-2.5 max-[480px]:w-[100px] max-[480px]:p-2"
              aria-hidden="true"
            >
              <img 
                src={src} 
                alt=""
                className="max-h-[60px] max-w-full object-contain grayscale-[20%] transition-[filter] duration-300 ease-in-out hover:grayscale-0 md:max-h-[54px] sm:max-h-12 xs:max-h-10 max-[480px]:max-h-9"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}