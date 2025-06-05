import React, { useState } from 'react';
import { StatsCard } from '../../components/admin/StatsCard';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { OccupancyChart } from '../../components/admin/OccupancyChart';
import { BookingTable } from '../../components/admin/BookingTable';
import { QuickActions } from '../../components/admin/QuickActions';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';
import { checkAndSeedDatabase } from '../../utils/seedData';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Database
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Dashboard = () => {
  const { analytics } = useAnalytics('month');
  const { bookings } = useBookings();
  const { showToast } = useToast();
  const [seeding, setSeeding] = useState(false);

  // Get recent bookings (last 5)
  const recentBookings = bookings.slice(0, 5);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const wasSeeded = await checkAndSeedDatabase();
      if (wasSeeded) {
        showToast('Database seeded with sample rooms!', 'success');
        window.location.reload(); // Reload to show new data
      } else {
        showToast('Database already has rooms', 'info');
      }
    } catch (error) {
      showToast('Error seeding database', error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your B&B.</p>
        </div>
        <Button
          variant="outline"
          size="small"
          onClick={handleSeedDatabase}
          loading={seeding}
        >
          <Database className="w-4 h-4 mr-2" />
          Seed Sample Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${analytics.revenue.toLocaleString()}`}
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
        <RevenueChart data={analytics.revenueData} />
        <OccupancyChart data={analytics.occupancyData} />
      </div>

      {/* Recent Bookings and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <BookingTable
            bookings={recentBookings}
            onViewDetails={(booking) => console.log('View', booking)}
            onUpdateStatus={(id, status) => console.log('Update', id, status)}
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
