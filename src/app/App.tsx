import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from '@/features/portal/pages/Home';
import ProductsList from '@/features/portal/pages/ProductsList';
import BestSellerDetail from '@/features/portal/pages/BestSellerDetail';
import OutfitDetail from '@/features/portal/pages/OutfitDetail';
import PortalProductDetail from '@/features/portal/pages/ProductDetail';
import CartPage from '@/features/portal/pages/CartPage';
import FavoritesPage from '@/features/portal/pages/FavoritesPage';
import AdminRoute from '@/features/admin/components/AdminRoute';
import ShopRoute from '@/features/shop/components/ShopRoute';
import { useLanguage } from '@/core/i18n';

const LoginPage = lazy(() =>
  import('@/features/auth/views/Login').then(({ LoginPage: Page }) => ({ default: Page }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth/views/Register').then(({ RegisterPage: Page }) => ({ default: Page }))
);
const ProductBrowser = lazy(() => import('@/features/catalog/pages/ProductBrowser'));
const ProductDetail = lazy(() => import('@/features/catalog/pages/ProductDetail'));
const CatalogSearch = lazy(() => import('@/features/catalog/pages/Search'));
const DashboardPage = lazy(() => import('@/features/shop/pages/Dashboard'));
const SalesPage = lazy(() => import('@/features/shop/pages/Sales'));
const ProductsPage = lazy(() => import('@/features/shop/pages/Products'));
const AddProductPage = lazy(() => import('@/features/shop/pages/AddProduct'));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const AdminShopsPage = lazy(() => import('@/features/admin/pages/AdminResources').then((module) => ({ default: module.AdminShopsPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminResources').then((module) => ({ default: module.AdminUsersPage })));
const AdminProductsPage = lazy(() => import('@/features/admin/pages/AdminResources').then((module) => ({ default: module.AdminProductsPage })));
const AdminSalesPage = lazy(() => import('@/features/admin/pages/AdminResources').then((module) => ({ default: module.AdminSalesPage })));

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[kukuza] render error', { error, componentStack: info.componentStack });
  }

  render() {
    return this.state.hasError ? <RouteErrorFallback /> : this.props.children;
  }
}

function RouteErrorFallback() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">{t('app.errorTitle')}</h1>
        <p className="mt-3 text-slate-600">{t('app.errorMessage')}</p>
        <a className="mt-6 inline-flex rounded-full bg-teal-700 px-5 py-2.5 font-semibold text-white" href="/">
          {t('app.backHome')}
        </a>
      </div>
    </main>
  );
}

function LoadingFallback() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-[50vh] items-center justify-center text-sm text-slate-600" aria-live="polite">
      {t('app.loading')}
    </main>
  );
}

function RouteBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

function ProductAliasRedirect() {
  const { productId } = useParams<{ productId: string }>();
  return <Navigate to={productId ? `/products/${productId}` : '/products'} replace />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:productId" element={<PortalProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/outfits/:outfitId" element={<OutfitDetail />} />
          <Route path="/best-sellers/:slug" element={<BestSellerDetail />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/register/boutique" element={<Navigate to="/auth/register" replace />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/auth/login" replace />} />

          <Route path="/catalog" element={<ProductBrowser />} />
          <Route path="/catalog/product/:productId" element={<ProductDetail />} />
          <Route path="/catalog/search" element={<CatalogSearch />} />
          <Route path="/product/:productId" element={<ProductAliasRedirect />} />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/shops" element={<AdminRoute><AdminShopsPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/sales" element={<AdminRoute><AdminSalesPage /></AdminRoute>} />

          <Route path="/shop" element={<Navigate to="/shop/dashboard" replace />} />
          <Route path="/shop/dashboard" element={<ShopRoute><DashboardPage /></ShopRoute>} />
          <Route path="/shop/ventes" element={<ShopRoute><SalesPage /></ShopRoute>} />
          <Route path="/shop/produits" element={<ShopRoute><ProductsPage /></ShopRoute>} />
          <Route path="/shop/produits/ajouter" element={<ShopRoute><AddProductPage /></ShopRoute>} />
          <Route path="/dashboard" element={<Navigate to="/shop/dashboard" replace />} />
          <Route path="/ventes" element={<Navigate to="/shop/ventes" replace />} />

          <Route path="/forbidden" element={<RouteErrorFallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouteBoundary>
    </BrowserRouter>
  );
}

export { AppErrorBoundary, RouteErrorFallback };
