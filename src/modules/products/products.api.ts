import type { Product, ProductBadge, ProductCategory } from './products.types';

const PRODUCTS_ENDPOINT = 'https://moron-api-kappa.vercel.app/api/products';

export interface ProductsResponse {
  items: Product[];
  total: number;
  categories: string[];
}

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== 'object') return false;
  const product = value as Record<string, unknown>;
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.badge === 'string' &&
    typeof product.image === 'string' &&
    typeof product.description === 'string' &&
    (product.secondaryImage === undefined ||
      typeof product.secondaryImage === 'string')
  );
};

const isProductsResponse = (value: unknown): value is ProductsResponse => {
  if (!value || typeof value !== 'object') return false;
  const response = value as Record<string, unknown>;
  return (
    Array.isArray(response.items) &&
    response.items.every(isProduct) &&
    typeof response.total === 'number' &&
    Array.isArray(response.categories) &&
    response.categories.every((category) => typeof category === 'string')
  );
};

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(PRODUCTS_ENDPOINT);
  if (!response.ok) throw new Error(`Products request failed (${response.status}).`);

  const payload: unknown = await response.json();
  if (!isProductsResponse(payload)) throw new Error('Products API returned an invalid response.');

  return {
    ...payload,
    items: payload.items.map((product) => ({
      ...product,
      category: product.category as ProductCategory,
      badge: product.badge as ProductBadge,
    })),
  };
}
