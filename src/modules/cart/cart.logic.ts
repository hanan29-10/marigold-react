import type { Product } from '../products/products.types';
import { MAX_CART_ITEM_QUANTITY, type Cart } from './cart.types';

export interface ResolvedCartItem {
  product: Product;
  quantity: number;
}

export const getCartCount = (cart: Cart) =>
  cart.reduce((total, item) => total + item.quantity, 0);

export const getCartTotal = (items: ResolvedCartItem[]) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const resolveCartItems = (
  cart: Cart,
  products: Product[],
): ResolvedCartItem[] =>
  cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

export const removeUnavailableItems = (cart: Cart, products: Product[]): Cart =>
  cart.filter((item) => products.some((product) => product.id === item.id));

export const addToCart = (
  cart: Cart,
  productId: string,
  quantity = 1,
): Cart => {
  if (!Number.isInteger(quantity) || quantity < 1) return cart;
  const quantityToAdd = Math.min(quantity, MAX_CART_ITEM_QUANTITY);
  const existing = cart.find((item) => item.id === productId);
  return existing
    ? cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + quantityToAdd,
                MAX_CART_ITEM_QUANTITY,
              ),
            }
          : item,
      )
    : [...cart, { id: productId, quantity: quantityToAdd }];
};

export const updateQuantity = (
  cart: Cart,
  id: string,
  quantity: number,
): Cart => {
  if (!Number.isInteger(quantity)) return cart;
  return cart
    .map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(quantity, MAX_CART_ITEM_QUANTITY) }
        : item,
    )
    .filter((item) => item.quantity > 0);
};

export const removeFromCart = (cart: Cart, id: string): Cart =>
  cart.filter((item) => item.id !== id);

export const clearCart = (): Cart => [];
