import { getMarketplaceProducts, type MarketplaceProductRecord } from '@/services/products/marketplaceProductStore';

export type DropdownType =
  | 'nouveautes'
  | 'createurs'
  | 'vetements'
  | 'chaussures'
  | 'decor'
  | 'sacs'
  | 'accessoires';

export type NavType = DropdownType | 'promotion' | 'skincare';

export type FilterOption = {
  label: string;
  category: string;
};

export type NavItem = {
  hash: string;
  title: string;
  hasDropdown: boolean;
  dropdownType?: DropdownType;
  navType: NavType;
};

export type PortalProduct = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  brand: string;
  creator_name: string;
  boutique_id?: string;
  boutique_name?: string;
  category: 'vetements' | 'chaussures' | 'decor' | 'sacs' | 'accessoires' | 'bijoux' | 'skincare';
  subcategory: string;
  gender?: string;
  ageRange?: string;
  sizes: string[];
  style?: string;
  material?: string;
  tags: string[];
  collections: string[];
  recency: 'Cette semaine' | 'Semaine précédente';
  isPromoted?: boolean;
};

export type ProductFilters = {
  search?: string;
  gender?: string | null;
  nav?: string | null;
  filter?: string | null;
};

export const NAV_ITEMS: NavItem[] = [
  { hash: '#nouveautes', title: 'NOUVEAUTES', hasDropdown: true, dropdownType: 'nouveautes', navType: 'nouveautes' },
  { hash: '#createurs', title: 'CREATEURS', hasDropdown: true, dropdownType: 'createurs', navType: 'createurs' },
  { hash: '#vetements', title: 'VETEMENTS', hasDropdown: true, dropdownType: 'vetements', navType: 'vetements' },
  { hash: '#chaussures', title: 'CHAUSSURES', hasDropdown: true, dropdownType: 'chaussures', navType: 'chaussures' },
  { hash: '#decor', title: 'DECOR ET LIFESTYLE', hasDropdown: true, dropdownType: 'decor', navType: 'decor' },
  { hash: '#accessoires', title: 'ACCESSOIRES', hasDropdown: true, dropdownType: 'accessoires', navType: 'accessoires' },
  { hash: '#skincare', title: 'SKINCARE', hasDropdown: false, navType: 'skincare' },
  { hash: '#promotion', title: 'PROMOTION', hasDropdown: false, navType: 'promotion' },
];

