/**
 * CatalogService - Appelle catalog-service API
 * Gère les produits, catégories, images
 */

import { facadeClient } from '@/api/client';
import { getProducts, getProduct, getCategories } from '@/repositories/portal/catalogRepository';
import type { ProductDto, ProductQuery } from '@/api/contracts/catalog';
import { getStoredUserId } from '@/core/auth/sessionStorage';

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
  boutiqueId?: string;
  boutiqueName?: string;
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
  private mapCoreProduct(product: ProductDto): Product {
    const id = product.id == null ? '' : String(product.id);
    const boutiqueId = product.brandId ?? product.creatorId;
    const boutiqueName = product.brand?.name;
    return {
      id,
      name: product.name ?? 'Produit Kukuza',
      description: product.description ?? '',
      price: product.price ?? 0,
      image: product.imageUrl ?? '',
      categoryId: product.categoryId == null ? '' : String(product.categoryId),
      creatorId: product.creatorId == null ? '' : String(product.creatorId),
      rating: product.averageRating ?? 0,
      reviewCount: product.reviewCount ?? 0,
      boutiqueId: boutiqueId == null ? undefined : String(boutiqueId),
      boutiqueName,
    };
  }

  /**
   * Récupérer tous les produits
   */
  async getProducts(filters: ProductQuery & { page?: number; limit?: number } = {}, signal?: AbortSignal) {
    const { page = 1, limit = 20, ...query } = filters;
    const response = await getProducts(page, limit, signal, query);
    return { products: response.items.map((product) => this.mapCoreProduct(product)), total: response.total, limit: response.limit };
  }

  /**
   * Récupérer un produit par ID
   */
  async getProductById(productId: string, signal?: AbortSignal) {
    const response = await getProduct(productId, signal);
    return this.mapCoreProduct(response);
  }

  /**
   * Récupérer les catégories
   */
  async getCategories() {
    return (await getCategories()).map((category) => ({ ...category, id: String(category.id) }));
  }

  /**
   * Récupérer les avis d'un produit
   */
  async getProductReviews(productId: string) {
    const response = await facadeClient.get<Array<Record<string, unknown>>>(
      `/ProductReview/product/${productId}`
    );
    return response.map((review) => ({
      id: String(review.id ?? ''),
      productId: String(review.productId ?? productId),
      userId: String(review.userId ?? ''),
      userName: typeof (review.user as Record<string, unknown> | undefined)?.username === 'string'
        ? String((review.user as Record<string, unknown>).username)
        : 'Utilisateur',
      rating: Number(review.rating ?? 0),
      content: typeof review.comment === 'string' ? review.comment : '',
      createdAt: String(review.createdAt ?? ''),
    }));
  }

  /**
   * Créer un avis (nécessite authentification)
   */
  async createReview(productId: string, data: {
    rating: number;
    content: string;
  }) {
    const userId = getStoredUserId();
    if (userId == null) throw new Error('Vous devez être connecté pour laisser un avis.');
    const response = await facadeClient.post<Record<string, unknown>>('/Review', {
      productId: Number(productId),
      userId,
      rating: data.rating,
      comment: data.content,
    });
    return {
      id: String(response.id ?? ''),
      productId: String(response.productId ?? productId),
      userId: String(response.userId ?? userId),
      userName: 'Utilisateur',
      rating: Number(response.rating ?? data.rating),
      content: typeof response.comment === 'string' ? response.comment : data.content,
      createdAt: String(response.createdAt ?? new Date().toISOString()),
    };
  }

  /**
   * Rechercher des produits
   */
  async searchProducts(query: string) {
    const response = await this.getProducts({ search: query });
    return response.products;
  }
}

export const catalogService = new CatalogService();
export default CatalogService;
