import type { Product, ProductCategory } from './products.types';

/** Stable references keep synchronous catalog and cart helpers intact after hydration. */
export const products: Product[] = [];
export const categories: Array<ProductCategory | 'All'> = ['All'];

export function replaceCatalog(
  nextProducts: Product[],
  nextCategories: string[],
) {
  products.splice(0, products.length, ...nextProducts);
  categories.splice(
    0,
    categories.length,
    'All',
    ...nextCategories.filter(
      (category): category is ProductCategory =>
        category !== 'All' &&
        nextProducts.some((product) => product.category === category),
    ),
  );
}
