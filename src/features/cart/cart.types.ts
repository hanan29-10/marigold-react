import type { Product } from '../products/products.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

/** The persisted and in-memory shopping bag collection. */
export type Cart = CartItem[];
