import React from 'react';
import { useCreators } from '../../hooks/useCreators';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import './animations.css';

export default function Boutiques() {
  const { creators, loading, error } = useCreators();
  const [sectionRef, isVisible] = useScrollAnimation();
  const { t } = useLanguage();

  const logos: string[] = (creators || []).map(
    (creator: { profile_image_url?: string }) => creator.profile_image_url || '/assets/logo.png'
  );

  if (loading) {
    return (
      <section className="px-4 py-8 text-center">
        <div className="text-sm text-slate-600">{t('portal.loadingBoutiques')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-8 text-center">
        <div className="text-sm font-semibold text-red-500">{t('portal.errorBoutiques', { value: error })}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`bg-portal-bg px-4 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8 ${isVisible ? 'fade-in-up' : ''}`}
    >
      <div
        className="relative w-full overflow-hidden"
        role="region"
        aria-label={t('sections.boutiquesCarousel')}
        style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}
      >
        <div className="flex w-max boutiques-track items-center gap-4 sm:gap-5 md:gap-6">
          {logos.map((src: string, idx: number) => (
            <div
              key={idx}
              className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl bg-white px-4 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-20 sm:w-40 md:h-20 md:w-44"
            >
              <img
                src={src}
                alt={`Logo boutique ${idx + 1}`}
                className="max-h-12 w-auto object-contain grayscale-[20%] transition duration-300 hover:grayscale-0 sm:max-h-12 md:max-h-12"
              />
            </div>
          ))}
          {logos.map((src: string, idx: number) => (
            <div
              key={`clone-${idx}`}
              className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl bg-white px-4 shadow-md sm:h-20 sm:w-40 md:h-20 md:w-44"
              aria-hidden="true"
            >
              <img
                src={src}
                alt=""
                className="max-h-12 w-auto object-contain grayscale-[20%] sm:max-h-12 md:max-h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
