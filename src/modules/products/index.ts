/** Public product-catalog API. Implementation files in this module are private. */
export { categories, products, replaceCatalog } from './products.data';
export { findProduct, getCatalog } from './products.logic';
export { money, productCard } from './products.ui';
export { fetchProducts } from './products.api';
export {
  getApiConnectionStatus as getProductsConnectionStatus,
  subscribeToApiConnection as subscribeToProductsConnection,
} from '../../shared/api/client';
export type { ApiConnectionStatus as ProductsConnectionStatus } from '../../shared/api/client';
export { isProductBadge, isProductCategory } from './products.types';
export type {
  CatalogSort,
  CatalogState,
  Product,
  ProductBadge,
  ProductCategory,
} from './products.types';
