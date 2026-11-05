import type {
  Product,
  ProductCategory,
} from '../features/products/products.types';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { HomePage } from '../pages/home/HomePage';
import { ProductPage } from '../pages/product/ProductPage';
import { ShopPage } from '../pages/shop/ShopPage';
import { WishlistPage } from '../pages/wishlist/WishlistPage';

export interface AppRoutesProps {
  route: string;
  products: Product[];
  categories: Array<ProductCategory | 'All'>;
}

export function AppRoutes({ route, products, categories }: AppRoutesProps) {
  if (route === '/shop')
    return <ShopPage products={products} categories={categories} />;
  if (route === '/cart') return <CartPage />;
  if (route === '/checkout') return <CheckoutPage />;
  if (route === '/wishlist') return <WishlistPage products={products} />;
  if (route.startsWith('/product/'))
    return (
      <ProductPage
        product={products.find((product) => product.id === route.split('/')[2])}
      />
    );
  return <HomePage products={products} />;
}
