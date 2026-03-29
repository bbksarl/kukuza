/**
 * CatalogService - Appelle catalog-service API
 * Gère les produits, catégories, images
 */

import { httpClient } from '@libs/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  creatorId: string;
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

class CatalogService {
  /**
   * Récupérer tous les produits
   */
  async getProducts(filters?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await httpClient.get<{ products: Product[]; total: number }>(
      `/products?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(response.error || 'Impossible de charger les produits');
    }

    return response.data;
  }

  /**
   * Récupérer un produit par ID
   */
  async getProductById(productId: string) {
    const response = await httpClient.get<{ product: Product }>(
      `/products/${productId}`
    );

    if (!response.ok) {
      throw new Error(response.error || 'Produit non trouvé');
    }

    return response.data.product;
  }

  /**
   * Récupérer les catégories
   */
  async getCategories() {
    const response = await httpClient.get<{ categories: Category[] }>(
      '/categories'
    );

    if (!response.ok) {
      throw new Error(response.error || 'Impossible de charger les catégories');
    }

    return response.data.categories;
  }

  /**
   * Récupérer les avis d'un produit
   */
  async getProductReviews(productId: string) {
    const response = await httpClient.get<{ reviews: Review[] }>(
      `/products/${productId}/reviews`
    );

    if (!response.ok) {
      throw new Error(response.error || 'Impossible de charger les avis');
    }

    return response.data.reviews;
  }

  /**
   * Créer un avis (nécessite authentification)
   */
  async createReview(productId: string, data: {
    rating: number;
    content: string;
  }) {
    const response = await httpClient.post<{ review: Review }>(
      `/products/${productId}/reviews`,
      data
    );

    if (!response.ok) {
      throw new Error(response.error || 'Impossible de créer l\'avis');
    }

    return response.data.review;
  }

  /**
   * Rechercher des produits
   */
  async searchProducts(query: string) {
    const response = await httpClient.get<{ products: Product[] }>(
      `/products/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(response.error || 'Recherche échouée');
    }

    return response.data.products;
  }
}

export const catalogService = new CatalogService();
export default CatalogService;
