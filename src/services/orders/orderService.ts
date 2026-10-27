import { z } from 'zod';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { sessionUserSchema } from '@/api/contracts/auth';
import type { CartItem } from '@/providers/CartProvider';

const checkoutItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
});
const checkoutResponseSchema = z.object({
  id: z.number().int().positive(),
  totalAmount: z.number().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/),
});
const pendingKeys = new Map<string, { fingerprint: string; key: string }>();

const getProductId = (item: CartItem): number => {
  const id = Number(item.productId);
  if (Number.isInteger(id) && id > 0) return id;
  return Number(/^(?:product|best-seller):(\d+)(?::|$)/.exec(item.id)?.[1]);
};

/** Même panier et même compte : même clé après un timeout ou un rechargement. */
const getAttemptKey = (scope: string, fingerprint: string): string => {
  let previous = pendingKeys.get(scope);
  try {
    const stored = window.sessionStorage.getItem(scope);
    if (stored) {
      const parsed = z.object({ fingerprint: z.string(), key: z.string().uuid() }).safeParse(JSON.parse(stored));
      if (parsed.success) previous = parsed.data;
    }
  } catch { /* L'état mémoire couvre les navigateurs sans stockage. */ }
  const attempt = previous?.fingerprint === fingerprint
    ? previous : { fingerprint, key: crypto.randomUUID() };
  pendingKeys.set(scope, attempt);
  try { window.sessionStorage.setItem(scope, JSON.stringify(attempt)); } catch { /* Mémoire uniquement. */ }
  return attempt.key;
};

export async function createOrder(items: CartItem[]): Promise<z.infer<typeof checkoutResponseSchema>> {
  if (items.length === 0) throw new Error('Votre panier est vide.');
  const result = z.array(checkoutItemSchema).safeParse(items.map((item) => ({
    productId: getProductId(item), quantity: item.quantity, size: item.size, color: item.color,
  })));
  if (!result.success) throw new Error('Un produit ou une quantité du panier est invalide.');
  const orderItems = result.data.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  let userId: number;
  try {
    const user = sessionUserSchema.parse(await facadeClient.get<unknown>('/Auth/me', { skipRedirect: true }));
    userId = user.id;
  } catch (error) {
    if (error instanceof FacadeHttpError && error.status === 401) {
      throw new Error('Connectez-vous pour finaliser votre commande.', { cause: error });
    }
    throw error;
  }
  const scope = `kukuza-checkout:${userId}`;
  const key = getAttemptKey(scope, JSON.stringify(orderItems));
  const response = checkoutResponseSchema.parse(await facadeClient.post<unknown>('/Order/checkout', {
    items: orderItems,
  }, { headers: { 'Idempotency-Key': key }, skipRedirect: true }));
  pendingKeys.delete(scope);
  try { window.sessionStorage.removeItem(scope); } catch { /* Mémoire uniquement. */ }
  return response;
}
