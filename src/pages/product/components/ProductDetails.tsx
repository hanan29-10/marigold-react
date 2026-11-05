import { useState } from 'react';
import { useCart } from '../../../features/cart/CartProvider';
import { money } from '../../../features/products/products.format';
import type { Product } from '../../../features/products/products.types';
export function ProductDetails({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  return (
    <section className="page product-detail">
      <a className="back" href="#/shop">
        ← Back to shop
      </a>
      <img src={product.image} alt={product.name} />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <strong className="price">{money(product.price)}</strong>
        <p>{product.description}</p>
        <label className="quantity-label">
          Quantity{' '}
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          >
            {[1, 2, 3, 4].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button className="button" onClick={() => add(product, quantity)}>
          Add to bag <span>→</span>
        </button>
      </div>
    </section>
  );
}
