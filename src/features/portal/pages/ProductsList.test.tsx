import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import { catalogPage, catalogProduct } from '../../../../tests/fixtures/catalog';
import ProductsList from './ProductsList';

// Exercise the real HTTP facade, repository, response validation and React hooks.
// Only fetch responses and browser-only observation are simulated.
vi.mock('@/api/client', async () => {
  const { FacadeClient } = await import('@kukuza/facade');
  return { facadeClient: new FacadeClient({ apiBaseUrl: 'https://api.kukuza.test/api' }) };
});
vi.mock('@/config/runtime', () => ({ runtimeConfig: { enableApiMocks: false, currency: 'EUR' } }));

function NavigationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return <>
    <output data-testid="location">{location.pathname}{location.search}</output>
    <button type="button" onClick={() => navigate(-1)}>Retour test</button>
  </>;
}

function renderCatalog(path = '/products') {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>
        <NavigationProbe />
        <Routes>
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<h1>Fiche produit</h1>} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  );
}

function simulateCatalog(respond: (url: URL, init?: RequestInit) => Response | Promise<Response>) {
  const requests: URL[] = [];
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.origin !== 'https://api.kukuza.test' || url.pathname !== '/api/Product') {
      throw new Error(`Unexpected API request: ${url.pathname}`);
    }
    requests.push(url);
    return Promise.resolve(respond(url, init));
  });
  vi.stubGlobal('fetch', fetchMock);
  return { requests, fetchMock };
}

describe('catalogue with simulated HTTP responses', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'fr';
    vi.stubGlobal('IntersectionObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sends URL filters to the API, searches and restores the search on browser back', async () => {
    const user = userEvent.setup();
    const { requests } = simulateCatalog((url) => Response.json(catalogPage([
      catalogProduct(1, { name: url.searchParams.get('search') === 'lin' ? 'Robe en lin' : 'Robe en coton' }),
    ])));
    renderCatalog('/products?nav=vetements&gender=Femme');
    await screen.findByRole('button', { name: 'Voir le produit Robe en coton' });
    expect(Object.fromEntries(requests[0].searchParams)).toEqual({ page: '1', limit: '12', nav: 'vetements', gender: 'Femme' });
    const search = screen.getByRole('combobox', { name: 'Rechercher un produit' });
    await user.type(search, 'lin{Enter}');
    await screen.findByRole('button', { name: 'Voir le produit Robe en lin' });
    expect(Object.fromEntries(requests.at(-1)!.searchParams)).toEqual({ page: '1', limit: '12', search: 'lin', nav: 'vetements', gender: 'Femme' });
    await user.click(screen.getByRole('button', { name: 'Retour test' }));
    await screen.findByRole('button', { name: 'Voir le produit Robe en coton' });
    expect(search).toHaveValue('');
  });

  it('keeps products visible while loading more and retries only the failed page', async () => {
    const user = userEvent.setup();
    const firstPage = Array.from({ length: 12 }, (_, index) => catalogProduct(index + 1));
    let resolveNextPage!: (response: Response) => void;
    let failNextPage = true;
    const { requests } = simulateCatalog((url) => {
      if (url.searchParams.get('page') === '1') return Response.json(catalogPage(firstPage, { total: 13 }));
      if (failNextPage) return new Promise<Response>((resolve) => { resolveNextPage = resolve; });
      return Response.json(catalogPage([catalogProduct(13)], { page: 2, total: 13 }));
    });
    renderCatalog();
    await screen.findByRole('button', { name: 'Voir le produit Robe 1' });
    await user.click(screen.getByRole('button', { name: 'Charger plus' }));
    expect(screen.getByRole('button', { name: 'Voir le produit Robe 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chargement des produits' })).toBeDisabled();
    await waitFor(() => expect(resolveNextPage).toBeTypeOf('function'));
    await act(async () => resolveNextPage(Response.json({ title: 'Service temporairement indisponible' }, { status: 400 })));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voir le produit Robe 1' })).toBeInTheDocument();
    failNextPage = false;
    await user.click(screen.getByRole('button', { name: 'Réessayer' }));
    await screen.findByRole('button', { name: 'Voir le produit Robe 13' });
    expect(screen.getAllByRole('article')).toHaveLength(13);
    expect(requests.map((url) => url.searchParams.get('page'))).toEqual(['1', '2', '2']);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Charger plus' })).not.toBeInTheDocument();
  });

  it('rejects malformed API data without demo fallback and can recover', async () => {
    const user = userEvent.setup();
    let invalid = true;
    simulateCatalog(() => Response.json(catalogPage([catalogProduct(8, { price: invalid ? -10 : 45 })])));
    renderCatalog();
    expect(await screen.findByRole('alert')).toHaveTextContent('Les produits ne peuvent pas être affichés pour le moment.');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    invalid = false;
    await user.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(await screen.findByRole('button', { name: 'Voir le produit Robe 8' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('selects an accented suggestion by keyboard then navigates to the product', async () => {
    const user = userEvent.setup();
    const products = [catalogProduct(3, { name: 'Écharpe bleue' }), catalogProduct(4, { name: 'Écharpe rouge' })];
    const { requests } = simulateCatalog((url) => {
      const query = url.searchParams.get('search');
      return Response.json(catalogPage(query ? products.filter((product) => product.name === query) : products));
    });
    renderCatalog();
    await screen.findByRole('button', { name: 'Voir le produit Écharpe bleue' });
    const search = screen.getByRole('combobox');
    await user.type(search, 'echarpe');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(requests.at(-1)!.searchParams.get('search')).toBe('Écharpe rouge'));
    expect(search).toHaveValue('Écharpe rouge');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Voir le produit Écharpe rouge' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/products/4');
  });

  it('shows an empty state and resets filters through the API', async () => {
    const user = userEvent.setup();
    simulateCatalog((url) => Response.json(catalogPage(url.searchParams.has('search') ? [] : [catalogProduct(1)])));
    renderCatalog('/products?q=inexistant&nav=vetements');
    await screen.findByRole('heading', { name: 'Aucun produit trouvé' });
    await user.click(screen.getByRole('button', { name: 'Voir tout le catalogue' }));
    expect(await screen.findByRole('button', { name: 'Voir le produit Robe 1' })).toBeInTheDocument();
    expect(screen.getByTestId('location').textContent).toBe('/products');
    expect(screen.getByRole('combobox')).toHaveValue('');
  });
});
