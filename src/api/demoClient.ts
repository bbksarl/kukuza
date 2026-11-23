import { ApiError } from '@/app/core/api-error';
import { z } from 'zod';
import { sessionUserSchema, type SessionUserDto } from './contracts/auth';
import { productSchema } from './contracts/catalog';
import { readStoredAuthUser, clearStoredSession } from '@/core/auth/sessionStorage';
import { getDevelopmentAdmin } from '@/features/auth/config/defaultAdmin';
import { getDevelopmentBoutique } from '@/features/auth/config/defaultBoutique';
import { applyProductFilters, mergeMarketplaceProducts, mockProducts } from '@/features/portal/data/catalog';
import {
  getMockCategories,
  getMockDashboardOverview,
  getMockProducts,
  getMockSales,
  buildMockCreatedProduct,
} from '@/features/shop/utils/mockData';
import { runtimeConfig } from '@/config/runtime';

const ACCOUNTS_KEY = 'kukuza-demo-accounts';
const accountsSchema = z.array(
  z.object({ user: sessionUserSchema, salt: z.string(), passwordHash: z.string() }),
);
type DemoAccount = z.infer<typeof accountsSchema>[number];
const readAccounts = (): DemoAccount[] => {
  try {
    return accountsSchema.parse(JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]'));
  } catch {
    // Drop legacy demo records that stored reversible plaintext passwords.
    try {
      localStorage.removeItem(ACCOUNTS_KEY);
    } catch {
      /* Storage may be disabled. */
    }
    return [];
  }
};
const fail = (status: number, message: string): never => {
  throw new ApiError(status, message, { message }, 'demo');
};
const toBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));
const fromBase64 = (value: string): Uint8Array => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
const hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: 210_000, hash: 'SHA-256' },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
};
const verifyPassword = async (password: string, account: DemoAccount): Promise<boolean> => {
  const candidate = await hashPassword(password, fromBase64(account.salt));
  return candidate === account.passwordHash;
};
const currentUser = (): SessionUserDto => {
  const result = sessionUserSchema.safeParse(readStoredAuthUser());
  return result.success ? result.data : fail(401, 'Connectez-vous pour continuer.');
};
const categories = [...new Set(mockProducts.map((product) => product.category))].map((name, index) => ({
  id: index + 1,
  name,
}));
const brands = [...new Set(mockProducts.map((product) => product.brand))].map((name, index) => ({
  id: index + 1,
  name,
  profileImageUrl: `/assets/boutiques/shop${(index % 6) + 1}-display.webp`,
}));
const catalog = () =>
  mergeMarketplaceProducts(mockProducts).map((product) => {
    const brand = brands.find((item) => item.name === product.brand) ?? { id: 900001, name: product.brand };
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
export class DemoApiClient {
  async request(
    path: string,
    options: Omit<RequestInit, 'body'> & { body?: unknown; skipRedirect?: boolean; timeoutMs?: number } = {},
  ): Promise<unknown> {
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
    } else if (url.pathname === '/Auth/forgot-password' && method === 'POST') {
      // Toujours renvoyer un succès afin de ne pas révéler si un compte démo existe.
      result = { message: 'Si cette adresse existe, les instructions vont être envoyées.' };
    } else if (url.pathname === '/Auth/login') {
      const username = String(body?.username ?? '')
        .trim()
        .toLowerCase();
      const password = String(body?.password ?? '');
      const preset = getDevelopmentAdmin(username, password) ?? getDevelopmentBoutique(username, password);
      const accounts = readAccounts().filter((account) =>
        [account.user.email.toLowerCase(), account.user.username.toLowerCase()].includes(username),
      );
      let registered: DemoAccount | undefined;
      for (const account of accounts) {
        if (await verifyPassword(password, account)) {
          registered = account;
          break;
        }
      }
      result = { user: preset?.user.toJSON() ?? registered?.user ?? fail(401, 'Identifiants incorrects.') };
    } else if (url.pathname === '/Auth/register' && options.body instanceof FormData) {
      const form = options.body;
      const email = String(form.get('email') ?? '')
        .trim()
        .toLowerCase();
      const accounts = readAccounts();
      if (accounts.some((account) => account.user.email === email)) fail(409, 'Ce compte démo existe déjà.');
      const user = sessionUserSchema.parse({
        id: Date.now(),
        username: form.get('username'),
        email,
        role: form.get('role'),
        createdAt: new Date().toISOString(),
      });
      const password = String(form.get('password') ?? '');
      const salt = crypto.getRandomValues(new Uint8Array(16));
      accounts.push({ user, salt: toBase64(salt), passwordHash: await hashPassword(password, salt) });
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
      const filteredIds = new Set(
        applyProductFilters(mergeMarketplaceProducts(mockProducts), {
          search: url.searchParams.get('search') ?? undefined,
          gender: url.searchParams.get('gender'),
          nav: url.searchParams.get('nav'),
          filter: url.searchParams.get('filter'),
        }).map((product) => Number(String(product.id).replace(/^product-/, ''))),
      );
      const products = catalog().filter(
        (product) =>
          filteredIds.has(product.id) &&
          (!url.searchParams.has('categoryId') ||
            String(product.categoryId) === url.searchParams.get('categoryId')),
      );
      result = {
        items: products.slice((page - 1) * limit, page * limit),
        total: products.length,
        page,
        limit,
      };
    } else if (/^\/Product\/[^/]+$/.test(url.pathname) && method === 'GET') {
      result =
        catalog().find((product) => String(product.id) === url.pathname.split('/').pop()) ??
        fail(404, 'Produit démo introuvable.');
    } else if (/^\/brands\/\d+\/categories$/.test(url.pathname)) {
      result = getMockCategories();
    } else if (/^\/brands\/\d+\/metrics$/.test(url.pathname)) {
      result = getMockDashboardOverview();
    } else if (/^\/brands\/\d+\/products$/.test(url.pathname)) {
      if (method === 'POST' && options.body instanceof FormData) {
        const form = options.body;
        result = buildMockCreatedProduct({
          name: String(form.get('name')),
          price: Number(form.get('price')),
          quantity: Number(form.get('stock')),
          category:
            getMockCategories().find((category) => String(category.id) === form.get('categoryId'))?.name ??
            'Autres',
          gender: String(form.get('gender') ?? ''),
          ageRange: String(form.get('ageRange') ?? ''),
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
        const product =
          products.find((entry) => entry.id === item.productId) ?? fail(404, 'Produit démo introuvable.');
        return total + product.price * item.quantity;
      }, 0);
      result = { id: Date.now(), totalAmount, currency: runtimeConfig.currency };
    } else {
      fail(501, `Action indisponible en démonstration : ${method} ${url.pathname}`);
    }
    return result;
  }
}
