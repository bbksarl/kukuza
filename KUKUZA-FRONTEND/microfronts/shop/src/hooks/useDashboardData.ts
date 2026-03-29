import { useState, useEffect } from 'react';
import type { DashboardStats, ChartDataPoint, VisitsData } from '../types';
import { getMockDashboardStats, getMockSalesData, getMockVisitsData } from '../utils/mockData';

interface UseDashboardDataReturn {
  stats: DashboardStats;
  salesData: ChartDataPoint[];
  visitsData: VisitsData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats>(getMockDashboardStats());
  const [salesData, setSalesData] = useState<ChartDataPoint[]>(getMockSalesData());
  const [visitsData, setVisitsData] = useState<VisitsData[]>(getMockVisitsData());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      
      setStats(getMockDashboardStats());
      setSalesData(getMockSalesData());
      setVisitsData(getMockVisitsData());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    salesData,
    visitsData,
    isLoading,
    error,
    refetch: fetchData
  };
};
