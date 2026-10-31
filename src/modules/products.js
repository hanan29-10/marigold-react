import { products } from '../data/products.js';
import { filterByCategory } from './filters.js';
import { searchProducts } from './search.js';
import { sortProducts } from './sorting.js';
export const findProduct = (id) =>
  products.find((product) => product.id === id);
export const getCatalog = ({
  category = 'All',
  term = '',
  sort = 'featured',
  excludeIds = [],
} = {}) =>
  sortProducts(
    searchProducts(
      filterByCategory(products, category).filter(
        (product) => !excludeIds.includes(product.id),
      ),
      term,
    ),
    sort,
  );
