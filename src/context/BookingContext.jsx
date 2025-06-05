import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext({});

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    room: null,
    checkIn: null,
    checkOut: null,
    guests: 1,
    totalPrice: 0,
    specialRequests: ''
  });

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBookingData = () => {
    setBookingData({
      room: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      totalPrice: 0,
      specialRequests: ''
    });
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const diffTime = Math.abs(bookingData.checkOut - bookingData.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateBookingData,
      resetBookingData,
      calculateNights
    }}>
      {children}
    </BookingContext.Provider>
  );
};
