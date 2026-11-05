import { useWishlist } from '../../features/wishlist/WishlistProvider';
import { ProductCard } from '../../features/products/ProductCard';
import type { Product } from '../../features/products/products.types';

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
          <a href="#/shop">Explore the collection.</a>
        </p>
      )}
    </section>
  );
}
