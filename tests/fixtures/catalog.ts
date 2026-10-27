import type { ProductDto, ProductPageDto } from '@/api/contracts/catalog';

/** Exemples du contrat proposé, indépendants des données de démonstration de l'application. */
export function catalogProduct(id: number, overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id,
    name: `Robe ${id}`,
    price: 45,
    imageUrl: '/assets/products/p1.png',
    brand: { id: 7, name: 'Atelier Dakar' },
    category: 'vetements',
    ...overrides,
  };
}

export function catalogPage(items: ProductDto[], overrides: Partial<ProductPageDto> = {}): ProductPageDto {
  return { items, page: 1, limit: 12, total: items.length, ...overrides };
}
