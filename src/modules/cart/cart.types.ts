export const MAX_CART_ITEM_QUANTITY = 10;

export interface CartItem {
  id: string;
  quantity: number;
}

/** The persisted and in-memory shopping bag collection. */
export type Cart = CartItem[];
