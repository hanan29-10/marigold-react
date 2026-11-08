import type { Product } from '../../../modules/products/products.types';
import { ProductCard } from '../../../modules/products/components/ProductCard';
export interface FeaturedProductsProps {
  title: string;
  eyebrow: string;
  products: Product[];
  className?: string;
}
export function FeaturedProducts({
  title,
  eyebrow,
  products,
  className = '',
}: FeaturedProductsProps) {
  return (
    <section className={`catalog editorial-products ${className}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