export const FILTERS_BY_TYPE: Record<DropdownType, FilterOption[]> = {
  nouveautes: [
    { label: 'Cette semaine', category: 'Temps' },
    { label: 'Semaine precedente', category: 'Temps' },
    { label: 'Les essentiels', category: 'Collections' },
    { label: 'Il fait froid dehors', category: 'Collections' },
    { label: 'Selection ski', category: 'Collections' },
    { label: 'Vacances', category: 'Collections' },
    { label: 'Tendances du moment', category: 'Collections' },
    { label: 'Nouvelle saison', category: 'Collections' },
    { label: 'Nouveautes', category: 'Categories' },
    { label: 'Vetements', category: 'Categories' },
    { label: 'Chaussures', category: 'Categories' },
    { label: 'Sacs', category: 'Categories' },
    { label: 'Accessoires', category: 'Categories' },
    { label: 'Bijoux', category: 'Categories' },
  ],
  createurs: [
    { label: 'Atelier Rabbal', category: 'A-C' },
    { label: 'BTOURE', category: 'A-C' },
    { label: 'Bellesansmaquillage', category: 'A-C' },
    { label: 'ByMakan', category: 'A-C' },
    { label: 'Colle Sow Ardo', category: 'A-C' },
    { label: 'Algueye', category: 'A-C' },
    { label: 'Jeyna A', category: 'J-O' },
    { label: 'Nene Yayah', category: 'J-O' },
    { label: 'Owens', category: 'J-O' },
    { label: 'Sokoundou', category: 'S-Z' },
  ],
  vetements: [
    { label: 'Tous les vetements', category: 'Categorie' },
    { label: 'Tops', category: 'Categorie' },
    { label: 'Robes', category: 'Categorie' },
    { label: 'Pantalons', category: 'Categorie' },
    { label: 'Jupes', category: 'Categorie' },
    { label: 'Vestes & Manteaux', category: 'Categorie' },
    { label: 'Lingerie', category: 'Categorie' },
    { label: 'XS', category: 'Taille' },
    { label: 'S', category: 'Taille' },
    { label: 'M', category: 'Taille' },
    { label: 'L', category: 'Taille' },
    { label: 'XL', category: 'Taille' },
    { label: 'Prix: < 50EUR', category: 'Prix' },
    { label: 'Prix: 50EUR - 100EUR', category: 'Prix' },
    { label: 'Prix: > 100EUR', category: 'Prix' },
  ],
  chaussures: [
    { label: 'Tous les modeles', category: 'Categorie' },
    { label: 'Sneakers', category: 'Categorie' },
    { label: 'Bottes', category: 'Categorie' },
    { label: 'Sandales', category: 'Categorie' },
    { label: 'Mocassins', category: 'Categorie' },
    { label: 'Escarpins', category: 'Categorie' },
    { label: 'Prix: < 50EUR', category: 'Prix' },
    { label: 'Prix: 50EUR - 100EUR', category: 'Prix' },
    { label: 'Prix: > 100EUR', category: 'Prix' },
  ],
  decor: [
    { label: 'Tous les articles', category: 'Categorie' },
    { label: 'Decoration', category: 'Categorie' },
    { label: 'Mobilier', category: 'Categorie' },
    { label: 'Luminaires', category: 'Categorie' },
    { label: 'Textiles & Literie', category: 'Categorie' },
    { label: 'Cadeaux', category: 'Categorie' },
    { label: 'Style: Minimaliste', category: 'Style' },
    { label: 'Style: Boheme', category: 'Style' },
    { label: 'Style: Industriel', category: 'Style' },
    { label: 'Prix: < 50EUR', category: 'Prix' },
    { label: 'Prix: 50EUR - 200EUR', category: 'Prix' },
    { label: 'Prix: > 200EUR', category: 'Prix' },
  ],
  sacs: [
    { label: 'Tous les sacs', category: 'Categorie' },
    { label: 'Tote', category: 'Categorie' },
    { label: 'Crossbody', category: 'Categorie' },
    { label: 'Clutch', category: 'Categorie' },
    { label: 'Sac a dos', category: 'Categorie' },
    { label: 'Matiere: Cuir', category: 'Matiere' },
    { label: 'Matiere: Toile', category: 'Matiere' },
    { label: 'Matiere: Synthetique', category: 'Matiere' },
    { label: 'Prix: < 50EUR', category: 'Prix' },
    { label: 'Prix: 50EUR - 150EUR', category: 'Prix' },
    { label: 'Prix: > 150EUR', category: 'Prix' },
  ],
  accessoires: [
    { label: 'Tous les accessoires', category: 'Categorie' },
    { label: 'Sacs', category: 'Categorie' },
    { label: 'Ceintures', category: 'Categorie' },
    { label: 'Echarpes', category: 'Categorie' },
    { label: 'Chapeaux', category: 'Categorie' },
    { label: 'Lunettes', category: 'Categorie' },
    { label: 'Bijoux fins', category: 'Categorie' },
    { label: 'Matiere: Cuir', category: 'Matiere' },
    { label: 'Matiere: Metal', category: 'Matiere' },
    { label: 'Matiere: Tissu', category: 'Matiere' },
    { label: 'Prix: < 30EUR', category: 'Prix' },
    { label: 'Prix: 30EUR - 80EUR', category: 'Prix' },
    { label: 'Prix: > 80EUR', category: 'Prix' },
  ],
};

