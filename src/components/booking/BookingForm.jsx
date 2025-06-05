import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { User, Mail, Phone, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../hooks/useToast';

export const BookingForm = ({ room, onSubmit }) => {
  const { user } = useAuth();
  const { bookingData } = useBooking();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      guestName: user?.displayName || '',
      guestEmail: user?.email || '',
      guestPhone: '',
      guests: bookingData.guests || 1,
      specialRequests: ''
    }
  });

  const handleFormSubmit = async (data) => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }

    setLoading(true);
    try {
      const booking = {
        roomId: room.id,
        userId: user?.uid,
        guestInfo: {
          name: data.guestName,
          email: data.guestEmail,
          phone: data.guestPhone
        },
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(data.guests),
        totalPrice: bookingData.totalPrice,
        specialRequests: data.specialRequests,
        status: 'pending'
      };

      await onSubmit(booking);
      showToast('Booking submitted successfully!', 'success');
      navigate('/booking/payment');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Booking Summary</h3>
        <div className="space-y-1 text-sm">
          <p>Room: {room.name}</p>
          <p>Check-in: {bookingData.checkIn ? format(bookingData.checkIn, 'PPP') : 'Not selected'}</p>
          <p>Check-out: {bookingData.checkOut ? format(bookingData.checkOut, 'PPP') : 'Not selected'}</p>
          <p>Total: ${bookingData.totalPrice}</p>
        </div>
      </div>

      {/* Guest Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Guest Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              {...register('guestName', { required: 'Name is required' })}
              error={!!errors.guestName}
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
          {errors.guestName && (
            <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              {...register('guestEmail', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.guestEmail}
              className="pl-10"
              placeholder="john@example.com"
            />
          </div>
          {errors.guestEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.guestEmail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="tel"
              {...register('guestPhone', { required: 'Phone number is required' })}
              error={!!errors.guestPhone}
              className="pl-10"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {errors.guestPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.guestPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              min="1"
              max={room.capacity}
              {...register('guests', { 
                required: 'Number of guests is required',
                min: { value: 1, message: 'At least 1 guest required' },
                max: { value: room.capacity, message: `Maximum ${room.capacity} guests allowed` }
              })}
              error={!!errors.guests}
              className="pl-10"
            />
          </div>
          {errors.guests && (
            <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              {...register('specialRequests')}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Any special requests or requirements..."
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={!bookingData.checkIn || !bookingData.checkOut}
      >
        Continue to Payment
      </Button>
    </form>
  );
};