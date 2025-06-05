import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export const analyticsService = {
  async getAnalytics(dateRange = 'month') {
    try {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }

      // Get bookings in date range
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('status', '!=', 'cancelled'),
        orderBy('createdAt', 'asc')
      );

      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate metrics
      const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const totalBookings = bookings.length;
      
      // Calculate occupancy rate (simplified)
      const roomsQuery = query(collection(db, 'rooms'));
      const roomsSnapshot = await getDocs(roomsQuery);
      const totalRooms = roomsSnapshot.size;
      const totalDays = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
      const totalPossibleNights = totalRooms * totalDays;
      
      const bookedNights = bookings.reduce((sum, booking) => {
        const nights = Math.ceil(
          (booking.checkOut.toDate() - booking.checkIn.toDate()) / (1000 * 60 * 60 * 24)
        );
        return sum + nights;
      }, 0);
      
      const occupancyRate = (bookedNights / totalPossibleNights) * 100;
      
      // Average stay length
      const averageStayLength = bookedNights / totalBookings || 0;

      // Prepare chart data
      const revenueData = this.aggregateDataByPeriod(bookings, 'revenue', dateRange);
      const bookingsData = this.aggregateDataByPeriod(bookings, 'count', dateRange);
      const occupancyData = this.calculateOccupancyByPeriod(bookings, totalRooms, dateRange);

      return {
        revenue,
        bookings: totalBookings,
        occupancyRate: Math.round(occupancyRate),
        averageStayLength: Math.round(averageStayLength * 10) / 10,
        revenueData,
        bookingsData,
        occupancyData
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },

  aggregateDataByPeriod(bookings, metric, dateRange) {
    const data = {};
    
    bookings.forEach(booking => {
      const date = booking.createdAt.toDate();
      let key;
      
      if (dateRange === 'week') {
        key = date.toLocaleDateString();
      } else if (dateRange === 'month') {
        key = `${date.getDate()}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      if (!data[key]) {
        data[key] = { date: key, value: 0 };
      }
      
      if (metric === 'revenue') {
        data[key].value += booking.totalPrice;
      } else {
        data[key].value += 1;
      }
    });
    
    return Object.values(data);
  },

  calculateOccupancyByPeriod(bookings, totalRooms, dateRange) {
    // Simplified occupancy calculation
    // In a real app, this would be more complex
    const periods = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = 0; i < Math.min(periods, 12); i++) {
      data.push({
        date: `Period ${i + 1}`,
        value: Math.random() * 40 + 40 // Simulated data 40-80%
      });
    }
    
    return data;
  }
};