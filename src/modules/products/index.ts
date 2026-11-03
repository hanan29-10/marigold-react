/** Public product-catalog API. Implementation files in this module are private. */
export { categories, products, replaceCatalog } from './products.data';
export { findProduct, getCatalog } from './products.logic';
export { money, productCard } from './products.ui';
export { fetchProducts } from './products.api';
export { isProductBadge, isProductCategory } from './products.types';
export type {
  CatalogSort,
  CatalogState,
  Product,
  ProductBadge,
  ProductCategory,
} from './products.types';
