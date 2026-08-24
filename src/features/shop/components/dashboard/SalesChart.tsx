import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from '../common/Card';
import type { ChartDataPoint } from '../../types';
import { useLanguage } from '@/core/i18n';

interface SalesChartProps {
  data: ChartDataPoint[];
  title?: string;
}

type TimeFilter = 'Jour' | 'Semaine' | 'Mois' | 'Année';

const SalesChart: React.FC<SalesChartProps> = ({ data, title = 'Rapport' }) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('Semaine');
  const [activeCategory, setActiveCategory] = useState<string>('Ventes');

  const filters: TimeFilter[] = ['Jour', 'Semaine', 'Mois', 'Année'];
  const translatedFilter: Record<TimeFilter, string> = {
    Jour: t('shop.day'),
    Semaine: t('shop.week'),
    Mois: t('shop.month'),
    Année: t('shop.year'),
  };

  return (
    <Card className="dashboard-chart-card">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-(--color-text-primary)">
              {title === 'Rapport' ? t('shop.report') : title}
            </h3>
            <select 
              className="text-sm px-3 py-1.5 border border-(--color-border) rounded-md bg-white text-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="Ventes">{t('shop.salesLabel')}</option>
              <option value="Revenus">{t('shop.revenue')}</option>
              <option value="Commandes">{t('shop.orders')}</option>
            </select>
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'text-(--color-primary)'
                    : 'text-(--color-text-secondary) hover:bg-(--color-surface-hover)'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {translatedFilter[filter]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b9ded3" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#b9ded3" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
            stroke="#6b7280" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, t('shop.salesLabel')]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#297560"
            strokeWidth={2}
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
