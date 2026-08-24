export type BestSellerColor = {
  name: string;
  hex: string;
  image?: string;
};

export type BestSellerItem = {
  id: number;
  slug: string;
  src: string;
  alt: string;
  title: string;
  titleKey: string;
  price: string;
  oldPrice: string;
  category: string;
  categoryKey: string;
  description: string;
  descriptionKey: string;
  shippingNote: string;
  shippingKey: string;
  colors: BestSellerColor[];
  sizes: string[];
  featured?: boolean;
};

export const bestSellers: BestSellerItem[] = [
  {
    id: 1,
    slug: 'elegance-streetwear',
    src: '/assets/mVentes/im2.png',
    alt: 'Tenue streetwear noir et blanc',
    title: 'Elegance Streetwear',
    titleKey: 'bestSellers.eleganceStreetwear.title',
    price: '69,99 EUR',
    oldPrice: '79,00 EUR',
    category: 'Nouveaute',
    categoryKey: 'bestSellers.eleganceStreetwear.category',
    description:
      "Silhouette urbaine structuree avec une allure effortless. Cette tenue streetwear mixe coupe nette, details modernes et confort premium pour accompagner les journees actives comme les sorties du soir.",
    descriptionKey: 'bestSellers.eleganceStreetwear.description',
    shippingNote: "Frais d'expedition calcules a l'etape de paiement.",
    shippingKey: 'bestSellers.shipping',
    colors: [
      { name: 'Noir', hex: '#18181b' },
      { name: 'Blanc casse', hex: '#e7e5e4' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    slug: 'robe-porte-feuille',
    src: '/assets/mVentes/im1.png',
    alt: 'Robe rouge elegante',
    title: 'Robe Porte-Feuille',
    titleKey: 'bestSellers.wrapDress.title',
    price: '129,00 EUR',
    oldPrice: '89,00 EUR',
    category: 'Best seller',
    categoryKey: 'bestSellers.wrapDress.category',
    description:
      "Robe longue elegante au drape sophistique, sublimee par un decollete drape, un col choker moderne et une fente frontale qui allonge la silhouette. Sa coupe ajustee epouse les formes avec raffinement, ideale pour les soirees, evenements ou occasions speciales.",
    descriptionKey: 'bestSellers.wrapDress.description',
    shippingNote: "Frais d'expedition calcules a l'etape de paiement.",
    shippingKey: 'bestSellers.shipping',
    colors: [
      { name: 'Rouge bordeaux', hex: '#7d1117', image: '/assets/mVentes/im1.png' },
      { name: 'Noir intense', hex: '#171717', image: '/assets/mVentes/im1-noir.png' },
    ],
    sizes: ['XL', 'S', 'M', 'L'],
    featured: true,
  },
  {
    id: 3,
    slug: 'caftan-luxe',
    src: '/assets/mVentes/im3.png',
    alt: 'Caftan raye multicolore',
    title: 'Caftan Luxe',
    titleKey: 'bestSellers.luxuryKaftan.title',
    price: '89,90 EUR',
    oldPrice: '99,90 EUR',
    category: 'Edition limitee',
    categoryKey: 'bestSellers.luxuryKaftan.category',
    description:
      "Piece signature au tombe fluide et aux rayures lumineuses. Ce caftan apporte une presence elegante et artisanale, parfait pour des moments festifs ou une allure resort tres chic.",
    descriptionKey: 'bestSellers.luxuryKaftan.description',
    shippingNote: "Frais d'expedition calcules a l'etape de paiement.",
    shippingKey: 'bestSellers.shipping',
    colors: [
      { name: 'Sable', hex: '#c08457' },
      { name: 'Bleu nuit', hex: '#1d4ed8' },
    ],
    sizes: ['M', 'L', 'XL'],
  },
];

export const getBestSellerBySlug = (slug: string) =>
  bestSellers.find((item) => item.slug === slug);

export const defaultBestSeller = bestSellers.find((item) => item.featured) ?? bestSellers[0];
