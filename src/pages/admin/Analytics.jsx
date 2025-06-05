import React, { useState } from 'react';
import { StatsCard } from '../../components/admin/StatsCard';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { OccupancyChart } from '../../components/admin/OccupancyChart';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const { analytics, loading } = useAnalytics(dateRange);

  const exportData = () => {
    // Implement CSV export
    console.log('Exporting data...');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your B&B performance and insights</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value={`${analytics.revenue.toLocaleString()}`}
              icon={DollarSign}
              trend="up"
              trendValue="12.5"
              color="green"
            />
            <StatsCard
              title="Total Bookings"
              value={analytics.bookings}
              icon={Calendar}
              trend="up"
              trendValue="8.2"
              color="blue"
            />
            <StatsCard
              title="Occupancy Rate"
              value={`${analytics.occupancyRate}%`}
              icon={Users}
              trend="down"
              trendValue="3.1"
              color="purple"
            />
            <StatsCard
              title="Avg Stay Length"
              value={`${analytics.averageStayLength} nights`}
              icon={TrendingUp}
              trend="up"
              trendValue="5.4"
              color="primary"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={analytics.revenueData} 
              title="Revenue Trend"
            />
            <OccupancyChart 
              data={analytics.occupancyData} 
              title="Occupancy Rate Trend"
            />
          </div>

          {/* Additional Insights */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Best performing month</span>
                <span className="font-semibold">June 2024 - $15,240</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm">Most booked room</span>
                <span className="font-semibold">Ocean View Suite - 28 bookings</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm">Average booking value</span>
                <span className="font-semibold">$342</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
