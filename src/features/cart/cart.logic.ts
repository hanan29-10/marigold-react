import type { Product } from '../products/products.types';
import type { Cart } from './cart.types';

export const getCartCount = (cart: Cart) =>
  cart.reduce((total, item) => total + item.quantity, 0);

export const getCartTotal = (cart: Cart) =>
  cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const addToCart = (cart: Cart, product: Product, quantity = 1): Cart => {
  if (!Number.isInteger(quantity) || quantity < 1) return cart;
  const existing = cart.find((item) => item.product.id === product.id);
  return existing
    ? cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...cart, { product, quantity }];
};

export const updateQuantity = (
  cart: Cart,
  id: string,
  quantity: number,
): Cart => {
  if (!Number.isInteger(quantity)) return cart;
  return cart
    .map((item) => (item.product.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
};

export const removeFromCart = (cart: Cart, id: string): Cart =>
  cart.filter((item) => item.product.id !== id);

export const clearCart = (): Cart => [];
