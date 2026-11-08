import { ProductCard } from '../../modules/products/components/ProductCard';
import { useWishlist } from '../../modules/wishlist/WishlistProvider';
import type { Product } from '../../modules/products/products.types';

interface WishlistPageProps {
  products: Product[];
}

export function WishlistPage({ products }: WishlistPageProps) {
  const { savedIds } = useWishlist();
  const savedProducts = products.filter((product) =>
    savedIds.includes(product.id),
  );

  return (
    <section className="page">
      <p className="eyebrow">Your edit</p>
      <h1>Saved pieces</h1>
      {savedProducts.length ? (
        <div className="product-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="empty">
          Your saved edit is waiting.{' '}
          <a href="/shop">Explore the collection.</a>
        </p>
      )}
    </section>
  );
}
