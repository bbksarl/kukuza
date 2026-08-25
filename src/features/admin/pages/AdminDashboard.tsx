import { useMemo } from 'react';
import { ArrowUpRight, CircleAlert, PackageCheck, Store, UsersRound } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useAdminOverview } from '../hooks/useAdminOverview';
import { useLanguage } from '@/core/i18n';

function formatCurrency(value: number, language: 'fr' | 'en') {
  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)} F CFA`;
}

function getStatusClass(status: string) {
  if (status === 'active') return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10';
  if (status === 'pending') return 'bg-amber-50 text-amber-700 ring-amber-600/10';
  return 'bg-red-50 text-red-700 ring-red-600/10';
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useAdminOverview();
  const maxSales = useMemo(() => Math.max(...(data?.sales.map((point) => point.value) ?? [1])), [data?.sales]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500" aria-live="polite">{t('admin.loading')}</div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700" role="alert">
          <div>
            <CircleAlert className="mx-auto mb-3" size={30} aria-hidden="true" />
            {t('admin.error')}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1600px] space-y-6" id="overview">
        <section className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:flex-row sm:items-end sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">{t('admin.console')}</p>
            <h1 className="font-display mt-2 text-3xl font-bold sm:text-4xl">{t('admin.overview')}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{t('admin.subtitle')}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
            <p className="font-semibold text-white">{t('admin.period')}</p>
            <p className="mt-1">{t('admin.last30Days')}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('admin.kpis')}>
          {data.kpis.map((kpi, index) => {
            const icons = [ArrowUpRight, Store, UsersRound, PackageCheck];
            const Icon = icons[index % icons.length];
            return (
              <article key={kpi.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-500">{t(kpi.labelKey)}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={18} aria-hidden="true" /></span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{kpi.value}</p>
                <p className={`mt-3 text-xs font-bold ${kpi.trendPositive ? 'text-emerald-600' : 'text-red-600'}`}>{kpi.trend}</p>
              </article>
            );
          })}
        </section>

        <section id="sales" className="grid scroll-mt-24 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.salesTrend')}</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-slate-950">{t('admin.revenueEvolution')}</h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">{t('admin.last30Days')}</p>
            </div>
            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4" aria-label={t('admin.salesTrend')}>
              {data.sales.map((point) => (
                <div key={point.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex h-full w-full items-end">
                    <div className="group relative w-full rounded-t-xl bg-teal-600 transition hover:bg-teal-500" style={{ height: `${Math.max(8, (point.value / maxSales) * 100)}%` }}>
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                        {formatCurrency(point.value, language)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{point.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.topProducts')}</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-slate-950">{t('admin.bestSellers')}</h2>
              </div>
              <PackageCheck className="text-teal-700" size={22} aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-4">
              {data.topProducts.slice(0, 4).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-slate-400">0{index + 1}</span>
                  <img src={product.image} alt="" className="h-11 w-11 rounded-xl bg-slate-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
                    <p className="truncate text-xs text-slate-500">{product.brand}</p>
                  </div>
                  <span className="text-xs font-bold text-teal-700">{product.unitsSold} {t('admin.sold')}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article id="boutiques" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.boutiquesOverview')}</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-slate-950">{t('admin.activeBoutiques')}</h2>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{data.boutiques.length} {t('admin.boutiques')}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {data.boutiques.map((boutique) => (
                <div key={boutique.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                  <img src={boutique.image} alt="" className="h-10 w-10 rounded-xl bg-slate-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{boutique.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {boutique.owner} · {boutique.products} {t('admin.products')}
                      {boutique.isDefault ? ` · ${t('admin.defaultBoutique')}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(boutique.revenue, language)}</p>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${getStatusClass(boutique.status)}`}>{t(`admin.status.${boutique.status}`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article id="products" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.catalogOverview')}</p>
                <h2 className="font-display mt-2 text-2xl font-bold text-slate-950">{t('admin.bestSellingProducts')}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{t('admin.unitsSold')}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {data.topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                  <img src={product.image} alt="" className="h-12 w-12 rounded-xl bg-slate-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
                    <p className="truncate text-xs text-slate-500">{product.brand} · {product.stock} {t('admin.inStock')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-teal-700">{product.unitsSold}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(product.revenue, language)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="users" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.userOverview')}</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-slate-950">{t('admin.recentUsers')}</h2>
            </div>
            <UsersRound className="text-teal-700" size={22} aria-hidden="true" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold sm:px-6">{t('admin.user')}</th>
                  <th className="px-5 py-3 font-bold sm:px-6">{t('admin.role')}</th>
                  <th className="px-5 py-3 font-bold sm:px-6">{t('admin.joinedAt')}</th>
                  <th className="px-5 py-3 text-right font-bold sm:px-6">{t('admin.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 sm:px-6">{t(`admin.role.${user.role}`)}</td>
                    <td className="px-5 py-4 text-slate-500 sm:px-6">{user.joinedAt}</td>
                    <td className="px-5 py-4 text-right sm:px-6"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${getStatusClass(user.status)}`}>{t(`admin.status.${user.status}`)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
