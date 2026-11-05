import { useEffect, useMemo, useState } from 'react';
import { getCatalog } from '../../features/products/products.logic';
import {
  isProductCategory,
  type CatalogSort,
  type CatalogState,
  type Product,
  type ProductCategory,
} from '../../features/products/products.types';
import { ProductFilters } from './components/ProductFilters';
import { ProductGrid } from './components/ProductGrid';
import { SearchBar } from './components/SearchBar';
export function ShopPage({
  products,
  categories,
}: {
  products: Product[];
  categories: Array<ProductCategory | 'All'>;
}) {
  const initial = sessionStorage.getItem('marigold-category');
  const [state, setState] = useState<CatalogState>({
    category: initial && isProductCategory(initial) ? initial : 'All',
    term: '',
    sort: 'featured',
  });
  useEffect(() => sessionStorage.removeItem('marigold-category'), []);
  const catalog = useMemo(() => getCatalog(products, state), [products, state]);
  return (
    <section className="catalog shop-catalog" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The collection</p>
          <h1>All pieces</h1>
        </div>
      </div>
      <SearchBar
        term={state.term}
        sort={state.sort}
        onTermChange={(term) => setState((current) => ({ ...current, term }))}
        onSortChange={(sort: CatalogSort) =>
          setState((current) => ({ ...current, sort }))
        }
      />
      <ProductFilters
        categories={categories}
        selected={state.category}
        onSelect={(category) =>
          setState((current) => ({ ...current, category }))
        }
      />
      <ProductGrid products={catalog} />
    </section>
  );
}
