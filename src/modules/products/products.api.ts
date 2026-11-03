import {
  isProductBadge,
  isProductCategory,
  type Product,
} from './products.types';

const PRODUCTS_ENDPOINT = 'https://moron-api-kappa.vercel.app/api/products';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export interface ProductsResponse {
  items: Product[];
  total: number;
  categories: string[];
}

const isProduct = (value: unknown): value is Product => {
  if (!isRecord(value)) return false;
  const product = value;
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    isProductCategory(product.category) &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.badge === 'string' &&
    isProductBadge(product.badge) &&
    typeof product.image === 'string' &&
    typeof product.description === 'string' &&
    (product.secondaryImage === undefined ||
      typeof product.secondaryImage === 'string')
  );
};

const isProductsResponse = (value: unknown): value is ProductsResponse => {
  if (!isRecord(value)) return false;
  const response = value;
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
  if (!response.ok)
    throw new Error(`Products request failed (${response.status}).`);

  const payload: unknown = await response.json();
  if (!isProductsResponse(payload))
    throw new Error('Products API returned an invalid response.');

  return payload;
}
