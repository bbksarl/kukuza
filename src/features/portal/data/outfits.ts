export type OutfitImage = {
  src: string;
  altKey: string;
};

export type Outfit = {
  id: 'femme' | 'homme';
  titleKey: string;
  descriptionKey: string;
  images: [OutfitImage, OutfitImage, OutfitImage];
};

export const outfits: Outfit[] = [
  {
    id: 'femme',
    titleKey: 'sections.femaleOutfitTitle',
    descriptionKey: 'sections.femaleOutfitDescription',
    images: [
      { src: '/assets/outfit/im3.webp', altKey: 'outfit.female.sandals' },
      { src: '/assets/outfit/im2.webp', altKey: 'outfit.female.bag' },
      { src: '/assets/outfit/im1.webp', altKey: 'outfit.female.dress' },
    ],
  },
  {
    id: 'homme',
    titleKey: 'sections.maleOutfitTitle',
    descriptionKey: 'sections.maleOutfitDescription',
    images: [
      { src: '/assets/outfit/im4.webp', altKey: 'outfit.male.sandals' },
      { src: '/assets/outfit/im5.webp', altKey: 'outfit.male.bag' },
      { src: '/assets/outfit/im6.webp', altKey: 'outfit.male.look' },
    ],
  },
];

export function getOutfitById(id: string | undefined) {
  return outfits.find((outfit) => outfit.id === id);
}
