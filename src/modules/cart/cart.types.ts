import type { Product } from '../products/products.types';

export interface CartItem {
  product: Product;
  quantity: number;
}
