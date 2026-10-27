import type { DropdownType, FilterOption, NavItem } from './types';
import { formatFilterLabel } from './labels';

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
