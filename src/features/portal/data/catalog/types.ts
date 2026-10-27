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
