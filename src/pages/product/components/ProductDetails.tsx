import { useState } from 'react';
import { useCart } from '../../../modules/cart/CartProvider';
import { MAX_CART_ITEM_QUANTITY } from '../../../modules/cart/cart.types';
import { money } from '../../../modules/products/products.format';
import type { Product } from '../../../modules/products/products.types';

export function ProductDetails({ product }: { product: Product }) {
  const { add, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const quantityInCart =
    cart.find((item) => item.id === product.id)?.quantity ?? 0;
  const isCartFull = quantityInCart >= MAX_CART_ITEM_QUANTITY;

  return (
    <section className="page product-detail">
      <a className="back" href="/shop">
        ← Back to shop
      </a>
      <img src={product.image} alt={product.name} />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <strong className="price">{money(product.price)}</strong>
        <p>{product.description}</p>
        <div className="quantity-control">
          <span className="quantity-label">Quantity</span>
          <div className="quantity-stepper">
            <button
              type="button"
              onClick={() => setQuantity((current) => current - 1)}
              disabled={quantity === 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <output aria-live="polite" aria-label={`Quantity: ${quantity}`}>
              {quantity}
            </output>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              disabled={quantity === MAX_CART_ITEM_QUANTITY}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="quantity-maximum">(Max 10)</span>
        </div>
        <button
          className="button"
          onClick={() => add(product.id, quantity)}
          disabled={isCartFull}
        >
          Add to bag <span>→</span>
        </button>
      </div>
    </section>
  );
}
