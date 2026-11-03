/** Public shopping-bag API. Persistence and state remain module internals. */
export {
  addToCart,
  clearCart,
  getCart,
  getCartCount,
  getCartTotal,
  removeFromCart,
  updateQuantity,
} from './cart.logic';
export { cartDrawer } from './cart.ui';
export type { CartItem } from './cart.types';
