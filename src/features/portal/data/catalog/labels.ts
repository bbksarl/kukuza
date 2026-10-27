import type { PortalProduct } from './types';

export const categoryLabelMap: Record<PortalProduct['category'], string> = {
  vetements: 'Vetements',
  chaussures: 'Chaussures',
  decor: 'Decoration',
  sacs: 'Sacs',
  accessoires: 'Accessoires',
  bijoux: 'Bijoux',
  skincare: 'Skincare',
};

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