export const FILTER_CATEGORY_ORDER: Partial<Record<DropdownType, string[]>> = {
  vetements: ['Categorie', 'Taille', 'Prix'],
  chaussures: ['Categorie', 'Prix'],
  decor: ['Categorie', 'Style', 'Prix'],
  sacs: ['Categorie', 'Matiere', 'Prix'],
  accessoires: ['Categorie', 'Matiere', 'Prix'],
};

const categoryLabelMap: Record<PortalProduct['category'], string> = {
  vetements: 'Vetements',
  chaussures: 'Chaussures',
  decor: 'Decoration',
  sacs: 'Sacs',
  accessoires: 'Accessoires',
  bijoux: 'Bijoux',
  skincare: 'Skincare',
};

export const mockProducts: PortalProduct[] = [
  {
    id: 1,
    name: 'Robe Soleil Dakar',
    price: 125,
    image_url: '/assets/products/p1.png',
    brand: 'Maison Nene',
    creator_name: 'Nene Yayah',
    gender: 'Femme',
    category: 'vetements',
    subcategory: 'Robes',
    sizes: ['S', 'M', 'L'],
    style: 'Boheme',
    material: 'Tissu',
    tags: ['Nouveautes', 'Tendances du moment'],
    collections: ['Vacances', 'Nouvelle saison'],
    recency: 'Cette semaine',
    isPromoted: true,
  },
  {
    id: 2,
    name: 'Top Atelier Indigo',
    price: 48,
    image_url: '/assets/products/p2.png',
    brand: 'Atelier Rabbal',
    creator_name: 'Atelier Rabbal',
    gender: 'Femme',
    category: 'vetements',
    subcategory: 'Tops',
    sizes: ['XS', 'S', 'M'],
    style: 'Minimaliste',
    material: 'Tissu',
    tags: ['Les essentiels'],
    collections: ['Les essentiels'],
    recency: 'Cette semaine',
  },
  {
    id: 3,
    name: 'Pantalon Signature',
    price: 95,
    image_url: '/assets/products/p3.png',
    brand: 'BTOURE',
    creator_name: 'BTOURE',
    gender: 'Femme',
    category: 'vetements',
    subcategory: 'Pantalons',
    sizes: ['M', 'L', 'XL'],
    style: 'Industriel',
    material: 'Tissu',
    tags: ['Nouvelle saison'],
    collections: ['Nouvelle saison'],
    recency: 'Semaine précédente',
    isPromoted: true,
  },
  {
    id: 4,
    name: 'Veste Harmattan',
    price: 160,
    image_url: '/assets/products/p4.png',
    brand: 'ByMakan',
    creator_name: 'ByMakan',
    gender: 'Homme',
    category: 'vetements',
    subcategory: 'Vestes & Manteaux',
    sizes: ['M', 'L'],
    style: 'Minimaliste',
    material: 'Tissu',
    tags: ['Il fait froid dehors', 'Selection ski'],
    collections: ['Il fait froid dehors', 'Selection ski'],
    recency: 'Cette semaine',
  },
  {
    id: 5,
    name: 'Sneakers Kora',
    price: 85,
    image_url: '/assets/products/p5.png',
    brand: 'Owens',
    creator_name: 'Owens',
    gender: 'Homme',
    category: 'chaussures',
    subcategory: 'Sneakers',
    sizes: ['40', '41', '42'],
    material: 'Cuir',
    tags: ['Tendances du moment'],
    collections: ['Tendances du moment'],
    recency: 'Cette semaine',
    isPromoted: true,
  },
  {
    id: 6,
    name: 'Sandales Orfevre',
    price: 62,
    image_url: '/assets/products/p6.png',
    brand: 'Colle Sow Ardo',
    creator_name: 'Colle Sow Ardo',
    gender: 'Femme',
    category: 'chaussures',
    subcategory: 'Sandales',
    sizes: ['38', '39', '40'],
    material: 'Cuir',
    tags: ['Vacances'],
    collections: ['Vacances'],
    recency: 'Semaine précédente',
  },
  {
    id: 7,
    name: 'Escarpins Ebane',
    price: 115,
    image_url: '/assets/products/p7.png',
    brand: 'Jeyna A',
    creator_name: 'Jeyna A',
    gender: 'Femme',
    category: 'chaussures',
    subcategory: 'Escarpins',
    sizes: ['37', '38', '39'],
    material: 'Cuir',
    tags: ['Nouveautes'],
    collections: ['Nouvelle saison'],
    recency: 'Cette semaine',
  },
  {
    id: 8,
    name: 'Tote Kukuza Atelier',
    price: 72,
    image_url: '/assets/products/p8.png',
    brand: 'Algueye',
    creator_name: 'Algueye',
    gender: 'Femme',
    category: 'sacs',
    subcategory: 'Tote',
    sizes: ['Unique'],
    material: 'Toile',
    tags: ['Les essentiels'],
    collections: ['Les essentiels'],
    recency: 'Cette semaine',
  },
  {
    id: 9,
    name: 'Clutch Nuit Sahel',
    price: 155,
    image_url: '/assets/products/p9.png',
    brand: 'Sokoundou',
    creator_name: 'Sokoundou',
    gender: 'Femme',
    category: 'sacs',
    subcategory: 'Clutch',
    sizes: ['Unique'],
    material: 'Cuir',
    tags: ['Edition limitee'],
    collections: ['Nouvelle saison'],
    recency: 'Semaine précédente',
    isPromoted: true,
  },
  {
    id: 10,
    name: 'Lampadaire Atelier',
    price: 220,
    image_url: '/assets/products/p10.png',
    brand: 'Maison Lumiere',
    creator_name: 'Bellesansmaquillage',
    gender: 'Unisexe',
    category: 'decor',
    subcategory: 'Luminaires',
    sizes: ['Unique'],
    style: 'Industriel',
    material: 'Metal',
    tags: ['Decoration'],
    collections: ['Nouvelle saison'],
    recency: 'Cette semaine',
  },
  {
    id: 11,
    name: 'Plaid Tisse Indigo',
    price: 68,
    image_url: '/assets/products/p11.png',
    brand: 'Textile Dakar',
    creator_name: 'Bellesansmaquillage',
    gender: 'Unisexe',
    category: 'decor',
    subcategory: 'Textiles & Literie',
    sizes: ['Unique'],
    style: 'Boheme',
    material: 'Tissu',
    tags: ['Cadeaux'],
    collections: ['Vacances'],
    recency: 'Semaine précédente',
  },
  {
    id: 12,
    name: 'Ceinture Heritage',
    price: 42,
    image_url: '/assets/products/p12.png',
    brand: 'Maison Nene',
    creator_name: 'Nene Yayah',
    gender: 'Femme',
    category: 'accessoires',
    subcategory: 'Ceintures',
    sizes: ['S', 'M', 'L'],
    material: 'Cuir',
    tags: ['Accessoires'],
    collections: ['Les essentiels'],
    recency: 'Cette semaine',
    isPromoted: true,
  },
  {
    id: 13,
    name: 'Lunettes Horizon',
    price: 78,
    image_url: '/assets/products/p3.png',
    brand: 'ByMakan',
    creator_name: 'ByMakan',
    gender: 'Homme',
    category: 'accessoires',
    subcategory: 'Lunettes',
    sizes: ['Unique'],
    material: 'Metal',
    tags: ['Tendances du moment'],
    collections: ['Vacances'],
    recency: 'Cette semaine',
  },
  {
    id: 14,
    name: 'Bijou Fin Adama',
    price: 95,
    image_url: '/assets/products/p6.png',
    brand: 'Atelier Rabbal',
    creator_name: 'Atelier Rabbal',
    gender: 'Femme',
    category: 'accessoires',
    subcategory: 'Bijoux fins',
    sizes: ['Unique'],
    material: 'Metal',
    tags: ['Bijoux'],
    collections: ['Nouvelle saison'],
    recency: 'Semaine précédente',
  },
];

