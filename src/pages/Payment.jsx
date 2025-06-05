import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentOptions } from '../components/booking/PaymentOptions';
import { BookingSummary } from '../components/booking/BookingSummary';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft } from 'lucide-react';

export const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingData } = useBooking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const bookingId = searchParams.get('id');

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      // In a real app, you would fetch the booking from Firestore
      // For now, we'll use the booking data from context
      setBooking({
        id: bookingId,
        ...bookingData,
        room: bookingData.room,
        guestInfo: {
          name: 'Guest Name',
          email: 'guest@email.com',
          phone: '+1234567890'
        }
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentDetails) => {
    // Update booking with payment details
    setBooking(prev => ({
      ...prev,
      payment: paymentDetails
    }));
    // Navigate to confirmation
    navigate('/booking/confirmation');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <PaymentOptions 
                booking={booking}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BookingSummary 
              booking={booking} 
              room={booking.room}
            />
          </div>
        </div>
      </div>
    </div>
  );
};