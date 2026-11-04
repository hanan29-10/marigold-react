const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRY_DELAY_MS = 1_000;
const retryableStatuses = new Set([502, 503, 504]);

export type ApiConnectionStatus =
  'idle' | 'loading' | 'retrying' | 'online' | 'error';

type ApiConnectionListener = (status: ApiConnectionStatus) => void;
type ResponseValidator<T> = (value: unknown) => value is T;

interface RequestJsonOptions<T> {
  isValidResponse: ResponseValidator<T>;
  retryDelayMs?: number;
  timeoutMs?: number;
}

class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

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

async function requestOnce<T>(
  url: string,
  isValidResponse: ResponseValidator<T>,
  timeoutMs: number,
): Promise<T> {
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
    if (!isValidResponse(payload))
      throw new Error('API returned an invalid response.');

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

export async function requestJson<T>(
  url: string,
  {
    isValidResponse,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: RequestJsonOptions<T>,
): Promise<T> {
  setConnectionStatus('loading');

  try {
    const response = await requestOnce(url, isValidResponse, timeoutMs);
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
      const response = await requestOnce(url, isValidResponse, timeoutMs);
      setConnectionStatus('online');
      return response;
    } catch (retryError) {
      setConnectionStatus('error');
      throw retryError;
    }
  }
}
