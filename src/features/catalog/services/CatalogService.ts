/**
 * CatalogService - Appelle catalog-service API
 * Gère les produits, catégories, images
 */

import { facadeClient } from '@/api/client';

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

    return facadeClient.get<{ products: Product[]; total: number }>(
      `/catalog/products?${params.toString()}`
    );
  }

  /**
   * Récupérer un produit par ID
   */
  async getProductById(productId: string) {
    const response = await facadeClient.get<{ product: Product }>(
      `/catalog/products/${productId}`
    );
    return response.product;
  }

  /**
   * Récupérer les catégories
   */
  async getCategories() {
    const response = await facadeClient.get<{ categories: Category[] }>(
      '/catalog/categories'
    );
    return response.categories;
  }

  /**
   * Récupérer les avis d'un produit
   */
  async getProductReviews(productId: string) {
    const response = await facadeClient.get<{ reviews: Review[] }>(
      `/catalog/products/${productId}/reviews`
    );
    return response.reviews;
  }

  /**
   * Créer un avis (nécessite authentification)
   */
  async createReview(productId: string, data: {
    rating: number;
    content: string;
  }) {
    const response = await facadeClient.post<{ review: Review }>(
      `/catalog/products/${productId}/reviews`,
      data
    );
    return response.review;
  }

  /**
   * Rechercher des produits
   */
  async searchProducts(query: string) {
    const response = await facadeClient.get<{ products: Product[] }>(
      `/catalog/products/search?q=${encodeURIComponent(query)}`
    );
    return response.products;
  }
}

export const catalogService = new CatalogService();
export default CatalogService;
