export const BookingModel = {
  id: '',
  roomId: '',
  userId: '',
  guestInfo: {
    name: '',
    email: '',
    phone: ''
  },
  checkIn: null,
  checkOut: null,
  guests: 1,
  totalPrice: 0,
  status: 'pending', // 'pending' | 'confirmed' | 'cancelled'
  payment: {
    method: '', // 'stripe' | 'paypal'
    status: 'pending', // 'pending' | 'completed' | 'refunded'
    transactionId: ''
  },
  specialRequests: '',
  createdAt: null,
  updatedAt: null
};

export const createBooking = (data) => ({
  ...BookingModel,
  ...data,
  id: data.id || Date.now().toString(),
  createdAt: new Date(),
  updatedAt: new Date()
});