import React from 'react';
import { Card } from '../ui/Card';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Users, CreditCard, Home } from 'lucide-react';

export const BookingSummary = ({ booking, room }) => {
  const nights = differenceInDays(
    new Date(booking.checkOut),
    new Date(booking.checkIn)
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
      
      <div className="space-y-4">
        {/* Room Info */}
        <div className="flex items-start space-x-3">
          <Home className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{room.name}</p>
            <p className="text-sm text-gray-500">{room.type}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">
              {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-start space-x-3">
          <Users className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                ${room.pricing.basePrice} x {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span>${room.pricing.basePrice * nights}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service fee</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">${booking.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};