import type { ReactNode } from 'react';
import { CartProvider } from '../features/cart/CartProvider';
import { WishlistProvider } from '../features/wishlist/WishlistProvider';
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
