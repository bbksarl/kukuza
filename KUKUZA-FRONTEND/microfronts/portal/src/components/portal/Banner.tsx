import React from 'react';
import { useCategories } from '../../hooks/useCategories';

export default function Banner({ showCategories = true, logoSrc = '/assets/logo.png' }) {
  const { categories } = useCategories();

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

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-white">
          <img
            src={logoSrc}
            alt="KUKUZA"
            className="h-20 w-auto sm:h-28 md:h-32 drop-shadow-lg"
          />

          <p className="max-w-2xl px-4 text-sm font-medium leading-relaxed text-white/90 sm:text-base">
            La marketplace africaine pour les créateurs et marques premium
          </p>

          <a
            href="#about"
            className="text-sm font-semibold uppercase tracking-wide text-white hover:text-teal-50"
            aria-label="A propos de KUKUZA"
          >
            À propos de KUKUZA
          </a>

          <a
            href="#shop"
            className="rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
          >
            Inscrivez votre boutique
          </a>
        </div>
      </div>

      {showCategories && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
          <div className="pointer-events-auto flex w-full max-w-xl flex-wrap justify-center gap-2 px-4">
            {categories.map((category: any) => (
              <a
                key={category.id}
                href={`#${category.name.toLowerCase()}`}
                className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white shadow hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg transition"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
