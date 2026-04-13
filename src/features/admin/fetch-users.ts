import { apiRequest } from '../../lib/api-client';

export type AdminUser = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
};

export async function fetchAllUsers() {
  return apiRequest<AdminUser[]>('/api/admin/users');
}
