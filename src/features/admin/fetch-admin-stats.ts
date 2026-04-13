import { apiRequest } from '../../lib/api-client.ts';

export type AdminStats = Record<string, unknown>;

export async function fetchAdminStats() {
  return apiRequest<AdminStats>('/api/admin/stats');
}