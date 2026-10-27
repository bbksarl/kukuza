import type { PortalProduct, ProductFilters, NavType } from './types';
import { categoryLabelMap } from './labels';
import { FILTERS_BY_TYPE } from './navigation';
import { normalizeText } from './text';

function matchesSearch(product: PortalProduct, search: string) {
  if (!search) return true;
  const haystack = [
    product.name,
    product.brand,
    product.creator_name,
    categoryLabelMap[product.category],
    product.subcategory,
    product.material,
    product.style,
    ...product.tags,
    ...product.collections,
    ...product.sizes,
  ]
    .filter(Boolean)
    .join(' ');

  return normalizeText(haystack).includes(normalizeText(search));
}

function matchesPriceFilter(price: number, label: string) {
  const normalizedLabel = normalizeText(label);
  if (normalizedLabel.includes('< 30eur')) return price < 30;
  if (normalizedLabel.includes('< 50eur')) return price < 50;
  if (normalizedLabel.includes('30eur - 80eur')) return price >= 30 && price <= 80;
  if (normalizedLabel.includes('50eur - 100eur')) return price >= 50 && price <= 100;
  if (normalizedLabel.includes('50eur - 150eur')) return price >= 50 && price <= 150;
  if (normalizedLabel.includes('50eur - 200eur')) return price >= 50 && price <= 200;
  if (normalizedLabel.includes('> 80eur')) return price > 80;
  if (normalizedLabel.includes('> 100eur')) return price > 100;
  if (normalizedLabel.includes('> 150eur')) return price > 150;
  if (normalizedLabel.includes('> 200eur')) return price > 200;
  return true;
}

function matchesDropdownFilter(product: PortalProduct, nav: NavType, filter: string) {
  const normalizedFilter = normalizeText(filter);

  if (nav === 'skincare') return product.category === 'skincare';

  if (nav === 'promotion') {
    return product.isPromoted || product.price <= 100;
  }

  if (nav === 'createurs') {
    return normalizeText(product.creator_name) === normalizedFilter || normalizeText(product.brand) === normalizedFilter;
  }

  if (nav === 'nouveautes') {
    if (normalizedFilter === 'cette semaine' || normalizedFilter === 'semaine precedente') {
      return normalizeText(product.recency) === normalizedFilter;
    }

    if (['vetements', 'chaussures', 'sacs', 'accessoires', 'bijoux'].includes(normalizedFilter)) {
      return normalizeText(categoryLabelMap[product.category]) === normalizedFilter;
    }

    if (normalizedFilter === 'nouveautes') {
      return product.recency === 'Cette semaine' || product.tags.some((tag) => normalizeText(tag) === normalizedFilter);
    }

    return product.collections.some((item) => normalizeText(item) === normalizedFilter)
      || product.tags.some((item) => normalizeText(item) === normalizedFilter);
  }

  if (nav === 'vetements' || nav === 'chaussures' || nav === 'decor' || nav === 'sacs' || nav === 'accessoires') {
    if (nav === 'accessoires' && normalizedFilter === 'sacs') {
      return product.category === 'sacs';
    }

    if (product.category !== nav) return false;

    if (normalizedFilter.startsWith('prix:')) {
      return matchesPriceFilter(product.price, filter);
    }

    if (FILTERS_BY_TYPE[nav].some((item) => normalizeText(item.label) === normalizedFilter && normalizeText(item.category) === 'taille')) {
      return product.sizes.some((size) => normalizeText(size) === normalizedFilter);
    }

    if (normalizedFilter.startsWith('matiere:')) {
      const material = normalizedFilter.split(':')[1]?.trim() ?? '';
      return normalizeText(product.material) === material;
    }

    if (normalizedFilter.startsWith('style:')) {
      const style = normalizedFilter.split(':')[1]?.trim() ?? '';
      return normalizeText(product.style) === style;
    }

    if (normalizedFilter.startsWith('tous les')) {
      return true;
    }

    return normalizeText(product.subcategory) === normalizedFilter;
  }

  return true;
}

function matchesGender(product: PortalProduct, gender: string) {
  const normalizedGender = normalizeText(product.gender);
  const normalizedAgeRange = normalizeText(product.ageRange);
  const normalizedFilter = normalizeText(gender);

  if (normalizedFilter === 'enfant' || normalizedFilter === 'children') {
    return normalizedAgeRange === 'enfant'
      || normalizedAgeRange === 'children'
      || normalizedGender.includes('fille')
      || normalizedGender.includes('garcon')
      || normalizedGender.includes('child');
  }

  if (normalizedFilter === 'femme' || normalizedFilter === 'women') {
    return normalizedGender.includes('femme')
      || normalizedGender.includes('female')
      || normalizedGender.includes('woman')
      || normalizedGender.includes('fille')
      || normalizedGender.includes('unisexe')
      || normalizedGender.includes('unisex');
  }

  if (normalizedFilter === 'homme' || normalizedFilter === 'men') {
    return normalizedGender.includes('homme')
      || normalizedGender.includes('male')
      || normalizedGender.includes('man')
      || normalizedGender.includes('garcon')
      || normalizedGender.includes('unisexe')
      || normalizedGender.includes('unisex');
  }

  return normalizedGender === normalizedFilter || normalizedAgeRange === normalizedFilter;
}

export function applyProductFilters(products: PortalProduct[], filters: ProductFilters) {
  const search = filters.search?.trim() ?? '';
  const nav = (filters.nav as NavType | null) ?? null;
  const filter = filters.filter?.trim() ?? '';
  const gender = filters.gender?.trim() ?? '';

  return products.filter((product) => {
    if (!matchesSearch(product, search)) return false;
    if (gender && !matchesGender(product, gender)) return false;
    if (!nav) return true;
    if (!filter) {
      if (nav === 'promotion') return product.isPromoted || product.price <= 100;
      if (nav === 'createurs' || nav === 'nouveautes') return true;
      if (nav === 'skincare') return product.category === 'skincare';
      return product.category === nav;
    }
    return matchesDropdownFilter(product, nav, filter);
  });
}
