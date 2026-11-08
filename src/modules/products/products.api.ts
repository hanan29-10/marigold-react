import {
  isProductBadge,
  isProductCategory,
  type Product,
} from './products.types';
import { requestJson } from '../../shared/apiClient';

let inFlightRequest: Promise<ProductsResponse> | undefined;

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

const localImagePath = (image: string) => {
  const filename = image.split('/').pop();
  if (!filename?.startsWith('moron-')) return image;
  return `/images/${filename.replace(/^moron-/, 'marigold-')}`;
};

const normalizeProductsResponse = (
  response: ProductsResponse,
): ProductsResponse => ({
  ...response,
  items: response.items.map((product) => ({
    ...product,
    image: localImagePath(product.image),
    secondaryImage: product.secondaryImage
      ? localImagePath(product.secondaryImage)
      : undefined,
  })),
});

export function fetchProducts(): Promise<ProductsResponse> {
  if (inFlightRequest) return inFlightRequest;

  const request = requestJson('/api/products').then((payload) => {
    if (!isProductsResponse(payload))
      throw new Error('Products API returned an invalid response.');
    return normalizeProductsResponse(payload);
  });
  const sharedRequest = request.finally(() => {
    if (inFlightRequest === sharedRequest) inFlightRequest = undefined;
  });
  inFlightRequest = sharedRequest;
  return sharedRequest;
}

export async function getProductById(id: string): Promise<Product> {
  const payload = await requestJson(`/api/products/${encodeURIComponent(id)}`);
  if (!isProduct(payload))
    throw new Error('Products API returned an invalid product response.');
  return {
    ...payload,
    image: localImagePath(payload.image),
    secondaryImage: payload.secondaryImage
      ? localImagePath(payload.secondaryImage)
      : undefined,
  };
}
