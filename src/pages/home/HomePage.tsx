import type { Product } from '../../modules/products/products.types';
import { Collections } from './components/Collections';
import { FeaturedProducts } from './components/FeaturedProducts';
import { HeroCarousel } from './components/HeroCarousel';
import { Newsletter } from './components/Newsletter';
export function HomePage({ products }: { products: Product[] }) {
  const arrivals = products
    .filter((product) => product.badge === 'New season')
    .slice(0, 2);
  return (
    <>
      <HeroCarousel />
      <Collections />
      <FeaturedProducts
        title="Featured pieces"
        eyebrow="The collection"
        products={products.slice(0, 8)}
        className="featured-products"
      />
      <section className="campaign">
        <div>
          <p className="eyebrow">MARIGOLD journal / No. 04</p>
          <h2>
            For every
            <br />
            way forward.
          </h2>
          <p>Meet the soft leather pieces designed around a life in motion.</p>
          <a href="/shop" className="button button-light">
            Discover the story <span>→</span>
          </a>
        </div>
        <div className="campaign-image" />
      </section>
      <FeaturedProducts
        title="New arrivals"
        eyebrow="Just arrived"
        products={arrivals}
        className="new-arrivals new-arrivals--duo"
      />
      <Newsletter />
    </>
  );
}
