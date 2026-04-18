import { apiRequest } from '../../lib/api-client.ts';

export type StatusOverview = {
  activeModels: number;
  onlineFavorites: number;
  alerts: Array<{
    id: string;
    title: string;
    tone: 'critical' | 'watch' | 'healthy';
    detail: string;
  }>;
  timeline: Array<{
    hour: string;
    viewers: number;
    revenue: number;
  }>;
};

export async function fetchStatusOverview(): Promise<StatusOverview> {
  // Updated to use the admin stats endpoint
  return apiRequest<StatusOverview>('/api/admin/stats');
}