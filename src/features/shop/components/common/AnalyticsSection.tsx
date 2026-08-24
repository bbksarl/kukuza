import React from 'react';
import AnalyticsCards from '../dashboard/AnalyticsCards';
import type { DashboardStats } from '../../types';
import { useLanguage } from '@/core/i18n';

interface AnalyticsSectionProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  error?: Error | null;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ stats, isLoading, error }) => {
  const { t } = useLanguage();
  if (error && !stats) {
    return (
      <div className="mb-6 md:mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {t('shop.analyticsError')}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-6 md:mb-8">
        <div className="h-6 md:h-8 w-24 md:w-32 bg-gray-200 rounded mb-4 md:mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 md:h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <AnalyticsCards stats={stats} />
    </div>
  );
};

export default AnalyticsSection;
