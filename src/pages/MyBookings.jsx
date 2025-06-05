import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, CreditCard } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, loading, updateBookingStatus } = useBookings({ userId: user?.uid });
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });

  const handleCancelBooking = async () => {
    try {
      await updateBookingStatus(cancelModal.bookingId, 'cancelled');
      setCancelModal({ open: false, bookingId: null });
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

          {bookings.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
              <Button variant="primary" onClick={() => window.location.href = '/rooms'}>
                Browse Rooms
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">
                            Booking #{booking.id.slice(-6).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-2" />
                            <div>
                              <p className="text-sm">Check-in: {format(booking.checkIn.toDate(), 'PPP')}</p>
                              <p className="text-sm">Check-out: {format(booking.checkOut.toDate(), 'PPP')}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            <p className="text-sm">{booking.roomName || 'Room'}</p>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-2" />
                            <p className="text-sm">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <CreditCard className="w-5 h-5 mr-2" />
                            <p className="text-sm font-semibold">${booking.totalPrice}</p>
                          </div>
                        </div>

                        {booking.status === 'confirmed' && new Date(booking.checkIn.toDate()) > new Date() && (
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => setCancelModal({ open: true, bookingId: booking.id })}
                            >
                              Cancel Booking
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Cancel Modal */}
        <Modal
          isOpen={cancelModal.open}
          onClose={() => setCancelModal({ open: false, bookingId: null })}
          title="Cancel Booking"
        >
          <p className="text-gray-600 mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setCancelModal({ open: false, bookingId: null })}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};