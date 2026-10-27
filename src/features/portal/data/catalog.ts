// Point d'entrée stable pour les consommateurs du catalogue.
export type { DropdownType, NavType, FilterOption, NavItem, PortalProduct, ProductFilters } from './catalog/types';
export { NAV_ITEMS, FILTERS_BY_TYPE, FILTER_CATEGORY_ORDER, groupFilters, getNavTitle } from './catalog/navigation';
export { formatFilterLabel } from './catalog/labels';
export { normalizeText } from './catalog/text';
export { normalizeProduct } from './catalog/productMapper';
export { applyProductFilters } from './catalog/filters';
export { mockProducts } from './catalog/mockProducts';
export { getPortalProductById, mergeMarketplaceProducts } from './catalog/localProducts';
