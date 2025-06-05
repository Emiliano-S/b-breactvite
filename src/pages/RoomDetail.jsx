import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomsService } from '../services/rooms';
import { RoomGallery } from '../components/rooms/RoomGallery';
import { DatePicker } from '../components/booking/DatePicker';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Select } from '../components/ui/Select';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Wifi, 
  Coffee, 
  Car, 
  Tv, 
  Wind,
  MapPin,
  Star
} from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useToast } from '../hooks/useToast';

const amenityIcons = {
  wifi: Wifi,
  coffee: Coffee,
  parking: Car,
  tv: Tv,
  airConditioning: Wind
};

export const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateBookingData } = useBooking();
  const { showToast } = useToast();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const data = await roomsService.getRoom(id);
      setRoom(data);
    } catch {
      showToast('Error loading room details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setCheckIn(start);
    setCheckOut(end);
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !room) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return nights * room.pricing.basePrice;
  };

  const handleBooking = () => {
    if (!user) {
      showToast('Please login to make a booking', 'error');
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }

    updateBookingData({
      room,
      checkIn,
      checkOut,
      guests,
      totalPrice: calculateTotalPrice()
    });

    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <RoomGallery images={room.images} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <span className="capitalize">{room.type}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this {room.type}</h2>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="capitalize">
                        {amenity.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Check-in: 3:00 PM - 10:00 PM</li>
                <li>• Check-out: 11:00 AM</li>
                <li>• No smoking</li>
                <li>• No parties or events</li>
                <li>• Pets allowed with prior approval</li>
              </ul>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-gray-600">123 Sunset Lane, Beach City, CA 90210</p>
                  <p className="text-sm text-gray-500 mt-1">
                    5 min walk to beach • 10 min to downtown
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold">${room.pricing.basePrice}</span>
                  <span className="text-gray-500">per night</span>
                </div>
                {room.pricing.weekendPrice > room.pricing.basePrice && (
                  <p className="text-sm text-gray-500">
                    Weekends: ${room.pricing.weekendPrice}/night
                  </p>
                )}
              </div>

              <DatePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onDateChange={handleDateChange}
                bookedDates={[]} // TODO: Fetch booked dates
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <Select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full"
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </Select>
              </div>

              {checkIn && checkOut && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      ${room.pricing.basePrice} x {differenceInDays(checkOut, checkIn)} nights
                    </span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                size="large"
                onClick={handleBooking}
                className="mt-6"
              >
                Reserve Now
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                You won't be charged yet
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};