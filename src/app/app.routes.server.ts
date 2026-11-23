import { RenderMode, ServerRoute } from '@angular/ssr';
import { runtimeConfig } from '@/config/runtime';

const productRenderMode = runtimeConfig.enableApiMocks ? RenderMode.Client : RenderMode.Server;

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products/:productId',
    renderMode: productRenderMode,
  },
  {
    path: 'catalog/product/:productId',
    renderMode: productRenderMode,
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'catalog',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'outfits/:outfitId',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ outfitId: 'femme' }, { outfitId: 'homme' }];
    },
  },
  {
    path: 'best-sellers/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ slug: 'elegance-streetwear' }, { slug: 'robe-porte-feuille' }, { slug: 'caftan-luxe' }];
    },
  },
  { path: 'cart', renderMode: RenderMode.Client },
  { path: 'favorites', renderMode: RenderMode.Client },
  { path: 'auth/login', renderMode: RenderMode.Client },
  { path: 'auth/register', renderMode: RenderMode.Client },
  { path: 'auth/register/boutique', renderMode: RenderMode.Client },
  { path: 'forgot-password', renderMode: RenderMode.Client },
  { path: 'forbidden', renderMode: RenderMode.Client },
  { path: 'session-unavailable', renderMode: RenderMode.Client },
  { path: 'catalog/search', renderMode: RenderMode.Client },
  { path: 'product/:productId', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'shop', renderMode: RenderMode.Client },
  { path: 'shop/**', renderMode: RenderMode.Client },
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'ventes', renderMode: RenderMode.Client },
  runtimeConfig.enableApiMocks
    ? { path: '**', renderMode: RenderMode.Client }
    : { path: '**', renderMode: RenderMode.Server },
];
