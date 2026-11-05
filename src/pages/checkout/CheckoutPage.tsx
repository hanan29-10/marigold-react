import { useCart } from '../../features/cart/CartProvider';
import { getCartTotal } from '../../features/cart/cart.logic';
import { money } from '../../features/products/products.format';
import { CheckoutForm } from './components/CheckoutForm';
export function CheckoutPage() {
  const { cart, clear } = useCart();
  if (!cart.length)
    return (
      <section className="page">
        <h1>Your bag is empty</h1>
        <a href="#/shop">Go shopping</a>
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
        {cart.map(({ product, quantity }) => (
          <p key={product.id}>
            {product.name} × {quantity}{' '}
            <strong>{money(product.price * quantity)}</strong>
          </p>
        ))}
        <div>
          <span>Total</span>
          <strong>{money(getCartTotal(cart))}</strong>
        </div>
      </aside>
    </section>
  );
}
