import { useState, useEffect } from 'react';
import { bookingsService } from '../services/bookings';
import { useAuth } from '../context/AuthContext';

export const useBookings = (options = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, options.userId, options.roomId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let data;

      if (options.roomId) {
        data = await bookingsService.getRoomBookings(options.roomId);
      } else if (options.userId || (!isAdmin && user)) {
        data = await bookingsService.getUserBookings(options.userId || user.uid);
      } else if (isAdmin) {
        data = await bookingsService.getAllBookings();
      }

      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    const newBooking = await bookingsService.createBooking(bookingData);
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = async (bookingId, status) => {
    await bookingsService.updateBookingStatus(bookingId, status);
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  const checkAvailability = async (roomId, checkIn, checkOut) => {
    return await bookingsService.checkAvailability(roomId, checkIn, checkOut);
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    checkAvailability,
    refetch: fetchBookings
  };
};