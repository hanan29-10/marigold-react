import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { CartDrawer } from '../features/cart/CartDrawer';
import { useProducts } from '../features/products/useProducts';
import type {
  Product,
  ProductCategory,
} from '../features/products/products.types';
import { useHashRoute } from '../shared/useHashRoute';
import { useScrollReveal } from '../shared/useScrollReveal';
import { AppRoutes } from './AppRoutes';

interface ApplicationContentProps {
  products: Product[];
  categories: Array<ProductCategory | 'All'>;
  loading: boolean;
  error: boolean;
  reload: () => void;
  route: string;
}

function ApplicationContent({
  products,
  categories,
  loading,
  error,
  reload,
  route,
}: ApplicationContentProps): ReactNode {
  if (error)
    return (
      <section className="page catalog-status" role="status">
        <p className="eyebrow">The collection</p>
        <h1>We could not load the collection.</h1>
        <button className="button" onClick={reload}>
          Try again <span>→</span>
        </button>
      </section>
    );
  if (loading)
    return (
      <section className="page catalog-status" role="status">
        <p className="eyebrow">The collection</p>
        <h1>Loading the collection.</h1>
      </section>
    );
  return (
    <AppRoutes route={route} products={products} categories={categories} />
  );
}

export function App(): ReactNode {
  const contentRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const route = useHashRoute();
  const { products, categories, loading, error, reload } = useProducts();

  useScrollReveal(contentRef);
  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen);
    return () => document.body.classList.remove('drawer-open');
  }, [drawerOpen]);

  return (
    <>
      <Header onBagOpen={() => setDrawerOpen(true)} />
      <main ref={contentRef} className="page-transition">
        <ApplicationContent
          products={products}
          categories={categories}
          loading={loading}
          error={error}
          reload={reload}
          route={route}
        />
      </main>
      <Footer />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
