import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useBookings } from '../hooks/useBookings';
import { BookingForm } from '../components/booking/BookingForm';
import { BookingSummary } from '../components/booking/BookingSummary';
import { Card } from '../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export const Booking = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();
  const { createBooking } = useBookings();
  // Removed unused bookingId state

  if (!bookingData.room) {
    navigate('/rooms');
    return null;
  }

  const handleSubmit = async (bookingInfo) => {
    const newBooking = await createBooking(bookingInfo);
    navigate(`/booking/payment?id=${newBooking.id}`);
  };

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

        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <BookingForm 
                room={bookingData.room} 
                onSubmit={handleSubmit}
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BookingSummary 
              booking={bookingData} 
              room={bookingData.room}
            />
          </div>
        </div>
      </div>
    </div>
  );
};