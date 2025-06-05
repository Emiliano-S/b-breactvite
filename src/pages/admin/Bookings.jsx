import React, { useState } from 'react';
import { BookingTable } from '../../components/admin/BookingTable';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const Bookings = () => {
  const { bookings, loading, updateBookingStatus } = useBookings();
  const { showToast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      showToast(`Booking ${status} successfully`, 'success');
    } catch {
      showToast('Error updating booking status', 'error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestInfo.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      booking.guestInfo.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      booking.id.includes(filters.search);
    
    const matchesStatus = filters.status === 'all' || booking.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600">Manage all bookings and reservations</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email or ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </Select>
        </div>
      </Card>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <BookingTable
          bookings={filteredBookings}
          onViewDetails={(booking) => setSelectedBooking(booking)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="large"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Booking ID</h4>
                <p>#{selectedBooking.id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Status</h4>
                <p className="capitalize">{selectedBooking.status}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Guest Name</h4>
                <p>{selectedBooking.guestInfo.name}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Email</h4>
                <p>{selectedBooking.guestInfo.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Phone</h4>
                <p>{selectedBooking.guestInfo.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Guests</h4>
                <p>{selectedBooking.guests}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Check-in</h4>
                <p>{format(selectedBooking.checkIn.toDate(), 'PPP')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Check-out</h4>
                <p>{format(selectedBooking.checkOut.toDate(), 'PPP')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Total Price</h4>
                <p className="text-lg font-semibold">${selectedBooking.totalPrice}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Payment Status</h4>
                <p className="capitalize">{selectedBooking.payment?.status || 'Pending'}</p>
              </div>
            </div>
            
            {selectedBooking.specialRequests && (
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Special Requests</h4>
                <p className="mt-1">{selectedBooking.specialRequests}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};