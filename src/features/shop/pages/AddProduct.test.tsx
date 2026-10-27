import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';
import { LanguageProvider } from '@/core/i18n';
import { shopService } from '@/services/shop';
import AddProduct from './AddProduct';

vi.mock('@/services/shop', () => ({ shopService: { getCategories: vi.fn(), createProduct: vi.fn() } }));
vi.mock('@/layouts/shop/DashboardLayout', () => ({ default: ({ children }: PropsWithChildren) => <main>{children}</main> }));

const createdProduct = {
  id: '56', name: 'Robe', category: 'Vetements', price: 42, stock: 5, reference: 'R56',
  status: 'low_stock' as const, createdAt: new Date('2026-10-26T00:00:00Z'), updatedAt: new Date('2026-10-26T00:00:00Z'),
};
const createObjectURL = vi.fn();
const revokeObjectURL = vi.fn();

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('option', { name: 'Vêtements' });
  await user.type(screen.getByRole('textbox', { name: /Nom de l’article/ }), 'Robe');
  await user.selectOptions(screen.getByRole('combobox', { name: /Catégorie de l’article/ }), 'Vetements');
  await user.type(screen.getByRole('spinbutton', { name: /Prix/ }), '42');
  await user.type(screen.getByRole('spinbutton', { name: /Quantité/ }), '5');
  await user.selectOptions(screen.getByRole('combobox', { name: /Tranche d’âge/ }), 'Adulte');
  await user.selectOptions(screen.getByRole('combobox', { name: /catégorie de genre/ }), 'Femme');
}

describe('add product form', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(shopService.getCategories).mockResolvedValue([{ id: 3, name: 'Vetements' }]);
    vi.mocked(shopService.createProduct).mockResolvedValue(createdProduct);
    let imageId = 0;
    createObjectURL.mockImplementation(() => `blob:preview-${++imageId}`);
    vi.stubGlobal('URL', class extends URL {
      static createObjectURL = createObjectURL;
      static revokeObjectURL = revokeObjectURL;
    });
  });
  afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals(); });

  it('validates required fields and resets the gender when the age range changes', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><AddProduct /></LanguageProvider>);
    await user.click(screen.getByRole('button', { name: 'Publier le produit' }));
    expect(shopService.createProduct).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /Nom de l’article/ })).toHaveAttribute('aria-invalid', 'true');
    await fillForm(user);
    await user.selectOptions(screen.getByRole('combobox', { name: /Tranche d’âge/ }), 'Enfant');
    expect(screen.getByRole('combobox', { name: /catégorie de genre/ })).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Publier le produit' }));
    expect(shopService.createProduct).not.toHaveBeenCalled();
  });

  it('preserves input on failure, prevents duplicate submissions and resets after success', async () => {
    const user = userEvent.setup();
    let rejectRequest!: (reason: Error) => void;
    vi.mocked(shopService.createProduct).mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectRequest = reject; }));
    const { container } = render(<LanguageProvider><AddProduct /></LanguageProvider>);
    await fillForm(user);
    const image = new File(['image'], 'robe.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Ajouter une image', { selector: 'input' }), image);
    const form = container.querySelector('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(shopService.createProduct).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox', { name: /Nom de l’article/ })).toBeDisabled();
    await act(async () => rejectRequest(new Error('Service indisponible')));
    expect(await screen.findByRole('alert')).toHaveTextContent('Service indisponible');
    expect(screen.getByRole('textbox', { name: /Nom de l’article/ })).toHaveValue('Robe');
    await user.click(screen.getByRole('button', { name: 'Publier le produit' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Produit publié avec succès.');
    expect(shopService.createProduct).toHaveBeenLastCalledWith({ name: 'Robe', category: 'Vetements', price: 42, quantity: 5, ageRange: 'Adulte', gender: 'Femme', images: [image] });
    expect(screen.getByRole('textbox', { name: /Nom de l’article/ })).toHaveValue('');
    expect(revokeObjectURL).toHaveBeenCalledTimes(createObjectURL.mock.calls.length);
  });

  it('saves another product and releases previews when leaving the form', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<LanguageProvider><AddProduct /></LanguageProvider>);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Ajouter un autre produit' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Produit enregistré. Vous pouvez en ajouter un autre.');
    await user.upload(screen.getByLabelText('Ajouter une image', { selector: 'input' }), new File(['image'], 'robe.png', { type: 'image/png' }));
    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    unmount();
    const created = createObjectURL.mock.results.map(({ value }) => value);
    expect(revokeObjectURL.mock.calls.map(([url]) => url).sort()).toEqual(created.sort());
  });

  it('shows category loading errors without creating placeholder choices', async () => {
    vi.mocked(shopService.getCategories).mockRejectedValue(new Error('Catégories indisponibles'));
    render(<LanguageProvider><AddProduct /></LanguageProvider>);
    expect(await screen.findByText('Catégories indisponibles')).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Vêtements' })).not.toBeInTheDocument();
  });
});
