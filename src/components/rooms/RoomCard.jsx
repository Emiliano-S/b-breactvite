import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Wifi, Coffee, Car, Tv, Wind } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const amenityIcons = {
  wifi: Wifi,
  coffee: Coffee,
  parking: Car,
  tv: Tv,
  airConditioning: Wind
};

export const RoomCard = ({ room, onEdit, onDelete, isAdmin = false }) => {
  const { id, name, description, images, pricing, capacity, amenities, type } = room;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col" hover>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={images?.[0] || '/images/placeholder-room.jpg'}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-semibold">
            ${pricing?.basePrice}/night
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{name}</h3>
              <span className="text-sm text-gray-500 capitalize">{type}</span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

            {/* Capacity */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Users className="w-4 h-4 mr-1" />
              <span>Up to {capacity} guests</span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {amenities?.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div
                    key={amenity}
                    className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                );
              })}
              {amenities?.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isAdmin ? (
              <>
                <Button
                  variant="outline"
                  size="small"
                  fullWidth
                  onClick={() => onEdit(room)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  fullWidth
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Link to={`/rooms/${id}`} className="w-full">
                <Button variant="primary" size="small" fullWidth>
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
