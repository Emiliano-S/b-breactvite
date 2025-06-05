import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { RoomForm } from '../../components/rooms/RoomForm';
import { useRooms } from '../../hooks/useRooms';
import { storageService } from '../../services/storage';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AddRoom = () => {
  const navigate = useNavigate();
  const { createRoom } = useRooms();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (roomData) => {
    setLoading(true);
    try {
      // Upload images
      const uploadedImages = await Promise.all(
        roomData.images.map(async (file) => {
          if (file instanceof File) {
            return await storageService.uploadRoomImage(file);
          }
          return file;
        })
      );

      // Create room with uploaded image URLs
      await createRoom({
        ...roomData,
        images: uploadedImages
      });

      showToast('Room created successfully!', 'success');
      navigate('/admin/rooms');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/rooms')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Rooms
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
        <p className="text-gray-600">Create a new room or apartment listing</p>
      </div>

      <Card>
        <RoomForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/rooms')}
          loading={loading}
        />
      </Card>
    </div>
  );
};