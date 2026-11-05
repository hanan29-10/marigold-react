import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from './cart.logic';
import { loadCart, saveCart } from './cart.state';
import type { Cart } from './cart.types';
import type { Product } from '../products/products.types';

interface CartContextValue {
  cart: Cart;
  add: (product: Product, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => loadCart());
  useEffect(() => saveCart(cart), [cart]);
  const value: CartContextValue = {
    cart,
    add: (product, quantity) =>
      setCart((current) => addToCart(current, product, quantity)),
    update: (id, quantity) =>
      setCart((current) => updateQuantity(current, id, quantity)),
    remove: (id) => setCart((current) => removeFromCart(current, id)),
    clear: () => setCart(clearCart()),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('Cart context is unavailable.');
  return context;
}
