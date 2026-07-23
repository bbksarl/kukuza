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
      { src: '/assets/outfit/im3.png', altKey: 'outfit.female.sandals' },
      { src: '/assets/outfit/im2.png', altKey: 'outfit.female.bag' },
      { src: '/assets/outfit/im1.png', altKey: 'outfit.female.dress' },
    ],
  },
  {
    id: 'homme',
    titleKey: 'sections.maleOutfitTitle',
    descriptionKey: 'sections.maleOutfitDescription',
    images: [
      { src: '/assets/outfit/im4.png', altKey: 'outfit.male.sandals' },
      { src: '/assets/outfit/im5.png', altKey: 'outfit.male.bag' },
      { src: '/assets/outfit/im6.png', altKey: 'outfit.male.look' },
    ],
  },
];

export function getOutfitById(id: string | undefined) {
  return outfits.find((outfit) => outfit.id === id);
}
