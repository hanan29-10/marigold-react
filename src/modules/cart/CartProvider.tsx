import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addToCart,
  clearCart,
  removeUnavailableItems,
  removeFromCart,
  resolveCartItems,
  updateQuantity,
} from './cart.logic';
import type { ResolvedCartItem } from './cart.logic';
import { loadCart, saveCart } from './cart.state';
import type { Cart } from './cart.types';
import type { Product } from '../products/products.types';

interface CartContextValue {
  cart: Cart;
  items: ResolvedCartItem[];
  add: (productId: string, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}
const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  products: Product[];
  catalogReady: boolean;
}

export function CartProvider({
  children,
  products,
  catalogReady,
}: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(() => loadCart());
  const items = useMemo(
    () => resolveCartItems(cart, products),
    [cart, products],
  );
  useEffect(() => saveCart(cart), [cart]);
  useEffect(() => {
    if (!catalogReady) return;
    setCart((current) => removeUnavailableItems(current, products));
  }, [catalogReady, products]);
  const value: CartContextValue = {
    cart,
    items,
    add: (productId, quantity) =>
      setCart((current) => addToCart(current, productId, quantity)),
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
