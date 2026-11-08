import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { CartProvider } from '../modules/cart/CartProvider';
import { CartDrawer } from '../modules/cart/components/CartDrawer';
import type { Product } from '../modules/products/products.types';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { useScrollReveal } from '../shared/useScrollReveal';

interface AppLayoutProps {
  products: Product[];
  catalogReady: boolean;
  children?: ReactNode;
}

export function AppLayout({
  products,
  catalogReady,
  children,
}: AppLayoutProps) {
  const contentRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useScrollReveal(contentRef);
  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen);
    return () => document.body.classList.remove('drawer-open');
  }, [drawerOpen]);

  return (
    <CartProvider products={products} catalogReady={catalogReady}>
      <Header onBagOpen={() => setDrawerOpen(true)} />
      <main ref={contentRef} className="page-transition">
        <ErrorBoundary resetKey={useLocation().pathname}>
          {children ?? <Outlet />}
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </CartProvider>
  );
}
