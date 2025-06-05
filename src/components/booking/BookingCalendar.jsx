import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';

export const BookingCalendar = ({ 
  selectedDates, 
  onDateSelect, 
  bookedDates = [], 
  minDate = new Date(),
  maxDate,
  isRange = true 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days to start on Sunday
  const startPadding = monthStart.getDay();
  const paddingDays = startPadding > 0 
    ? eachDayOfInterval({
        start: subMonths(monthStart, 1),
        end: new Date(monthStart.getTime() - 24 * 60 * 60 * 1000)
      }).slice(-startPadding)
    : [];

  const allDays = [...paddingDays, ...monthDays];

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      isSameDay(new Date(bookedDate), date)
    );
  };

  const isDateDisabled = (date) => {
    return isDateBooked(date) || 
           isBefore(date, minDate) || 
           (maxDate && isAfter(date, maxDate));
  };

  const isDateInRange = (date) => {
    if (!isRange || !selectedDates.start || !selectedDates.end) return false;
    return isAfter(date, selectedDates.start) && isBefore(date, selectedDates.end);
  };

  const isDateHovered = (date) => {
    if (!isRange || !selectedDates.start || !hoveredDate || selectedDates.end) return false;
    return isAfter(date, selectedDates.start) && isBefore(date, hoveredDate);
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;

    if (!isRange) {
      onDateSelect({ start: date, end: date });
      return;
    }

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onDateSelect({ start: date, end: null });
    } else if (isBefore(date, selectedDates.start)) {
      // If clicked date is before start, make it the new start
      onDateSelect({ start: date, end: null });
    } else {
      // Set end date
      onDateSelect({ start: selectedDates.start, end: date });
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((date, index) => {
          const isBooked = isDateBooked(date);
          const isDisabled = isDateDisabled(date);
          const isStart = selectedDates.start && isSameDay(date, selectedDates.start);
          const isEnd = selectedDates.end && isSameDay(date, selectedDates.end);
          const isInRange = isDateInRange(date);
          const isHovered = isDateHovered(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={isDisabled}
              className={clsx(
                'aspect-square p-2 text-sm rounded-lg transition-all',
                !isCurrentMonth && 'text-gray-400',
                isDisabled && 'cursor-not-allowed opacity-50',
                isBooked && 'bg-gray-200 text-gray-400 line-through',
                !isDisabled && !isBooked && 'hover:bg-gray-100',
                (isStart || isEnd) && 'bg-primary-500 text-white hover:bg-primary-600',
                (isInRange || isHovered) && 'bg-primary-100',
                isStart && !isEnd && 'rounded-r-none',
                isEnd && !isStart && 'rounded-l-none',
                isInRange && 'rounded-none'
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-primary-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};