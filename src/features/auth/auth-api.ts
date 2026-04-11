import { apiRequest } from '../../lib/api-client.ts';

export type User = {
  id?: string | number;
  email: string;
  name: string;
  role?: 'USER' | 'ADMIN' | string;
};

type CurrentUserResponse =
  | User
  | {
    user: User;
  };

type LoginResponse =
  | {
    accessToken: string;
    user: User;
  }
  | {
    token: string;
    user: User;
  };

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

function normalizeUser(payload: CurrentUserResponse) {
  return 'user' in payload ? payload.user : payload;
}

function normalizeLoginResponse(payload: LoginResponse) {
  if ('accessToken' in payload) {
    return {
      accessToken: payload.accessToken,
      user: payload.user,
    };
  }

  return {
    accessToken: payload.token,
    user: payload.user,
  };
}

export async function fetchCurrentUser() {
  const response = await apiRequest<CurrentUserResponse>('/auth/me');
  return normalizeUser(response);
}

export async function login(email: string, password: string) {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return normalizeLoginResponse(response);
}

export async function register(input: RegisterInput) {
  const response = await apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return normalizeLoginResponse(response);
}

export async function logout() {
  await apiRequest<null>('/auth/logout', {
    method: 'POST',
  });
}

export async function deleteCurrentAccount(password: string) {
  await apiRequest<null>('/auth/me', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}