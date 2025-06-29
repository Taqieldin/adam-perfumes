import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SalesChart: React.FC = () => {
  const { stats } = useSelector((state: RootState) => state.analytics);

  // Mock data if no real data available
  const data = stats?.salesData || [
    { date: '2024-01-01', sales: 4000, orders: 24 },
    { date: '2024-01-02', sales: 3000, orders: 18 },
    { date: '2024-01-03', sales: 2000, orders: 12 },
    { date: '2024-01-04', sales: 2780, orders: 16 },
    { date: '2024-01-05', sales: 1890, orders: 11 },
    { date: '2024-01-06', sales: 2390, orders: 14 },
    { date: '2024-01-07', sales: 3490, orders: 21 },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} OMR`;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'sales' ? formatCurrency(value as number) : value,
              name === 'sales' ? 'Sales' : 'Orders'
            ]}
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;