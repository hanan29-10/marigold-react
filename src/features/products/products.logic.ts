import type {
  CatalogSort,
  CatalogState,
  Product,
  ProductCategory,
} from './products.types';

const filterByCategory = (
  items: Product[],
  category: ProductCategory | 'All',
) =>
  category === 'All'
    ? items
    : items.filter((product) => product.category === category);

const searchProducts = (items: Product[], term: string) => {
  const query = term.trim().toLowerCase();
  if (!query) return items;
  return items.filter((product) =>
    [product.name, product.category, product.badge].some((value) =>
      value.toLowerCase().includes(query),
    ),
  );
};

const sortProducts = (items: Product[], order: CatalogSort) => {
  const sorted = [...items];
  if (order === 'price-low') return sorted.sort((a, b) => a.price - b.price);
  if (order === 'price-high') return sorted.sort((a, b) => b.price - a.price);
  if (order === 'name')
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
};
export const findProduct = (items: Product[], id: string | undefined) =>
  items.find((product) => product.id === id);
export const getCatalog = (
  items: Product[],
  {
    category = 'All',
    term = '',
    sort = 'featured',
    excludeIds = [],
  }: Partial<CatalogState> & { excludeIds?: string[] } = {},
) =>
  sortProducts(
    searchProducts(
      filterByCategory(items, category).filter(
        (product) => !excludeIds.includes(product.id),
      ),
      term,
    ),
    sort,
  );
