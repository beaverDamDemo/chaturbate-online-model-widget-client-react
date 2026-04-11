import { apiRequest } from '../../lib/api-client.ts';

function normalizePath(path: string) {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return '/health';
  }

  return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
}

export async function fetchBackendProbe(path: string) {
  return apiRequest<unknown>(normalizePath(path), {
    includeAuth: false,
    useApiBase: false,
  });
}