/**
 * Resolve a local catalogue product by URL id. The portal catalogue uses
 * numeric ids, while route params are always strings.
 */
export function getPortalProductById(productId: number | string | null | undefined) {
  if (productId == null) return undefined;
  const localProduct = getMarketplaceProducts().find((product) => String(product.id) === String(productId));
  if (localProduct) return normalizeProduct(localProduct);
  return mockProducts.find((product) => String(product.id) === String(productId));
}

export function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/€/g, 'EUR')
    .trim()
    .toLowerCase();
}

export function normalizeProduct(raw: Record<string, unknown>): PortalProduct {
  const image = typeof raw.image_url === 'string' && raw.image_url
    ? raw.image_url
    : typeof raw.image === 'string' && raw.image
      ? raw.image
      : typeof raw.imageUrl === 'string' && raw.imageUrl
        ? raw.imageUrl
        : '/assets/products/p1.png';
  const boutique = (raw.boutique ?? raw.shop ?? raw.creator ?? (typeof raw.brand === 'object' ? raw.brand : undefined)) as Record<string, unknown> | undefined;
  const boutiqueId = raw.brandId
    ?? raw.boutique_id
    ?? raw.boutiqueId
    ?? raw.shop_id
    ?? raw.shopId
    ?? raw.creator_id
    ?? raw.creatorId
    ?? boutique?.id;
  const boutiqueName = typeof raw.boutique_name === 'string' && raw.boutique_name
    ? raw.boutique_name
    : typeof raw.boutiqueName === 'string' && raw.boutiqueName
      ? raw.boutiqueName
      : typeof raw.shop_name === 'string' && raw.shop_name
        ? raw.shop_name
        : typeof raw.shopName === 'string' && raw.shopName
        ? raw.shopName
          : typeof boutique?.name === 'string' && boutique.name
            ? boutique.name
          : undefined;
  const brand = typeof raw.brand === 'string' && raw.brand ? raw.brand : boutiqueName || 'Boutique Premium';
  const creator = typeof raw.creator_name === 'string' && raw.creator_name
    ? raw.creator_name
    : typeof raw.creatorName === 'string' && raw.creatorName
      ? raw.creatorName
      : brand;
  const rawId = raw.id;
  const id = typeof rawId === 'string' || typeof rawId === 'number' ? rawId : Date.now();
  const rawCategory = typeof raw.category === 'string'
    ? raw.category
    : typeof raw.category === 'object' && raw.category !== null
      ? String((raw.category as Record<string, unknown>).name ?? '')
      : typeof raw.categoryName === 'string'
        ? raw.categoryName
        : '';
  const categoryValue = normalizeText(rawCategory);
  const normalizedCategory = ['soin', 'soins', 'beaute', 'beauty', 'cosmetique', 'cosmetics'].includes(categoryValue)
    ? 'skincare'
    : categoryValue;
  const category = ['vetements', 'chaussures', 'decor', 'sacs', 'accessoires', 'bijoux', 'skincare'].includes(normalizedCategory)
    ? normalizedCategory as PortalProduct['category']
    : 'vetements';

  return {
    id,
    name: typeof raw.name === 'string' && raw.name ? raw.name : 'Produit Kukuza',
    description: typeof raw.description === 'string' ? raw.description : undefined,
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price ?? 0),
    image_url: image,
    brand,
    creator_name: creator,
    boutique_id: boutiqueId == null ? undefined : String(boutiqueId),
    boutique_name: boutiqueName || brand,
    category,
    subcategory: typeof raw.subcategory === 'string' && raw.subcategory ? raw.subcategory : categoryLabelMap[category],
    gender: typeof raw.gender === 'string' ? raw.gender : undefined,
    ageRange: typeof raw.ageRange === 'string'
      ? raw.ageRange
      : typeof raw.age_range === 'string'
        ? raw.age_range
        : undefined,
    sizes: Array.isArray(raw.sizes) ? raw.sizes.filter((size): size is string => typeof size === 'string') : [],
    style: typeof raw.style === 'string' ? raw.style : undefined,
    material: typeof raw.material === 'string' ? raw.material : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    collections: Array.isArray(raw.collections) ? raw.collections.filter((tag): tag is string => typeof tag === 'string') : [],
    recency: raw.recency === 'Semaine précédente' ? 'Semaine précédente' : 'Cette semaine',
    isPromoted: Boolean(raw.isPromoted),
  };
}

