import { useCart } from '../../modules/cart/CartProvider';
import { getCartTotal } from '../../modules/cart/cart.logic';
import { money } from '../../modules/products/products.format';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../shared/components/ui/alert-dialog';
import { CartItems } from './components/CartItems';
export function CartPage() {
  const { items, clear } = useCart();
  return (
    <section className="page">
      <p className="eyebrow">Your selection</p>
      <h1>Shopping bag</h1>
      {items.length ? (
        <div className="cart-layout">
          <CartItems />
          <aside className="summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{money(getCartTotal(items))}</strong>
            </div>
            <p>Shipping is calculated at checkout.</p>
            <a className="button" href="/checkout">
              Checkout <span>→</span>
            </a>
            <AlertDialog>
              <AlertDialogTrigger className="button button-secondary">
                Clear bag
              </AlertDialogTrigger>
              <AlertDialogContent className="marigold-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear your shopping bag?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all pieces from your saved bag.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep bag</AlertDialogCancel>
                  <AlertDialogAction onClick={clear}>
                    Clear bag
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </aside>
        </div>
      ) : (
        <p className="empty">
          Your bag is empty. <a href="/shop">Explore the collection.</a>
        </p>
      )}
    </section>
  );
}
