import type { ReactNode } from 'react';
import { WishlistProvider } from '../modules/wishlist/WishlistProvider';
export function AppProviders({ children }: { children: ReactNode }) {
  return <WishlistProvider>{children}</WishlistProvider>;
}
