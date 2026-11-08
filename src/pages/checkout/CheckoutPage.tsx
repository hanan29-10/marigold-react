import { useCart } from '../../modules/cart/CartProvider';
import { getCartTotal } from '../../modules/cart/cart.logic';
import { money } from '../../modules/products/products.format';
import { CheckoutForm } from './components/CheckoutForm';
export function CheckoutPage() {
  const { items, clear } = useCart();
  if (!items.length)
    return (
      <section className="page">
        <h1>Your bag is empty</h1>
        <a href="/shop">Go shopping</a>
      </section>
    );
  return (
    <section className="page checkout">
      <div>
        <p className="eyebrow">Secure checkout</p>
        <h1>Your details</h1>
        <CheckoutForm onComplete={clear} />
      </div>
      <aside className="summary">
        <h2>Order summary</h2>
        {items.map(({ product, quantity }) => (
          <p key={product.id}>
            {product.name} × {quantity}{' '}
            <strong>{money(product.price * quantity)}</strong>
          </p>
        ))}
        <div>
          <span>Total</span>
          <strong>{money(getCartTotal(items))}</strong>
        </div>
      </aside>
    </section>
  );
}
