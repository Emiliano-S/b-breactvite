import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100',
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={clsx(
                'text-sm',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trendValue}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx(
            'p-3 rounded-lg',
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};