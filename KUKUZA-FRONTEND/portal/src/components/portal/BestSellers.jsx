import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useBestSellers } from '../../hooks/useBestSellers';

/**
 * BestSellers component displays a grid of best-selling products with scroll animations
 * @returns {JSX.Element} The BestSellers section
 */
export default function BestSellers() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const { bestSellers, loading, error } = useBestSellers();

  if (loading) {
    return (
      <section className="py-16 px-6 bestsellers-gradient-bg">
        <div className="text-center py-8">Loading best sellers...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bestsellers-gradient-bg">
        <div className="text-center py-8 text-red-500">Error loading best sellers: {error}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`py-16 px-6 bestsellers-gradient-bg
                 lg:min-h-screen lg:flex lg:items-center lg:justify-center
                 max-[1024px]:py-12 max-[1024px]:px-5
                 max-[768px]:py-10 max-[768px]:px-4
                 max-[480px]:py-8 max-[480px]:px-3
                 ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <h2 
          className={`font-display text-[48px] font-black text-center text-[#111827] 
                     tracking-[2px] mt-[50px] mb-[100px] uppercase
                     max-[1024px]:text-[38px] max-[1024px]:-mt-5 max-[1024px]:mb-[90px] max-[1024px]:tracking-[1.5px]
                     max-[768px]:text-[32px] max-[768px]:-mt-5 max-[768px]:mb-20 max-[768px]:tracking-[1px]
                     max-[480px]:text-[26px] max-[480px]:-mt-5 max-[480px]:mb-[70px] max-[480px]:tracking-[0.5px]
                     ${isVisible ? 'fade-in-down' : ''}`}
        >
          <strong>LES MEILLEURES VENTES</strong>
        </h2>

        <div className="flex justify-center items-center gap-6 flex-wrap
                       max-[1024px]:gap-5
                       max-[768px]:flex-row max-[768px]:gap-4 max-[768px]:items-start max-[768px]:overflow-x-auto 
                       max-[768px]:px-3 max-[768px]:-webkit-overflow-scrolling-touch max-[768px]:snap-x max-[768px]:snap-mandatory 
                       max-[768px]:scroll-px-3 max-[768px]:bestseller-scrollbar">
          {bestSellers.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl cursor-pointer 
                         transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                         shadow-[0_4px_16px_rgba(0,0,0,0.08)] shrink-0
                         hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]
                         ${item.featured 
                           ? 'w-[440px] h-[660px] z-[2] max-[1024px]:w-[360px] max-[1024px]:h-[540px] max-[768px]:flex-[0_0_92%] max-[768px]:min-w-[340px] max-[768px]:max-w-[520px] max-[768px]:h-auto max-[768px]:rounded-xl max-[480px]:flex-[0_0_96%]' 
                           : 'w-[340px] h-[460px] max-[1024px]:w-[300px] max-[1024px]:h-[410px] max-[768px]:flex-[0_0_85%] max-[768px]:min-w-[300px] max-[768px]:max-w-[520px] max-[768px]:h-auto max-[768px]:rounded-xl max-[480px]:flex-[0_0_92%] max-[480px]:min-w-[280px]'}
                         max-[768px]:snap-center
                         ${isVisible ? 'scale-in' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`absolute inset-0 w-full h-full block object-cover object-center
                           transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                           group-hover:scale-[1.12]
                           ${!item.featured ? 'object-[top_center] scale-[1.06]' : ''}
                           max-[768px]:relative max-[768px]:inset-auto max-[768px]:w-full max-[768px]:h-auto 
                           max-[768px]:aspect-[3/4] max-[768px]:scale-[1.02] max-[768px]:rounded-xl`}
              />
              <div 
                className={`absolute inset-0 bestseller-overlay-gradient 
                           flex items-end justify-center p-8 opacity-0 
                           transition-opacity duration-[400ms] ease-out
                           hover:opacity-100
                           max-[768px]:opacity-100 max-[768px]:bestseller-overlay-gradient-mobile`}
              >
                <button 
                  className="py-3 px-7 bg-white/95 text-[#111827] border-none rounded-lg 
                           text-sm font-semibold cursor-pointer uppercase tracking-[0.5px]
                           shadow-[0_4px_12px_rgba(0,0,0,0.15)] translate-y-5
                           transition-[transform,background,box-shadow] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                           hover:bg-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5
                           active:translate-y-0
                           max-[768px]:translate-y-0 max-[768px]:text-[13px] max-[768px]:py-2.5 max-[768px]:px-6
                           max-[480px]:text-xs max-[480px]:py-2 max-[480px]:px-5"
                  style={{
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  Voir le produit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}