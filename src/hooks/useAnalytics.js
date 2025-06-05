import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics';

export const useAnalytics = (dateRange = 'month') => {
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    bookings: 0,
    occupancyRate: 0,
    averageStayLength: 0,
    revenueData: [],
    bookingsData: [],
    occupancyData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics(dateRange);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};