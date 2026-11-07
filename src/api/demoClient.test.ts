import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  vi.stubEnv('DEV', false);
  vi.stubEnv('MODE', 'demo');
  // Le build démo reste démo même si une ancienne variable Vercel vaut false.
  vi.stubEnv('VITE_ENABLE_API_MOCKS', 'false');
  vi.stubEnv('VITE_DEFAULT_ADMIN_EMAIL', 'admin@demo.example');
  vi.stubEnv('VITE_DEFAULT_ADMIN_PASSWORD', 'Demo-admin-123!');
  vi.stubEnv('VITE_DEFAULT_BOUTIQUE_EMAIL', 'shop@demo.example');
  vi.stubEnv('VITE_DEFAULT_BOUTIQUE_PASSWORD', 'Demo-shop-123!');
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected network request'); }));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  localStorage.clear();
});

it('loads a paginated, searchable catalogue and navigation without a backend', async () => {
  const { getProducts, getCategories, getCreators, getProduct } = await import('@/features/portal/services/api');
  const first = await getProducts(1, 12);
  const second = await getProducts(2, 12);
  expect(first.items).toHaveLength(12);
  expect(second.items).toHaveLength(2);
  expect(first.total).toBe(14);
  expect((await getProducts(1, 12, undefined, { search: 'Robe Soleil' })).items).toHaveLength(1);
  expect((await getProducts(1, 12, undefined, { search: 'unknown-product' })).total).toBe(0);
  expect(await getCategories()).not.toHaveLength(0);
  expect(await getCreators()).not.toHaveLength(0);
  expect((await getProduct('1')).name).toBe('Robe Soleil Dakar');
  expect(fetch).not.toHaveBeenCalled();
});

it.each([
  ['admin@demo.example', 'Demo-admin-123!', 'admin'],
  ['shop@demo.example', 'Demo-shop-123!', 'creator'],
])('logs in and restores the %s demo session in a production build', async (email, password, role) => {
  const { AuthService } = await import('@/features/auth/domain/auth/services/AuthService');
  const { facadeClient } = await import('./client');
  const service = new AuthService();
  await expect(service.getCurrentUser()).rejects.toMatchObject({ status: 401 });
  const result = await service.login({ email, password });
  expect(result.role).toBe(role);
  localStorage.setItem('kukuza-auth-user', JSON.stringify(result.user.toJSON()));
  expect((await service.getCurrentUser()).role).toBe(role);
  expect(await facadeClient.get('/Auth/me')).toMatchObject({ role });
  await service.logout();
  await expect(service.getCurrentUser()).rejects.toMatchObject({ status: 401 });
  await expect(facadeClient.post('/Auth/login', { username: email, password: 'wrong' })).rejects.toMatchObject({ status: 401 });
  expect(fetch).not.toHaveBeenCalled();
});

it('supports a local registration, subsequent login and simulated checkout', async () => {
  const { AuthRepository } = await import('@/features/auth/domain/auth/repositories/AuthRepository');
  const { Credentials } = await import('@/features/auth/domain/auth/entities/Credentials');
  const { facadeClient } = await import('./client');
  const repository = new AuthRepository();
  const registered = await repository.register({ name: 'Amina', email: 'amina@demo.example', password: 'Demo-customer-123!', isBoutique: false });
  expect(registered.role).toBe('customer');
  const loggedIn = await repository.login(new Credentials('amina@demo.example', 'Demo-customer-123!'));
  localStorage.setItem('kukuza-auth-user', JSON.stringify(loggedIn.user.toJSON()));
  expect((await repository.getCurrentUser()).email.toString()).toBe('amina@demo.example');
  expect(await facadeClient.post('/Order/checkout', { items: [{ productId: 1, quantity: 2 }] })).toMatchObject({ totalAmount: 250 });
  await repository.logout();
  await expect(repository.getCurrentUser()).rejects.toMatchObject({ status: 401 });
  expect(fetch).not.toHaveBeenCalled();
});

it('loads boutique/admin dashboards, sales and creates a demo product without fetch', async () => {
  const { AuthService } = await import('@/features/auth/domain/auth/services/AuthService');
  const result = await new AuthService().login({ email: 'shop@demo.example', password: 'Demo-shop-123!' });
  localStorage.setItem('kukuza-auth-user', JSON.stringify(result.user.toJSON()));
  const { shopService } = await import('@/features/shop/services/shop/shopService');
  const { adminService } = await import('@/features/admin/services/adminService');
  expect(await shopService.getCategories()).not.toHaveLength(0);
  expect((await shopService.getDashboardOverview()).stats.totalSales).toBeGreaterThan(0);
  expect(await shopService.getProducts()).not.toHaveLength(0);
  expect(await shopService.getSales()).not.toHaveLength(0);
  expect((await adminService.getOverview()).kpis).not.toHaveLength(0);
  const created = await shopService.createProduct({ name: 'Robe test', price: 42, quantity: 5, category: 'Vetements', gender: 'Femme', ageRange: 'Adulte', images: [] });
  expect(created.name).toBe('Robe test');
  expect((await shopService.getProducts()).some((product) => product.id === created.id)).toBe(true);
  expect(fetch).not.toHaveBeenCalled();
});

it('keeps the real API and disables demo accounts when mocks are off in production', async () => {
  vi.stubEnv('MODE', 'production');
  const { facadeClient } = await import('./client');
  const { DemoFacadeClient } = await import('./demoClient');
  const { getDevelopmentAdmin } = await import('@/features/auth/config/defaultAdmin');
  const { getDevelopmentBoutique } = await import('@/features/auth/config/defaultBoutique');
  expect(facadeClient).not.toBeInstanceOf(DemoFacadeClient);
  expect(getDevelopmentAdmin('admin@demo.example', 'Demo-admin-123!')).toBeNull();
  expect(getDevelopmentBoutique('shop@demo.example', 'Demo-shop-123!')).toBeNull();
});
