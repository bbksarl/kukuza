import { FacadeClient, FacadeHttpError, type FacadeRequestOptions } from '@kukuza/facade';
import { z } from 'zod';
import { sessionUserSchema, type SessionUserDto } from './contracts/auth';
import { productSchema } from './contracts/catalog';
import { readStoredAuthUser, clearStoredSession } from '@/core/auth/sessionStorage';
import { getDevelopmentAdmin } from '@/features/auth/config/defaultAdmin';
import { getDevelopmentBoutique } from '@/features/auth/config/defaultBoutique';
import { applyProductFilters, mergeMarketplaceProducts, mockProducts } from '@/features/portal/data/catalog';
import { getMockCategories, getMockDashboardOverview, getMockProducts, getMockSales, buildMockCreatedProduct } from '@/features/shop/utils/mockData';
import { runtimeConfig } from '@/config/runtime';

const ACCOUNTS_KEY = 'kukuza-demo-accounts';
const accountsSchema = z.array(z.object({ user: sessionUserSchema, password: z.string() }));
type DemoAccount = z.infer<typeof accountsSchema>[number];
const readAccounts = (): DemoAccount[] => {
  try { return accountsSchema.parse(JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]')); }
  catch { return []; }
};
const fail = (status: number, message: string): never => {
  throw new FacadeHttpError(status, message, { message }, 'demo');
};
const currentUser = (): SessionUserDto => {
  const result = sessionUserSchema.safeParse(readStoredAuthUser());
  return result.success ? result.data : fail(401, 'Connectez-vous pour continuer.');
};
const categories = [...new Set(mockProducts.map((product) => product.category))]
  .map((name, index) => ({ id: index + 1, name }));
const brands = [...new Set(mockProducts.map((product) => product.brand))]
  .map((name, index) => ({ id: index + 1, name, profileImageUrl: `/assets/boutiques/shop${index % 6 + 1}.png` }));
const catalog = () => mergeMarketplaceProducts(mockProducts).map((product) => {
  const brand = brands.find((item) => item.name === product.brand)
    ?? { id: 900001, name: product.brand };
  return productSchema.parse({
    ...product,
    id: Number(String(product.id).replace(/^product-/, '')),
    imageUrl: product.image_url,
    brand,
    brandId: brand.id,
    categoryId: categories.find((item) => item.name === product.category)?.id,
  });
});

/** Simule les endpoints en mémoire/stockage navigateur, sans aucun fetch. */
export class DemoFacadeClient extends FacadeClient {
  override async request<T>(path: string, options: FacadeRequestOptions = {}): Promise<T> {
    options.signal?.throwIfAborted();
    if (/^https?:\/\//i.test(path)) throw new Error('Le mode démo attend un endpoint relatif.');
    const url = new URL(path, 'https://demo.invalid');
    const method = options.method?.toUpperCase() ?? 'GET';
    const body = options.body as Record<string, unknown> | undefined;
    let result: unknown;

    if (url.pathname === '/Auth/me') {
      result = currentUser();
    } else if (url.pathname === '/Auth/logout') {
      clearStoredSession();
    } else if (url.pathname === '/Auth/login') {
      const username = String(body?.username ?? '').trim().toLowerCase();
      const password = String(body?.password ?? '');
      const preset = getDevelopmentAdmin(username, password) ?? getDevelopmentBoutique(username, password);
      const registered = readAccounts().find((account) => account.password === password
        && [account.user.email.toLowerCase(), account.user.username.toLowerCase()].includes(username));
      result = { user: preset?.user.toJSON() ?? registered?.user ?? fail(401, 'Identifiants incorrects.') };
    } else if (url.pathname === '/Auth/register' && options.body instanceof FormData) {
      const form = options.body;
      const email = String(form.get('email') ?? '').trim().toLowerCase();
      const accounts = readAccounts();
      if (accounts.some((account) => account.user.email === email)) fail(409, 'Ce compte démo existe déjà.');
      const user = sessionUserSchema.parse({
        id: Date.now(), username: form.get('username'), email,
        role: form.get('role'), createdAt: new Date().toISOString(),
      });
      accounts.push({ user, password: String(form.get('password') ?? '') });
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      result = { user };
    } else if (url.pathname === '/Category') {
      result = categories;
    } else if (url.pathname === '/Brand') {
      const user = readStoredAuthUser();
      result = [{ id: 900001, name: 'KUKUZA Boutique Démo', userId: user?.id }, ...brands];
    } else if (url.pathname === '/Product' && method === 'GET') {
      const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 12));
      const filteredIds = new Set(applyProductFilters(mergeMarketplaceProducts(mockProducts), {
        search: url.searchParams.get('search') ?? undefined, gender: url.searchParams.get('gender'),
        nav: url.searchParams.get('nav'), filter: url.searchParams.get('filter'),
      }).map((product) => Number(String(product.id).replace(/^product-/, ''))));
      const products = catalog().filter((product) => filteredIds.has(product.id)
        && (!url.searchParams.has('categoryId') || String(product.categoryId) === url.searchParams.get('categoryId')));
      result = { items: products.slice((page - 1) * limit, page * limit), total: products.length, page, limit };
    } else if (/^\/Product\/[^/]+$/.test(url.pathname) && method === 'GET') {
      result = catalog().find((product) => String(product.id) === url.pathname.split('/').pop())
        ?? fail(404, 'Produit démo introuvable.');
    } else if (/^\/brands\/\d+\/categories$/.test(url.pathname)) {
      result = getMockCategories();
    } else if (/^\/brands\/\d+\/metrics$/.test(url.pathname)) {
      result = getMockDashboardOverview();
    } else if (/^\/brands\/\d+\/products$/.test(url.pathname)) {
      if (method === 'POST' && options.body instanceof FormData) {
        const form = options.body;
        result = buildMockCreatedProduct({
          name: String(form.get('name')), price: Number(form.get('price')), quantity: Number(form.get('stock')),
          category: getMockCategories().find((category) => String(category.id) === form.get('categoryId'))?.name ?? 'Autres',
          gender: String(form.get('gender') ?? ''), ageRange: String(form.get('ageRange') ?? ''),
          images: form.getAll('images').filter((image): image is File => image instanceof File),
        });
      } else result = getMockProducts();
    } else if (url.pathname === '/OrderItem') {
      result = getMockSales();
    } else if (url.pathname.startsWith('/ProductReview/product/')) {
      result = [];
    } else if (url.pathname === '/Review' && method === 'POST') {
      result = { ...body, id: Date.now(), userId: currentUser().id, createdAt: new Date().toISOString() };
    } else if (url.pathname === '/Order/checkout' && method === 'POST') {
      currentUser();
      const items = body?.items as { productId: number; quantity: number }[];
      const products = catalog();
      const totalAmount = items.reduce((total, item) => {
        const product = products.find((entry) => entry.id === item.productId) ?? fail(404, 'Produit démo introuvable.');
        return total + product.price * item.quantity;
      }, 0);
      result = { id: Date.now(), totalAmount, currency: runtimeConfig.currency };
    } else {
      fail(501, `Action indisponible en démonstration : ${method} ${url.pathname}`);
    }
    return result as T;
  }
}
