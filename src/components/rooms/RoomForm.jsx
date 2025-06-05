import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ImageUpload } from '../ui/ImageUpload';
import { useToast } from '../../hooks/useToast';
import { Plus, X } from 'lucide-react';

const amenitiesOptions = [
  'wifi',
  'coffee',
  'parking',
  'tv',
  'airConditioning',
  'breakfast',
  'kitchen',
  'minibar',
  'safe',
  'hairDryer',
  'iron',
  'workDesk'
];

export const RoomForm = ({ room, onSubmit, onCancel, loading }) => {
  const [images, setImages] = useState(room?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState(room?.amenities || []);
  const [seasonalPricing, setSeasonalPricing] = useState(room?.pricing?.seasonalPricing || []);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: room?.name || '',
      description: room?.description || '',
      type: room?.type || 'room',
      capacity: room?.capacity || 2,
      basePrice: room?.pricing?.basePrice || '',
      weekendPrice: room?.pricing?.weekendPrice || ''
    }
  });

  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        description: room.description,
        type: room.type,
        capacity: room.capacity,
        basePrice: room.pricing?.basePrice,
        weekendPrice: room.pricing?.weekendPrice
      });
      setImages(room.images || []);
      setSelectedAmenities(room.amenities || []);
      setSeasonalPricing(room.pricing?.seasonalPricing || []);
    }
  }, [room, reset]);

  const handleFormSubmit = async (data) => {
    if (images.length === 0) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    const roomData = {
      ...data,
      images,
      amenities: selectedAmenities,
      pricing: {
        basePrice: parseFloat(data.basePrice),
        weekendPrice: parseFloat(data.weekendPrice || data.basePrice),
        seasonalPricing
      },
      capacity: parseInt(data.capacity)
    };

    try {
      await onSubmit(roomData);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addSeasonalPrice = () => {
    setSeasonalPricing([
      ...seasonalPricing,
      { name: '', startDate: '', endDate: '', price: 0 }
    ]);
  };

  const updateSeasonalPrice = (index, field, value) => {
    const updated = [...seasonalPricing];
    updated[index][field] = value;
    setSeasonalPricing(updated);
  };

  const removeSeasonalPrice = (index) => {
    setSeasonalPricing(seasonalPricing.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Name
          </label>
          <Input
            {...register('name', { required: 'Room name is required' })}
            error={!!errors.name}
            placeholder="Deluxe Ocean View Room"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={4}
            placeholder="Describe the room features and atmosphere..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select {...register('type')}>
              <option value="room">Room</option>
              <option value="apartment">Apartment</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Guests
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register('capacity', { required: 'Capacity is required' })}
              error={!!errors.capacity}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price (per night)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register('basePrice', { required: 'Base price is required' })}
              error={!!errors.basePrice}
              placeholder="100.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekend Price
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register('weekendPrice')}
              placeholder="120.00"
            />
          </div>
        </div>

        {/* Seasonal Pricing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Seasonal Pricing
            </label>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={addSeasonalPrice}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Season
            </Button>
          </div>

          {seasonalPricing.map((season, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Season name"
                value={season.name}
                onChange={(e) => updateSeasonalPrice(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                value={season.startDate}
                onChange={(e) => updateSeasonalPrice(index, 'startDate', e.target.value)}
              />
              <Input
                type="date"
                value={season.endDate}
                onChange={(e) => updateSeasonalPrice(index, 'endDate', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={season.price}
                onChange={(e) => updateSeasonalPrice(index, 'price', parseFloat(e.target.value))}
                className="w-24"
              />
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => removeSeasonalPrice(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Amenities</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxFiles={10}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {room ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  );
};