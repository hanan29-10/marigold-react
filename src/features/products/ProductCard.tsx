import { useCart } from '../cart/CartProvider';
import { useWishlist } from '../wishlist/WishlistProvider';
import { money } from './products.format';
import type { Product } from './products.types';
export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const { savedIds, toggle } = useWishlist();
  const saved = savedIds.includes(product.id);
  return (
    <article className="product-card reveal">
      <div className="product-image">
        <a href={`#/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            className="product-image-primary"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
          <img
            className="product-image-secondary"
            src={product.secondaryImage || product.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </a>
        <span>{product.badge}</span>
        <button
          className={`wishlist-button${saved ? ' saved' : ''}`}
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={`Save ${product.name}`}
          aria-pressed={saved}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-info">
        <p>{product.category}</p>
        <h3>
          <a href={`#/product/${product.id}`}>{product.name}</a>
        </h3>
        <div className="product-meta">
          <strong>{money(product.price)}</strong>
          <button
            className="text-button"
            type="button"
            onClick={() => add(product)}
          >
            Add to bag <span>→</span>
          </button>
        </div>
      </div>
    </article>
  );
}
