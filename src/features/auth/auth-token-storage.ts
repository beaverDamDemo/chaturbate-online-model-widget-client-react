const ACCESS_TOKEN_STORAGE_KEY = 'cmw-access-token';
const BACKEND_TOKEN_STORAGE_KEY = 'token';

let accessToken =
  window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
  window.localStorage.getItem(BACKEND_TOKEN_STORAGE_KEY);

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(BACKEND_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken() {
  accessToken = null;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(BACKEND_TOKEN_STORAGE_KEY);
}