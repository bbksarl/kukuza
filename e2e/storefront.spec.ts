import { expect, test } from '@playwright/test';

test('serves the prerendered catalogue with indexable metadata and products', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { level: 1, name: 'Tous les produits' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kukuza.com/products');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index/);
  await expect(page.getByRole('link', { name: /Robe Soleil Dakar/ }).first()).toBeVisible();
});

test('gender filters navigate to the corresponding catalogue query', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Homme', exact: true }).click();

  await expect(page).toHaveURL(/\/products\?gender=Homme/);
  await expect(page.getByRole('heading', { level: 1, name: 'Homme' })).toBeVisible();
});

test('renders product metadata on the server without CSP inline-script violations', async ({ page }) => {
  const cspViolations: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy')) cspViolations.push(message.text());
  });

  const response = await page.goto('/products/123');

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'Robe SSR de test' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://kukuza.com/products/123',
  );
  await expect(page.locator('#ng-event-dispatch-contract')).toHaveCount(0);
  expect(cspViolations).toEqual([]);
});

test('returns a real HTTP 404 for unknown paths and products', async ({ page }) => {
  const unknownPathResponses: number[] = [];
  page.on('response', (response) => {
    if (new URL(response.url()).pathname === '/this-page-does-not-exist') {
      unknownPathResponses.push(response.status());
    }
  });
  const missingPath = await page.goto('/this-page-does-not-exist');
  expect(missingPath?.status()).toBe(404);
  expect(unknownPathResponses).toEqual([404]);
  await expect(page.getByRole('heading', { level: 1, name: 'Cette page est introuvable' })).toBeVisible();

  const missingProduct = await page.goto('/products/404');
  expect(missingProduct?.status()).toBe(404);
});
