const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRY_DELAY_MS = 1_000;
const configuredApiBaseUrl: unknown = import.meta.env
  .VITE_MARIGOLD_API_BASE_URL;
const MARIGOLD_API_BASE_URL =
  typeof configuredApiBaseUrl === 'string' && configuredApiBaseUrl.trim()
    ? configuredApiBaseUrl.trim()
    : 'https://marigold-api.vercel.app';
const retryableStatuses = new Set([502, 503, 504]);

export type ApiConnectionStatus =
  'idle' | 'loading' | 'retrying' | 'online' | 'error';

type ApiConnectionListener = (status: ApiConnectionStatus) => void;

interface RequestJsonOptions {
  retryDelayMs?: number;
  timeoutMs?: number;
}

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export const isApiNotFoundError = (error: unknown) =>
  error instanceof ApiRequestError && error.status === 404;

let connectionStatus: ApiConnectionStatus = 'idle';
const connectionListeners = new Set<ApiConnectionListener>();

const setConnectionStatus = (status: ApiConnectionStatus) => {
  connectionStatus = status;
  connectionListeners.forEach((listener) => listener(status));
};

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const isNetworkOrTimeoutError = (error: unknown) =>
  error instanceof TypeError ||
  (error instanceof DOMException && error.name === 'AbortError');

const shouldRetry = (error: unknown) =>
  isNetworkOrTimeoutError(error) ||
  (error instanceof ApiRequestError && retryableStatuses.has(error.status));

async function requestOnce(url: string, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok)
      throw new ApiRequestError(
        `API request failed (${response.status}).`,
        response.status,
      );

    const payload: unknown = await response.json();
    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const getApiConnectionStatus = () => connectionStatus;

export const subscribeToApiConnection = (listener: ApiConnectionListener) => {
  connectionListeners.add(listener);
  return () => connectionListeners.delete(listener);
};

export async function requestJson(
  path: string,
  {
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: RequestJsonOptions = {},
): Promise<unknown> {
  const url = new URL(path, MARIGOLD_API_BASE_URL).toString();
  setConnectionStatus('loading');

  try {
    const response = await requestOnce(url, timeoutMs);
    setConnectionStatus('online');
    return response;
  } catch (error) {
    if (!shouldRetry(error)) {
      setConnectionStatus('error');
      throw error;
    }

    setConnectionStatus('retrying');
    await wait(retryDelayMs);

    try {
      const response = await requestOnce(url, timeoutMs);
      setConnectionStatus('online');
      return response;
    } catch (retryError) {
      setConnectionStatus('error');
      throw retryError;
    }
  }
}
