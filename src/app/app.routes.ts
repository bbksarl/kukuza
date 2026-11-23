import { Routes } from '@angular/router';
import { roleGuard } from './core/role.guard';
const storefront = () =>
  import('./storefront/storefront-shell.component').then((module) => module.StorefrontShellComponent);
const privateShell = () =>
  import('./shared/ui/private-shell.component').then((module) => module.PrivateShellComponent);

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () => import('./storefront/home.component').then((module) => module.HomeComponent),
      },
    ],
  },
  {
    path: 'products',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./storefront/products.component').then((module) => module.ProductsComponent),
      },
      {
        path: ':productId',
        loadComponent: () =>
          import('./storefront/product-detail.component').then((module) => module.ProductDetailComponent),
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () => import('./storefront/cart.component').then((module) => module.CartComponent),
      },
    ],
  },
  {
    path: 'favorites',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./storefront/favorites.component').then((module) => module.FavoritesComponent),
      },
    ],
  },
  {
    path: 'outfits/:outfitId',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () => import('./storefront/outfit.component').then((module) => module.OutfitComponent),
      },
    ],
  },
  {
    path: 'best-sellers/:slug',
    loadComponent: storefront,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./storefront/product-detail.component').then((module) => module.ProductDetailComponent),
        data: { bestSeller: true },
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login.component').then((module) => module.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register.component').then((module) => module.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password.component').then((module) => module.ForgotPasswordComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/ui/status-pages.component').then((module) => module.ForbiddenComponent),
  },
  {
    path: 'session-unavailable',
    loadComponent: () =>
      import('./shared/ui/status-pages.component').then((module) => module.SessionUnavailableComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/ui/status-pages.component').then((module) => module.NotFoundComponent),
  },
  { path: 'auth/register/boutique', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  {
    path: 'catalog',
    loadComponent: () => import('./storefront/products.component').then((module) => module.ProductsComponent),
    data: { catalog: true },
  },
  {
    path: 'catalog/product/:productId',
    loadComponent: () =>
      import('./storefront/product-detail.component').then((module) => module.ProductDetailComponent),
    data: { catalog: true },
  },
  {
    path: 'catalog/search',
    loadComponent: () => import('./storefront/products.component').then((module) => module.ProductsComponent),
    data: { catalog: true, search: true },
  },
  { path: 'product/:productId', redirectTo: 'products/:productId' },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    loadComponent: privateShell,
    data: { admin: true },
    canMatch: [roleGuard(['admin'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/admin-dashboard.component').then((module) => module.AdminDashboardComponent),
      },
      {
        path: 'shops',
        loadComponent: () =>
          import('./admin/admin-resource.component').then((module) => module.AdminResourceComponent),
        data: { section: 'shops' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/admin-resource.component').then((module) => module.AdminResourceComponent),
        data: { section: 'users' },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/admin-resource.component').then((module) => module.AdminResourceComponent),
        data: { section: 'products' },
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./admin/admin-sales.component').then((module) => module.AdminSalesComponent),
      },
    ],
  },
  { path: 'shop', redirectTo: 'shop/dashboard', pathMatch: 'full' },
  {
    path: 'shop',
    loadComponent: privateShell,
    canMatch: [roleGuard(['creator', 'admin'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./studio/studio-dashboard.component').then((module) => module.StudioDashboardComponent),
      },
      {
        path: 'ventes',
        loadComponent: () =>
          import('./studio/studio-sales.component').then((module) => module.StudioSalesComponent),
      },
      {
        path: 'produits',
        loadComponent: () =>
          import('./studio/studio-products.component').then((module) => module.StudioProductsComponent),
      },
      {
        path: 'produits/ajouter',
        loadComponent: () =>
          import('./studio/add-studio-product.component').then((module) => module.AddStudioProductComponent),
      },
    ],
  },
  { path: 'dashboard', redirectTo: 'shop/dashboard', pathMatch: 'full' },
  { path: 'ventes', redirectTo: 'shop/ventes', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/ui/status-pages.component').then((module) => module.NotFoundComponent),
  },
];
