import type { User } from './entities/User';

export interface BoutiqueProfileData {
  shopName: string;
  address: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  description: string;
  logo?: File | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  isBoutique?: boolean;
  boutique?: BoutiqueProfileData;
}

export interface AuthResult {
  user: User;
  role: User['role'];
  redirectUrl?: string;
}
