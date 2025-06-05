import React from 'react';
import { Card } from '../ui/Card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const RevenueChart = ({ data, title = 'Revenue Overview' }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
              formatter={(value) => `$${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0EA5E9" 
              strokeWidth={2}
              dot={{ fill: '#0EA5E9', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};