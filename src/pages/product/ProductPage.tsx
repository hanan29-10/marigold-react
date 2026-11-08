import { useProduct } from '../../modules/products/useProduct';
import { ProductDetails } from './components/ProductDetails';

export function ProductPage({ id }: { id: string }) {
  const { product, loading, error, notFound, reload } = useProduct(id);
  if (loading)
    return (
      <section className="page catalog-status" role="status">
        <p className="eyebrow">The collection</p>
        <h1>Loading the piece.</h1>
      </section>
    );
  if (error)
    return (
      <section className="page catalog-status" role="alert">
        <p className="eyebrow">The collection</p>
        <h1>We could not load this piece.</h1>
        <button className="button" onClick={reload}>
          Try again <span>→</span>
        </button>
      </section>
    );
  if (notFound || !product)
    return (
      <section className="page">
        <h1>Product not found</h1>
        <a href="/shop">Return to shop</a>
      </section>
    );
  return <ProductDetails product={product} />;
}
