import type { Product } from '../../features/products/products.types';
import { ProductDetails } from './components/ProductDetails';
export function ProductPage({ product }: { product?: Product }) {
  return product ? (
    <ProductDetails product={product} />
  ) : (
    <section className="page">
      <h1>Product not found</h1>
      <a href="#/shop">Return to shop</a>
    </section>
  );
}
