import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function InspirationSection() {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section 
      ref={sectionRef}
      className={`inspiration-section bg-white py-20 max-lg:py-16 max-md:py-14 max-sm:py-12 max-[480px]:py-10 ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="max-w-[1400px] mx-auto px-10 max-lg:px-7 max-md:px-5 max-sm:px-4 grid grid-cols-2 max-md:grid-cols-1 gap-20 max-lg:gap-[60px] max-md:gap-9 max-sm:gap-8 max-[480px]:gap-7 items-center">
        <div className={`inspiration-image flex justify-center items-center ${isVisible ? 'fade-in-left' : ''}`}>
          <img 
            src="/assets/inspiration/im.png" 
            alt="Fashion Inspiration" 
            className="w-full max-w-[540px] h-auto rounded-3xl max-md:rounded-[20px] max-sm:rounded-2xl object-cover"
          />
        </div>
        <div 
          className={`inspiration-content flex flex-col justify-center items-center text-center px-5 max-md:px-3 ${isVisible ? 'fade-in-right' : ''}`} 
          style={{ animationDelay: '200ms' }}
        >
          <h2 
            className={`text-[2.5rem] max-lg:text-[2.1rem] max-md:text-[1.85rem] max-sm:text-[1.65rem] max-[480px]:text-2xl font-bold mb-[30px] max-md:mb-6 max-sm:mb-5 text-black leading-[1.2] tracking-[0.02em] ${isVisible ? 'reveal-text' : ''}`} 
            style={{ animationDelay: '300ms' }}
          >
            INSPIREZ-VOUS DE NOS OUTFITS
          </h2>
          <p 
            className={`text-lg max-lg:text-[1.05rem] max-md:text-[0.98rem] max-sm:text-[0.92rem] max-[480px]:text-sm leading-[1.8] max-md:leading-[1.7] mb-10 max-md:mb-8 max-sm:mb-7 max-[480px]:mb-6 text-gray-500 max-w-[560px] ${isVisible ? 'fade-in-up' : ''}`} 
            style={{ animationDelay: '500ms' }}
          >
            Plongez au cœur de notre univers créatif. Entre lignes
            architecturales et matières d'exception, découvrez les
            silhouettes qui inspirent nos collections. Une ode à la
            simplicité radicale et à l'élégance intemporelle
          </p>
          <button 
            className={`inspiration-button inline-block py-4 max-lg:py-[15px] max-md:py-[14px] max-sm:py-[13px] max-[480px]:py-3 px-12 max-lg:px-11 max-md:px-[38px] max-sm:px-[34px] max-[480px]:px-[30px] bg-transparent text-[#057055] rounded-xl border-2 border-[#057055] font-semibold text-lg max-lg:text-[1.05rem] max-md:text-base max-sm:text-[0.95rem] max-[480px]:text-[0.9rem] min-w-[200px] max-sm:min-w-[180px] max-[480px]:min-w-[160px] cursor-pointer hover:bg-[#057055] hover:text-white ${isVisible ? 'scale-in-bounce' : ''}`} 
            style={{ animationDelay: '700ms' }}
          >
            Découvrir
          </button>
        </div>
      </div>
    </section>
  );
}