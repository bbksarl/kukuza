import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { useLanguage } from '@/core/i18n';
import { useCart } from '@/providers/CartProvider';

export default function CartPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { items, totalQuantity, totalPrice, changeQuantity, removeItem, clearCart } = useCart();
  const [isPaid, setIsPaid] = useState(false);

  const priceFormatter = useMemo(
    () => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }),
    [language],
  );

  const handlePayment = () => {
    clearCart();
    setIsPaid(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Header />
      <main className="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            className="mb-6 inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t('product.back')}
          </button>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">KUKUZA</p>
              <h1 className="font-display mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{t('cart.title')}</h1>
            </div>
            {!isPaid && <p className="text-sm text-slate-500">{t('cart.itemCount', { value: totalQuantity })}</p>}
          </div>

          {isPaid ? (
            <section className="rounded-3xl border border-teal-700/15 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
              <CheckCircle2 className="mx-auto text-teal-700" size={52} aria-hidden="true" />
              <h2 className="font-display mt-5 text-2xl font-bold text-slate-900">{t('cart.paymentSuccess')}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{t('cart.paymentSuccessHint')}</p>
              <button
                type="button"
                className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                onClick={() => navigate('/products')}
              >
                {t('cart.continueShopping')}
              </button>
            </section>
          ) : items.length === 0 ? (
            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
              <ShoppingBag className="mx-auto text-slate-300" size={52} aria-hidden="true" />
              <h2 className="font-display mt-5 text-2xl font-bold text-slate-900">{t('cart.empty')}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">{t('cart.emptyHint')}</p>
              <button
                type="button"
                className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                onClick={() => navigate('/products')}
              >
                {t('cart.continueShopping')}
              </button>
            </section>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label={t('cart.title')}>
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <article key={item.id} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      <img
                        src={item.image || '/assets/logo.png'}
                        alt={item.name}
                        width="112"
                        height="140"
                        className="h-28 w-24 shrink-0 rounded-2xl bg-slate-100 object-cover sm:h-36 sm:w-28"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{item.name}</h2>
                            {(item.size || item.color) && (
                              <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                                {item.size && <p>{t('cart.size')}: {item.size}</p>}
                                {item.color && <p>{t('cart.color')}: {item.color}</p>}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`${t('cart.remove')} ${item.name}`}
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={17} aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-slate-200">
                            <button
                              type="button"
                              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                              aria-label={t('cart.decreaseQuantity')}
                              onClick={() => changeQuantity(item.id, -1)}
                            >
                              <Minus size={15} aria-hidden="true" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                            <button
                              type="button"
                              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                              aria-label={t('cart.increaseQuantity')}
                              onClick={() => changeQuantity(item.id, 1)}
                            >
                              <Plus size={15} aria-hidden="true" />
                            </button>
                          </div>
                          <p className="text-base font-bold text-teal-700">{priceFormatter.format(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-xl font-bold text-slate-900">{t('cart.summary')}</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{t('cart.subtotal')}</dt>
                    <dd className="font-semibold text-slate-900">{priceFormatter.format(totalPrice)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{t('cart.shipping')}</dt>
                    <dd className="text-right text-xs font-semibold text-slate-500">{t('cart.shippingAtPayment')}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-base">
                    <dt className="font-bold text-slate-900">{t('cart.total')}</dt>
                    <dd className="font-bold text-teal-700">{priceFormatter.format(totalPrice)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                  onClick={handlePayment}
                >
                  {t('cart.pay')}
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

