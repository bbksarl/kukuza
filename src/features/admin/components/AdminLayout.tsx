import { useEffect, useState } from 'react';
import { BarChart3, Boxes, Building2, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/core/i18n';

const developmentAdminEmail = import.meta.env.VITE_DEFAULT_ADMIN_EMAIL ?? 'Compte administrateur local';
import { useAuth } from '@/features/auth/hooks/useAuth';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const navigation = [
  { path: '/admin/dashboard', labelKey: 'admin.navigation.overview', icon: LayoutDashboard },
  { path: '/admin/shops', labelKey: 'admin.navigation.boutiques', icon: Building2 },
  { path: '/admin/users', labelKey: 'admin.navigation.users', icon: Users },
  { path: '/admin/products', labelKey: 'admin.navigation.products', icon: Boxes },
  { path: '/admin/sales', labelKey: 'admin.navigation.sales', icon: BarChart3 },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { logout: signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const sidebar = (
    <aside className="flex h-full flex-col bg-slate-950 px-4 py-5 text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-lg shadow-teal-900/40">
          <ShieldCheck size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.18em]">KUKUZA</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300">{t('admin.console')}</p>
        </div>
      </div>

      <nav className="mt-7 flex-1 space-y-1" aria-label={t('admin.navigation.label')}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          onClick={logout}
        >
          <LogOut size={18} aria-hidden="true" />
          {t('admin.logout')}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className={`fixed inset-0 z-40 bg-slate-950/60 transition md:hidden ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebar}
      </div>

      <div className="min-h-screen md:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={t('navigation.menu')}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="hidden md:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('admin.secureArea')}</p>
              <p className="mt-1 text-sm text-slate-500">{t('admin.globalMonitoring')}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-teal-600 hover:text-teal-700"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                aria-label={t('language.choose')}
              >
                {language.toUpperCase()}
              </button>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">A</div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Admin KUKUZA</p>
                  <p className="text-xs text-slate-500">{developmentAdminEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
