import React, { useState } from 'react';
import { RoomList } from '../components/rooms/RoomList';
import { useRooms } from '../hooks/useRooms';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Search } from 'lucide-react';

export const Rooms = () => {
  const { rooms, loading, error } = useRooms();
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    sortBy: 'price-asc'
  });

  // Filter and sort rooms
  const filteredRooms = rooms
    .filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          room.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'all' || room.type === filters.type;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.pricing.basePrice - b.pricing.basePrice;
        case 'price-desc':
          return b.pricing.basePrice - a.pricing.basePrice;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Our Rooms & Apartments</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search rooms..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="room">Rooms</option>
              <option value="apartment">Apartments</option>
            </Select>

            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </p>

        {/* Room List */}
        <RoomList 
          rooms={filteredRooms} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};
