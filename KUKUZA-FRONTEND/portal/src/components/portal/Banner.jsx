import React from 'react';
import './animations.css';
import { useCategories } from '../../hooks/useCategories';

export default function Banner({ showCategories = true, logoSrc = '/assets/logo.png' }){
  const { categories } = useCategories();
  return (
    <section 
      className="h-screen block relative overflow-hidden w-full mt-0 pt-[calc(var(--portal-header-height,80px)+20px)] 
                 max-[1024px]:h-[90vh] max-[1024px]:pt-[calc(var(--portal-header-height,80px)+24px)]
                 max-[768px]:h-[86vh]
                 max-[640px]:min-h-[520px]
                 max-[480px]:h-[88vh]" 
      role="banner"
    >
      {/* Background video - muted autoplay loop playsInline for mobile */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover object-center z-0"
        src="/assets/MEET.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dark overlay over the video to improve contrast */}
      <div 
        className="absolute inset-0 bg-black/36 z-[1] pointer-events-none
                   max-[768px]:bg-black/52" 
        aria-hidden="true" 
      />

      <div 
        className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] 
                   flex flex-col items-center justify-center gap-3.5 
                   transition-[top,opacity] duration-[240ms] ease-out
                   max-[1024px]:top-[44%]
                   max-[768px]:gap-2 max-[768px]:top-[38%]
                   max-[640px]:top-[36%]
                   max-[480px]:top-[32%] max-[480px]:gap-1.5"
      >
        <img 
          src={logoSrc} 
          alt="KUKUZA" 
          className="h-[360px] max-w-[86%] w-auto object-contain logo-filter
                     max-[1024px]:h-[280px]
                     max-[768px]:h-[120px] max-[768px]:max-w-[90%]
                     max-[640px]:h-[100px]
                     max-[480px]:h-20" 
        />

        {/* Tagline */}
        <p 
          className="text-white text-center font-medium text-lg max-w-[900px] m-0 mt-2 mb-2 
                     tracking-[0.2px] text-shadow-banner opacity-100 tagline-gradient 
                     py-2.5 px-4 rounded-lg
                     max-[1024px]:text-base max-[1024px]:max-w-[700px]
                     max-[768px]:text-sm max-[768px]:mt-1 max-[768px]:mb-1.5 max-[768px]:px-4 max-[768px]:max-w-[90%]
                     max-[640px]:text-[13px] max-[640px]:mt-1 max-[640px]:mb-1.5 max-[640px]:px-3
                     max-[480px]:text-xs max-[480px]:mt-0.5 max-[480px]:mb-1 max-[480px]:py-2 max-[480px]:px-3"
        >
          La première marketplace africaine dédiée aux créateurs et marques premium
        </p>

        {/* Prominent About button about KUKUZA */}
        <a 
          href="#about" 
          className="inline-block bg-transparent text-white no-underline font-bold text-lg 
                     tracking-wide uppercase p-0 rounded-none shadow-none 
                     transition-[color,transform] duration-[120ms] ease-out mb-3
                     hover:text-[#f0fff6] hover:underline hover:-translate-y-0.5
                     max-[1024px]:text-base
                     max-[768px]:text-sm max-[768px]:mb-2
                     max-[640px]:text-[13px] max-[640px]:mb-1.5
                     max-[480px]:text-xs max-[480px]:mb-1" 
          aria-label="A propos de KUKUZA"
        >
          À PROPOS DE KUKUZA
        </a>

        <a 
          href="#shop" 
          className="inline-block py-4 px-12 bg-white text-text no-underline font-semibold 
                     text-base tracking-wider uppercase rounded-xl 
                     shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out
                     border-2 border-white
                     hover:bg-transparent hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                     max-[1024px]:py-[15px] max-[1024px]:px-[42px] max-[1024px]:text-[15px]
                     max-[768px]:py-3 max-[768px]:px-8 max-[768px]:text-sm max-[768px]:rounded-[10px]
                     max-[640px]:py-2.5 max-[640px]:px-7 max-[640px]:text-[13px]
                     max-[480px]:py-2 max-[480px]:px-6 max-[480px]:text-[11px] max-[480px]:rounded-lg"
        >
          Inscrivez votre Boutique
        </a>
      </div>

      {showCategories && (
        <div 
          className="absolute inset-0 flex items-end justify-start z-[2] 
                     video-gradient pointer-events-none pb-[100px]
                     max-[768px]:video-gradient-mobile"
        >
          <div 
            className="flex gap-2 absolute left-0 right-0 mx-auto bottom-10 
                       bg-transparent rounded-[10px] overflow-visible pointer-events-auto 
                       p-1.5 backdrop-blur-md z-[3] w-full max-w-[420px] justify-center
                       max-[1024px]:bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] max-[1024px]:gap-1.5
                       max-[768px]:flex-row max-[768px]:flex-wrap max-[768px]:w-[calc(100%-32px)] max-[768px]:bottom-[calc(env(safe-area-inset-bottom,0px)+16px)]
                       max-[640px]:flex-col max-[640px]:m-3 max-[640px]:w-[calc(100%-48px)] max-[640px]:items-center max-[640px]:bottom-[calc(env(safe-area-inset-bottom,0px)+14px)]
                       max-[480px]:bottom-[calc(env(safe-area-inset-bottom,0px)+10px)] max-[480px]:p-1 max-[480px]:gap-1"
          >
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.name.toLowerCase()}`}
                className="py-3 px-[26px] bg-white/[0.04] text-white no-underline font-semibold 
                           text-[13px] tracking-[0.8px] rounded-lg border border-white/[0.06] 
                           shadow-[0_6px_16px_rgba(0,0,0,0.25)] 
                           transition-[background,transform,box-shadow] duration-[180ms] ease-out
                           hover:category-gradient-hover hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]
                           focus:outline focus:outline-[3px] focus:outline-white/[0.12] focus:outline-offset-[3px]
                           max-[1024px]:py-[11px] max-[1024px]:px-[22px] max-[1024px]:text-xs
                           max-[768px]:py-2.5 max-[768px]:px-5 max-[768px]:text-[11px] max-[768px]:flex-[0_0_auto] max-[768px]:border-r-0
                           max-[640px]:py-3 max-[640px]:px-4 max-[640px]:text-xs max-[640px]:text-center max-[640px]:w-full max-[640px]:max-w-[360px]
                           max-[480px]:py-2.5 max-[480px]:px-4 max-[480px]:text-[11px]"
              >
                {category.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}