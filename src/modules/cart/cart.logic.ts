import { loadCart, saveCart } from './cart.state';
import type { Product } from '../products';
import type { Cart } from './cart.types';
let cart: Cart = loadCart();
const notify = () =>
  document.dispatchEvent(
    new CustomEvent('cart:updated', { detail: getCart() }),
  );
export const getCart = () => [...cart];
export const getCartCount = () =>
  cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
export const getCartTotal = () =>
  cart.reduce(
    (total, item) => total + Number(item.product.price || 0) * item.quantity,
    0,
  );
export function addToCart(product: Product, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1) return;

  const current = cart.find((item) => item.product.id === product.id);
  if (current) current.quantity += quantity;
  else cart.push({ product, quantity });
  saveCart(cart);
  notify();
}
export function updateQuantity(id: string, quantity: number) {
  cart = cart
    .map((item) => (item.product.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  notify();
}
export function removeFromCart(id: string) {
  cart = cart.filter((item) => item.product.id !== id);
  saveCart(cart);
  notify();
}
export function clearCart() {
  cart = [];
  saveCart(cart);
  notify();
}
