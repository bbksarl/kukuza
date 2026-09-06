import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { CatalogCategory } from '@/types';
import { useLanguage } from '@/core/i18n';
import { useNavigate } from 'react-router-dom';

export default function Banner({ showCategories = true, logoSrc = '/assets/logo.png' }) {
  const { categories } = useCategories();
  const { t, translateCatalogLabel } = useLanguage();
  const navigate = useNavigate();

  return (
    <section
      className="relative block h-[86vh] min-h-[520px] w-full overflow-hidden pt-[72px] sm:h-[90vh] md:h-screen"
      role="banner"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/MEET.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/45 sm:bg-black/40" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-[42rem] flex-col items-center gap-3 text-center text-white">
          <img
            src={logoSrc}
            alt="KUKUZA"
            className="h-20 w-auto sm:h-28 md:h-32 drop-shadow-lg"
          />

          <p className="w-full max-w-[42rem] px-4 text-sm font-medium leading-relaxed text-white/90 sm:text-base">
            {t('hero.tagline')}
          </p>

          <a
            href="#about"
            className="text-sm font-semibold uppercase tracking-wide text-white hover:text-teal-50"
            aria-label={t('hero.about')}
          >
            {t('hero.about')}
          </a>

          <a
            href="#shop"
            className="rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
          >
            {t('hero.registerShop')}
          </a>
        </div>
      </div>

      {showCategories && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
          <div className="pointer-events-auto flex w-full max-w-[36rem] flex-nowrap justify-center gap-2 px-4">
            {categories.map((category: CatalogCategory) => (
              <button
                key={category.id}
                type="button"
                className="shrink-0 whitespace-nowrap rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white shadow transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
                onClick={() => navigate(`/products?gender=${encodeURIComponent(category.name)}`)}
              >
                {translateCatalogLabel(category.name)}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
