import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import type { VisitsData } from '../../types';
import { useLanguage } from '@/core/i18n';

interface VisitsChartProps {
  data: VisitsData[];
  title?: string;
}

const VisitsChart: React.FC<VisitsChartProps> = ({ data, title = 'Visites' }) => {
  const { t } = useLanguage();
  return (
    <Card className="dashboard-chart-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-(--color-text-primary)">
          {title === 'Visites' ? t('shop.visits') : title}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="36%">
          <XAxis 
            dataKey="day" 
            stroke="#6b7280" 
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [value, t('shop.visits')]}
          />
          <Bar 
            dataKey="visits" 
            fill="#4f6b51"
            radius={[6, 6, 6, 6]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default VisitsChart;
