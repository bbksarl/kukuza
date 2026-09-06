import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { useLanguage } from '@/core/i18n';
import { getOutfitById } from '../data/outfits';
import Seo from '@/components/seo/Seo';

type OutfitRouteState = {
  imageIndex?: number;
};

export default function OutfitDetail() {
  const { outfitId } = useParams<{ outfitId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const outfit = getOutfitById(outfitId);
  const routeState = (location.state as OutfitRouteState | null) ?? null;
  const initialImage = Math.min(Math.max(routeState?.imageIndex ?? 0, 0), 2);
  const [selectedImage, setSelectedImage] = useState(initialImage);

  useEffect(() => {
    setSelectedImage(initialImage);
  }, [initialImage, outfitId]);

  if (!outfit) {
    return <Navigate to="/" replace />;
  }

  const goToImage = (direction: -1 | 1) => {
    setSelectedImage((current) => (current + direction + outfit.images.length) % outfit.images.length);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Seo
        title={`${t(outfit.titleKey)} | KUKUZA`}
        description={t(outfit.descriptionKey)}
        path={`/outfits/${outfit.id}`}
        image={outfit.images[0].src}
      />
      <Header />
      <main className="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            className="mb-6 inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t('product.back')}
          </button>

          <section className="grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            <div className="relative bg-slate-100 p-3 sm:p-5">
              <div className="relative h-[min(72vh,720px)] min-h-[420px] overflow-hidden rounded-2xl bg-slate-200">
                <img
                  src={outfit.images[selectedImage].src}
                  alt={t(outfit.images[selectedImage].altKey)}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute left-4 top-1/2 rounded-full bg-white/90 p-3 text-slate-900 shadow-lg transition hover:bg-white"
                  onClick={() => goToImage(-1)}
                  aria-label={t('outfit.previousImage')}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 rounded-full bg-white/90 p-3 text-slate-900 shadow-lg transition hover:bg-white"
                  onClick={() => goToImage(1)}
                  aria-label={t('outfit.nextImage')}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3" role="region" aria-label={t('outfit.gallery')}>
                {outfit.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`h-24 overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:h-32 ${selectedImage === index ? 'border-teal-700' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={t('sections.goToLook', { value: index + 1 })}
                    aria-pressed={selectedImage === index}
                  >
                    <img src={image.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t('sections.outfitTitle')}</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{t(outfit.titleKey)}</h1>
              <p className="mt-6 text-base leading-7 text-slate-600">{t(outfit.descriptionKey)}</p>

              <div className="mt-9 border-t border-slate-200 pt-7">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">{t('outfit.details')}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">{t('outfit.detailsHint')}</p>
                <ul className="mt-5 space-y-3">
                  {outfit.images.map((image) => (
                    <li key={image.src} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                      <span className="h-2 w-2 rounded-full bg-teal-700" aria-hidden="true" />
                      {t(image.altKey)}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                onClick={() => navigate('/')}
              >
                {t('outfit.backHome')}
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
