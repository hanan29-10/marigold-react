import { loadCart, saveCart } from './storage.js';
let cart = loadCart();
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
export function addToCart(product, quantity = 1) {
  if (!product || !Number.isInteger(quantity) || quantity < 1) return;

  const current = cart.find((item) => item.product.id === product.id);
  if (current) current.quantity += quantity;
  else cart.push({ product, quantity });
  saveCart(cart);
  notify();
}
export function updateQuantity(id, quantity) {
  cart = cart
    .map((item) => (item.product.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  notify();
}
export function removeFromCart(id) {
  cart = cart.filter((item) => item.product.id !== id);
  saveCart(cart);
  notify();
}
export function clearCart() {
  cart = [];
  saveCart(cart);
  notify();
}
