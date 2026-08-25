import { useMemo, useState, type ReactNode } from 'react';
import { Check, Search, ShieldBan } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useAdminOverview } from '../hooks/useAdminOverview';
import { useLanguage } from '@/core/i18n';

function currency(value: number, language: 'fr' | 'en') {
  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)} F CFA`;
}

function statusClass(status: string) {
  if (status === 'active') return 'bg-emerald-50 text-emerald-700';
  if (status === 'pending') return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{subtitle}</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950">{title}</h1>
        </div>
        {children}
      </div>
    </AdminLayout>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
      />
    </label>
  );
}

function LoadingOrError({ loading, error }: { loading: boolean; error: Error | null }) {
  const { t } = useLanguage();
  if (loading) return <div className="rounded-2xl bg-white p-10 text-center text-slate-500">{t('admin.loading')}</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{t('admin.error')}</div>;
  return null;
}

export function AdminShopsPage() {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useAdminOverview();
  const [query, setQuery] = useState('');
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const shops = useMemo(() => (data?.boutiques ?? []).filter((shop) =>
    `${shop.name} ${shop.owner}`.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const pending = isLoading || error || !data;

  return <Page title={t('admin.navigation.boutiques')} subtitle={t('admin.pages.shopsSubtitle')}>
    {pending ? <LoadingOrError loading={isLoading} error={error} /> : <>
      <div className="flex flex-wrap items-center justify-between gap-3"><SearchBox value={query} onChange={setQuery} placeholder={t('admin.searchShops')} /><span className="text-sm font-semibold text-slate-500">{shops.length} {t('admin.boutiques')}</span></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {shops.map((shop) => {
          const status = statuses[shop.id] ?? shop.status;
          return <article key={shop.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <img src={shop.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2"><div><h2 className="font-bold text-slate-900">{shop.name}</h2><p className="text-sm text-slate-500">{shop.owner}</p></div><span className={`h-fit rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(status)}`}>{t(`admin.status.${status}`)}</span></div>
              <p className="mt-3 text-sm text-slate-600">{shop.products} {t('admin.products')} · <b>{currency(shop.revenue, language)}</b></p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStatuses((s) => ({ ...s, [shop.id]: 'active' }))} className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white"><Check size={14} />{t('admin.approve')}</button>
                <button onClick={() => setStatuses((s) => ({ ...s, [shop.id]: 'suspended' }))} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"><ShieldBan size={14} />{t('admin.suspend')}</button>
              </div>
            </div>
          </article>;
        })}
      </div>
    </>}
  </Page>;
}

export function AdminUsersPage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useAdminOverview();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const users = useMemo(() => (data?.recentUsers ?? []).filter((user) =>
    (role === 'all' || user.role === role) && `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [data, query, role]);
  return <Page title={t('admin.navigation.users')} subtitle={t('admin.pages.usersSubtitle')}>
    {!data ? <LoadingOrError loading={isLoading} error={error} /> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5"><SearchBox value={query} onChange={setQuery} placeholder={t('admin.searchUsers')} /><select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-slate-200 px-4 text-sm"><option value="all">{t('admin.allRoles')}</option><option value="customer">{t('admin.role.customer')}</option><option value="creator">{t('admin.role.creator')}</option><option value="admin">{t('admin.role.admin')}</option></select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">{t('admin.user')}</th><th className="p-4">{t('admin.role')}</th><th className="p-4">{t('admin.joinedAt')}</th><th className="p-4">{t('admin.status')}</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id}><td className="p-4"><b>{user.name}</b><p className="text-xs text-slate-500">{user.email}</p></td><td className="p-4">{t(`admin.role.${user.role}`)}</td><td className="p-4 text-slate-500">{user.joinedAt}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(user.status)}`}>{t(`admin.status.${user.status}`)}</span></td></tr>)}</tbody></table></div>
    </div>}
  </Page>;
}

export function AdminProductsPage() {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useAdminOverview();
  const [query, setQuery] = useState('');
  const products = useMemo(() => (data?.topProducts ?? []).filter((product) =>
    `${product.name} ${product.brand}`.toLowerCase().includes(query.toLowerCase())), [data, query]);
  return <Page title={t('admin.navigation.products')} subtitle={t('admin.pages.productsSubtitle')}>
    {!data ? <LoadingOrError loading={isLoading} error={error} /> : <>
      <SearchBox value={query} onChange={setQuery} placeholder={t('admin.searchProducts')} />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">{t('admin.product')}</th><th className="p-4">{t('admin.brand')}</th><th className="p-4">{t('admin.stock')}</th><th className="p-4">{t('admin.unitsSold')}</th><th className="p-4">{t('admin.revenue')}</th></tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id}><td className="flex items-center gap-3 p-4"><img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover" /><b>{product.name}</b></td><td className="p-4">{product.brand}</td><td className={`p-4 font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-700'}`}>{product.stock}</td><td className="p-4">{product.unitsSold}</td><td className="p-4 font-bold text-teal-700">{currency(product.revenue, language)}</td></tr>)}</tbody></table></div></div>
    </>}
  </Page>;
}

export function AdminSalesPage() {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useAdminOverview();
  const max = Math.max(...(data?.sales.map((sale) => sale.value) ?? [1]));
  const total = data?.sales.reduce((sum, sale) => sum + sale.value, 0) ?? 0;
  return <Page title={t('admin.navigation.sales')} subtitle={t('admin.pages.salesSubtitle')}>
    {!data ? <LoadingOrError loading={isLoading} error={error} /> : <>
      <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-400">{t('admin.periodRevenue')}</p><p className="mt-2 text-3xl font-bold">{currency(total, language)}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">{t('admin.dailyAverage')}</p><p className="mt-2 text-3xl font-bold text-teal-700">{currency(total / data.sales.length, language)}</p></div></div>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">{t('admin.revenueEvolution')}</h2><div className="mt-8 flex h-72 items-end gap-3">{data.sales.map((sale) => <div key={sale.label} className="flex h-full flex-1 flex-col justify-end gap-2 text-center"><span className="text-xs font-bold text-slate-500">{currency(sale.value, language)}</span><div className="rounded-t-xl bg-teal-600" style={{ height: `${Math.max(8, sale.value / max * 100)}%` }} /><span className="text-xs font-semibold text-slate-500">{sale.label}</span></div>)}</div></article>
    </>}
  </Page>;
}
