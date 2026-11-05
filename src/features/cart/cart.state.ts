import type { Product } from '../products/products.types';
import type { Cart, CartItem } from './cart.types';

const CART_KEY = 'marigold-cart';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  const product = value;
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.badge === 'string' &&
    typeof product.image === 'string' &&
    typeof product.description === 'string' &&
    (product.secondaryImage === undefined ||
      typeof product.secondaryImage === 'string')
  );
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!isRecord(item)) return false;
  const cartItem = item;
  return (
    isProduct(cartItem.product) &&
    typeof cartItem.quantity === 'number' &&
    Number.isInteger(cartItem.quantity) &&
    cartItem.quantity > 0
  );
}

export function loadCart(): Cart {
  try {
    const storedCart: unknown = JSON.parse(
      localStorage.getItem(CART_KEY) || '[]',
    );
    if (!Array.isArray(storedCart)) return [];

    const cart = storedCart.filter(isValidCartItem);
    if (cart.length !== storedCart.length) saveCart(cart);
    return cart;
  } catch {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // The bag can still work for this visit if browser storage is unavailable.
    }
    return [];
  }
}
export function saveCart(cart: Cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Keep the cart in memory when private browsing or storage limits block saving.
  }
}
