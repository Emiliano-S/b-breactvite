import { roomsService } from '../services/rooms';

export const seedRooms = async () => {
  const sampleRooms = [
    {
      name: 'Ocean View Suite',
      description: 'Luxurious suite with breathtaking ocean views. Features a king-size bed, private balcony, and spacious bathroom with jacuzzi. Perfect for romantic getaways.',
      type: 'room',
      capacity: 2,
      amenities: ['wifi', 'tv', 'minibar', 'airConditioning', 'coffee', 'safe', 'hairDryer'],
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
      ],
      pricing: {
        basePrice: 250,
        weekendPrice: 300,
        seasonalPricing: []
      },
      isActive: true
    },
    {
      name: 'Garden View Room',
      description: 'Cozy room overlooking our beautiful garden. Features a queen-size bed and modern amenities for a comfortable stay.',
      type: 'room',
      capacity: 2,
      amenities: ['wifi', 'tv', 'airConditioning', 'coffee', 'hairDryer'],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
      ],
      pricing: {
        basePrice: 150,
        weekendPrice: 180,
        seasonalPricing: []
      },
      isActive: true
    },
    {
      name: 'Family Apartment',
      description: 'Spacious two-bedroom apartment perfect for families. Full kitchen, living area, and two bathrooms. Accommodates up to 6 guests comfortably.',
      type: 'apartment',
      capacity: 6,
      amenities: ['wifi', 'tv', 'kitchen', 'airConditioning', 'coffee', 'parking', 'iron', 'workDesk'],
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'
      ],
      pricing: {
        basePrice: 350,
        weekendPrice: 400,
        seasonalPricing: [
          {
            name: 'Summer Peak',
            startDate: '2025-07-01',
            endDate: '2025-08-31',
            price: 450
          }
        ]
      },
      isActive: true
    },
    {
      name: 'Deluxe King Room',
      description: 'Elegant room with king-size bed and premium amenities. Features a work desk and comfortable seating area.',
      type: 'room',
      capacity: 2,
      amenities: ['wifi', 'tv', 'minibar', 'airConditioning', 'coffee', 'safe', 'workDesk', 'iron'],
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
      ],
      pricing: {
        basePrice: 200,
        weekendPrice: 230,
        seasonalPricing: []
      },
      isActive: true
    }
  ];

  console.log('Starting to seed rooms...');
  
  for (const room of sampleRooms) {
    try {
      await roomsService.createRoom(room);
      console.log(`Created room: ${room.name}`);
    } catch (error) {
      console.error(`Error creating room ${room.name}:`, error);
    }
  }
  
  console.log('Seeding completed!');
};

// Function to check if database needs seeding
export const checkAndSeedDatabase = async () => {
  try {
    const rooms = await roomsService.getAllRooms(false); // Get all rooms including inactive
    
    if (rooms.length === 0) {
      console.log('No rooms found in database. Starting seed process...');
      await seedRooms();
      return true;
    }
    
    console.log(`Found ${rooms.length} rooms in database.`);
    return false;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
};