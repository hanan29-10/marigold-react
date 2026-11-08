import { lazy, Suspense } from 'react';
import {
  Outlet,
  Route,
  Routes,
  useOutletContext,
  useParams,
} from 'react-router';
import { useProducts } from '../modules/products/useProducts';
import type {
  Product,
  ProductCategory,
} from '../modules/products/products.types';
import { RouteLoadingFallback } from '../shared/components/RouteLoadingFallback';
import { AppLayout } from './AppLayout';

const CartPage = lazy(() =>
  import('../pages/cart/CartPage').then((m) => ({ default: m.CartPage })),
);
const CheckoutPage = lazy(() =>
  import('../pages/checkout/CheckoutPage').then((m) => ({
    default: m.CheckoutPage,
  })),
);
const HomePage = lazy(() =>
  import('../pages/home/HomePage').then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import('../pages/login/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const SignUpPage = lazy(() =>
  import('../pages/signup/SignUpPage').then((m) => ({ default: m.SignUpPage })),
);
const NotFoundPage = lazy(() =>
  import('../pages/not-found/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  })),
);
const ProductPage = lazy(() =>
  import('../pages/product/ProductPage').then((m) => ({
    default: m.ProductPage,
  })),
);
const ShopPage = lazy(() =>
  import('../pages/shop/ShopPage').then((m) => ({ default: m.ShopPage })),
);
const WishlistPage = lazy(() =>
  import('../pages/wishlist/WishlistPage').then((m) => ({
    default: m.WishlistPage,
  })),
);

interface CatalogContext {
  products: Product[];
  categories: Array<ProductCategory | 'All'>;
}

function CatalogLayout() {
  const { products, categories, loading, error, reload } = useProducts();
  if (error)
    return (
      <AppLayout products={products} catalogReady={false}>
        <section className="page catalog-status" role="status">
          <p className="eyebrow">The collection</p>
          <h1>We could not load the collection.</h1>
          <button className="button" onClick={reload}>
            Try again <span>→</span>
          </button>
        </section>
      </AppLayout>
    );
  if (loading)
    return (
      <AppLayout products={products} catalogReady={false}>
        <section className="page catalog-status" role="status">
          <p className="eyebrow">The collection</p>
          <h1>Loading the collection.</h1>
        </section>
      </AppLayout>
    );
  return (
    <AppLayout products={products} catalogReady>
      <Outlet context={{ products, categories } satisfies CatalogContext} />
    </AppLayout>
  );
}

function ProductLayout() {
  return (
    <AppLayout products={[]} catalogReady={false}>
      <Outlet />
    </AppLayout>
  );
}
function HomeRoute() {
  const { products } = useOutletContext<CatalogContext>();
  return <HomePage products={products} />;
}
function ShopRoute() {
  const { products, categories } = useOutletContext<CatalogContext>();
  return <ShopPage products={products} categories={categories} />;
}
function WishlistRoute() {
  const { products } = useOutletContext<CatalogContext>();
  return <WishlistPage products={products} />;
}
function ProductRoute() {
  const { id = '' } = useParams();
  return <ProductPage id={id} />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route element={<CatalogLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="shop" element={<ShopRoute />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistRoute />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="product" element={<ProductLayout />}>
          <Route path=":id" element={<ProductRoute />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
