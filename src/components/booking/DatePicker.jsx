import React from 'react';
import { BookingCalendar } from './BookingCalendar';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

export const DatePicker = ({ 
  checkIn, 
  checkOut, 
  onDateChange, 
  bookedDates = [],
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={checkIn ? format(checkIn, 'MMM d, yyyy') : ''}
              readOnly
              placeholder="Select date"
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={checkOut ? format(checkOut, 'MMM d, yyyy') : ''}
              readOnly
              placeholder="Select date"
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      <BookingCalendar
        selectedDates={{ start: checkIn, end: checkOut }}
        onDateSelect={({ start, end }) => onDateChange(start, end)}
        bookedDates={bookedDates}
        minDate={new Date()}
        isRange={true}
      />

      {checkIn && checkOut && (
        <div className="text-sm text-gray-600 text-center">
          {format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d, yyyy')} • {' '}
          {Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))} nights
        </div>
      )}
    </div>
  );
};