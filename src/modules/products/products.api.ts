import {
  isProductBadge,
  isProductCategory,
  type Product,
} from './products.types';

const PRODUCTS_ENDPOINT = 'https://moron-api-kappa.vercel.app/api/products';
const REQUEST_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 1_000;
const retryableStatuses = new Set([502, 503, 504]);
let inFlightRequest: Promise<ProductsResponse> | undefined;

class ProductsRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ProductsRequestError';
  }
}

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

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const isNetworkOrTimeoutError = (error: unknown) =>
  error instanceof TypeError ||
  (error instanceof DOMException && error.name === 'AbortError');

const shouldRetry = (error: unknown) =>
  isNetworkOrTimeoutError(error) ||
  (error instanceof ProductsRequestError &&
    retryableStatuses.has(error.status));

async function requestProducts(): Promise<ProductsResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      signal: controller.signal,
    });
    if (!response.ok)
      throw new ProductsRequestError(
        `Products request failed (${response.status}).`,
        response.status,
      );

    const payload: unknown = await response.json();
    if (!isProductsResponse(payload))
      throw new Error('Products API returned an invalid response.');

    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function requestProductsWithRetry(): Promise<ProductsResponse> {
  try {
    return await requestProducts();
  } catch (error) {
    if (!shouldRetry(error)) throw error;
    await wait(RETRY_DELAY_MS);
    return requestProducts();
  }
}

export function fetchProducts(): Promise<ProductsResponse> {
  if (inFlightRequest) return inFlightRequest;

  const request = requestProductsWithRetry();
  const sharedRequest = request.finally(() => {
    if (inFlightRequest === sharedRequest) inFlightRequest = undefined;
  });
  inFlightRequest = sharedRequest;
  return sharedRequest;
}
