import type { Product } from '../../../modules/products/products.types';
import { ProductCard } from '../../../modules/products/components/ProductCard';
export interface ProductGridProps {
  products: Product[];
}
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.length ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="empty">No products match your search.</p>
      )}
    </div>
  );
}
