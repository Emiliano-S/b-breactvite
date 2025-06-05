export const AvailabilityModel = {
  roomId: '',
  date: '', // YYYY-MM-DD format
  isAvailable: true,
  bookingId: null
};

export const createAvailability = (roomId, date, isAvailable = true, bookingId = null) => ({
  roomId,
  date,
  isAvailable,
  bookingId
});