import { Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { useLanguage } from '@/core/i18n';
import { useFavorites } from '@/providers/FavoritesProvider';
import { runtimeConfig } from '@/config/runtime';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { items, removeFavorite } = useFavorites();
  const formatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: runtimeConfig.currency,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">{t('favorites.title')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('favorites.count', { value: String(items.length) })}</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <Heart className="mx-auto text-slate-300" size={44} aria-hidden="true" />
            <h2 className="mt-5 text-xl font-semibold text-slate-900">{t('favorites.empty')}</h2>
            <button className="mt-6 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white" onClick={() => navigate('/products')}>
              {t('favorites.discover')}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <button className="block w-full text-left" onClick={() => navigate(item.href)}>
                  <img src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="p-4">
                    <h2 className="font-bold text-slate-900">{item.name}</h2>
                    <p className="mt-2 font-bold text-teal-700">{formatter.format(item.price)}</p>
                  </div>
                </button>
                <button
                  className="mx-4 mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
                  onClick={() => removeFavorite(item.id)}
                  aria-label={`${t('favorites.remove')} ${item.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  {t('favorites.remove')}
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
