import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  const colorClasses = {
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              'text-sm font-medium',
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              vs last month
            </span>
          </div>
        </div>
        <div className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg',
          colorClasses[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;