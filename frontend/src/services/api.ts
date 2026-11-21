import type { DashboardData, FilterParams } from '../types/dashboard';
import { getMockDashboardData } from './mockData';

const N8N_BASE_URL = import.meta.env.VITE_N8N_API_URL || 'https://n8n.salespulse.co';
const METRICS_ENDPOINT = `${N8N_BASE_URL}/webhook/salespulse/dashboard-metrics`;

export interface FetchResult {
  data: DashboardData;
  isMock: boolean;
  error?: string;
}

export const fetchDashboardMetrics = async (
  token: string | null,
  filters: FilterParams,
  forceMock: boolean = false
): Promise<FetchResult> => {
  if (forceMock || !token || token === 'demo-token') {
    return {
      data: getMockDashboardData(filters.from, filters.to),
      isMock: true,
    };
  }

  try {
    const url = new URL(METRICS_ENDPOINT);
    url.searchParams.set('from', filters.from);
    url.searchParams.set('to', filters.to);
    if (filters.top_limit) url.searchParams.set('top_limit', String(filters.top_limit));
    if (filters.recent_limit) url.searchParams.set('recent_limit', String(filters.recent_limit));
    if (filters.low_stock_threshold) {
      url.searchParams.set('low_stock_threshold', String(filters.low_stock_threshold));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const message = errorJson?.error || `n8n API responded with status ${response.status}`;
      throw new Error(message);
    }

    const json = await response.json();
    const dashboardData: DashboardData = json.dashboard || json.data || json;

    return {
      data: dashboardData,
      isMock: false,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
    console.warn(`[SalesPulse API] Live n8n query notice: ${errorMessage}. Falling back to demo data.`);
    
    return {
      data: getMockDashboardData(filters.from, filters.to),
      isMock: true,
      error: errorMessage,
    };
  }
};
