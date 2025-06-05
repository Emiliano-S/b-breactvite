// src/models/Room.js
export const RoomModel = {
  name: '',
  description: '',
  type: 'room', // 'room' | 'apartment'
  capacity: 2,
  amenities: [],
  images: [],
  pricing: {
    basePrice: 0,
    weekendPrice: 0,
    seasonalPricing: []
  },
  isActive: true,
  createdAt: null,
  updatedAt: null
};

export const createRoomData = (data) => ({
  ...RoomModel,
  ...data,
  createdAt: new Date(),
  updatedAt: new Date()
});