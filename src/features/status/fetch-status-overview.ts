import { apiRequest } from '../../lib/api-client.ts';

export type StatusOverview = {
  activeModels: number;
  onlineFavorites: number;
  averageResponseSeconds: number;
  conversionRate: number;
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
  return apiRequest<StatusOverview>('/dashboard/status');
}