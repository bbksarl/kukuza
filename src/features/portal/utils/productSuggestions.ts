import { normalizeText, type PortalProduct } from '../data/catalog';

/** Suggestions limitées aux produits déjà chargés ; la recherche complète reste côté API. */
export function getProductSuggestions(products: readonly PortalProduct[], query: string): PortalProduct[] {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return [];

  return products
    .map((product) => {
      const searchableFields = [
        product.name,
        product.boutique_name,
        product.brand,
        product.creator_name,
        product.category,
        product.subcategory,
      ].filter(Boolean).map((value) => normalizeText(value));
      const name = normalizeText(product.name);
      const boutique = normalizeText(product.boutique_name || product.brand || product.creator_name);
      const searchableText = searchableFields.join(' ');

      if (!searchableText.includes(normalizedQuery)) return null;

      const score = name.startsWith(normalizedQuery)
        ? 0
        : boutique.startsWith(normalizedQuery)
          ? 1
          : name.includes(normalizedQuery)
            ? 2
            : 3;

      return { product, score };
    })
    .filter((suggestion): suggestion is { product: PortalProduct; score: number } => suggestion !== null)
    .sort((left, right) => left.score - right.score || left.product.name.localeCompare(right.product.name))
    .slice(0, 6)
    .map(({ product }) => product);
}
