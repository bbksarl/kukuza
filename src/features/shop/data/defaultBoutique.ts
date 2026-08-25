/**
 * Profil utilisé lorsque l'API boutique n'a pas encore renvoyé le profil réel.
 *
 * Il s'agit uniquement d'une donnée de démonstration côté frontend. Le profil
 * sera remplacé par la réponse du service C# dès que celui-ci sera disponible.
 */
export interface BoutiqueProfile {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  initials: string;
  logo?: string;
  status: 'active' | 'pending' | 'suspended';
}

export const DEFAULT_BOUTIQUE: Readonly<BoutiqueProfile> = Object.freeze({
  id: 'boutique-default',
  name: 'Abdoulaye Diallo',
  ownerName: 'Abdoulaye Diallo',
  ownerEmail: import.meta.env.VITE_DEFAULT_BOUTIQUE_EMAIL ?? 'Abdoulaye Diallo',
  initials: 'AD',
  logo: '/assets/logo.png',
  status: 'active',
});
