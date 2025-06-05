import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { RoomForm } from '../../components/rooms/RoomForm';
import { Spinner } from '../../components/ui/Spinner';
import { useRooms } from '../../hooks/useRooms';
import { roomsService } from '../../services/rooms';
import { storageService } from '../../services/storage';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRoom } = useRooms();
  const { showToast } = useToast();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const data = await roomsService.getRoom(id);
      setRoom(data);
    } catch {
      showToast('Error loading room', 'error');
      navigate('/admin/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (roomData) => {
    setSaving(true);
    try {
      // Handle image uploads
      const uploadedImages = await Promise.all(
        roomData.images.map(async (file) => {
          if (file instanceof File) {
            return await storageService.uploadRoomImage(file);
          }
          return file;
        })
      );

      // Update room
      await updateRoom(id, {
        ...roomData,
        images: uploadedImages
      });

      showToast('Room updated successfully!', 'success');
      navigate('/admin/rooms');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Room</h1>
        <p className="text-gray-600">Update room details and information</p>
      </div>

      <Card>
        <RoomForm
          room={room}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/rooms')}
          loading={saving}
        />
      </Card>
    </div>
  );
};