export function mergeMarketplaceProducts(products: PortalProduct[]): PortalProduct[] {
  const localProducts = getMarketplaceProducts().map((product: MarketplaceProductRecord) => normalizeProduct(product));
  const knownIds = new Set(localProducts.map((product) => String(product.id)));

  return [
    ...localProducts,
    ...products.filter((product) => !knownIds.has(String(product.id))),
  ];
}

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

export function groupFilters(dropdownType: DropdownType) {
  const filters = FILTERS_BY_TYPE[dropdownType];
  const grouped = filters.reduce<Record<string, FilterOption[]>>((accumulator, filter) => {
    const key = filter.category;
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(filter);
    return accumulator;
  }, {});

  const order = FILTER_CATEGORY_ORDER[dropdownType];
  if (!order) {
    return Object.entries(grouped);
  }

  return order.map((key) => [key, grouped[key] || []] as const);
}

export function getNavTitle(navType: string | null | undefined) {
  return formatFilterLabel(NAV_ITEMS.find((item) => item.navType === navType)?.title ?? 'PRODUITS');
}

export function formatFilterLabel(label: string | null | undefined) {
  if (!label) return '';
  const displayMap: Record<string, string> = {
    NOUVEAUTES: 'NOUVEAUTÉS',
    CREATEURS: 'CRÉATEURS',
    VETEMENTS: 'VÊTEMENTS',
    'DECOR ET LIFESTYLE': 'DÉCOR ET LIFESTYLE',
    ACCESSOIRES: 'ACCESSOIRES',
    PRODUITS: 'PRODUITS',
    'Cette semaine': 'Cette semaine',
    'Semaine precedente': 'Semaine précédente',
    'Les essentiels': 'Les essentiels',
    'Il fait froid dehors': 'Il fait froid dehors',
    'Selection ski': 'Sélection ski',
    Vacances: 'Vacances',
    'Tendances du moment': 'Tendances du moment',
    'Nouvelle saison': 'Nouvelle saison',
    Nouveautes: 'Nouveautés',
    Vetements: 'Vêtements',
    Categories: 'Catégories',
    Categorie: 'Catégorie',
    'Tous les vetements': 'Tous les vêtements',
    'Tous les modeles': 'Tous les modèles',
    Decoration: 'Décoration',
    Boheme: 'Bohème',
    Matiere: 'Matière',
    'Matiere: Cuir': 'Matière: Cuir',
    'Matiere: Toile': 'Matière: Toile',
    'Matiere: Synthetique': 'Matière: Synthétique',
    'Matiere: Metal': 'Matière: Métal',
    'Matiere: Tissu': 'Matière: Tissu',
    'Prix: < 30EUR': 'Prix: < 30€',
    'Prix: < 50EUR': 'Prix: < 50€',
    'Prix: 30EUR - 80EUR': 'Prix: 30€ - 80€',
    'Prix: 50EUR - 100EUR': 'Prix: 50€ - 100€',
    'Prix: 50EUR - 150EUR': 'Prix: 50€ - 150€',
    'Prix: 50EUR - 200EUR': 'Prix: 50€ - 200€',
    'Prix: > 80EUR': 'Prix: > 80€',
    'Prix: > 100EUR': 'Prix: > 100€',
    'Prix: > 150EUR': 'Prix: > 150€',
    'Prix: > 200EUR': 'Prix: > 200€',
    'Style: Boheme': 'Style: Bohème',
    'Sac a dos': 'Sac à dos',
    Echarpes: 'Écharpes',
  };

  return displayMap[label] ?? label;
}
