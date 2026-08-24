import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from './CartProvider';

function CartFixture() {
  const { addItem, totalQuantity } = useCart();

  return (
    <>
      <output aria-label="cart-count">{totalQuantity}</output>
      <button
        type="button"
        onClick={() => addItem({ id: 'product:1:default', name: 'Produit test', price: 10 })}
      >
        Ajouter
      </button>
    </>
  );
}

describe('CartProvider', () => {
  beforeEach(() => window.localStorage.clear());

  it('increments the cart quantity when the same product is added twice', () => {
    render(
      <CartProvider>
        <CartFixture />
      </CartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(screen.getByRole('status', { name: 'cart-count' })).toHaveTextContent('2');
  });
});
