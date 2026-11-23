import { inject, Injectable } from '@angular/core';
import { z } from 'zod';
import { ApiClient } from '../core/api-client.service';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

const reviewSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  productId: z.union([z.string(), z.number()]).transform(String).optional(),
  userId: z.union([z.string(), z.number()]).transform(String).optional(),
  user: z.object({ username: z.string().optional() }).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  createdAt: z.string().optional(),
});

@Injectable({ providedIn: 'root' })
export class ReviewsDataService {
  private readonly api = inject(ApiClient);

  async list(productId: string): Promise<ProductReview[]> {
    const response = z
      .array(reviewSchema)
      .parse(await this.api.get(`/ProductReview/product/${encodeURIComponent(productId)}`));
    return response.map((review) => ({
      id: review.id,
      productId: review.productId ?? productId,
      userId: review.userId ?? '',
      userName: review.user?.username ?? 'Utilisateur',
      rating: review.rating,
      content: review.comment,
      createdAt: review.createdAt ?? '',
    }));
  }

  async create(productId: string, value: { rating: number; content: string }): Promise<ProductReview> {
    const review = reviewSchema.parse(
      await this.api.post('/Review', {
        productId: Number(productId),
        rating: value.rating,
        comment: value.content.trim(),
      }),
    );
    return {
      id: review.id,
      productId: review.productId ?? productId,
      userId: review.userId ?? '',
      userName: review.user?.username ?? 'Utilisateur',
      rating: review.rating,
      content: review.comment,
      createdAt: review.createdAt ?? new Date().toISOString(),
    };
  }
}
