import { getAccessToken } from '../features/auth/auth-token-storage.ts';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = RequestInit & {
  includeAuth?: boolean;
  useApiBase?: boolean;
};

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function getApiBaseUrl() {
  if (!configuredBaseUrl) {
    return '/api';
  }

  return configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl;
}

function buildUrl(path: string, useApiBase = true) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!useApiBase) {
    return normalizedPath;
  }

  return `${getApiBaseUrl()}${normalizedPath}`;
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return fallbackMessage;
}

export async function apiRequest<T>(path: string, init: ApiRequestOptions = {}) {
  const headers = new Headers(init.headers);
  const accessToken = getAccessToken();
  const includeAuth = init.includeAuth ?? true;
  const useApiBase = init.useApiBase ?? true;

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (includeAuth && accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path, useApiBase), {
    ...init,
    headers,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}.`),
      response.status,
      payload,
    );
  }

  return payload as T;
}