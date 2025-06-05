import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomList } from '../../components/rooms/RoomList';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useRooms } from '../../hooks/useRooms';
import { Plus } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const RoomsManagement = () => {
  const navigate = useNavigate();
  const { rooms, loading, error, deleteRoom } = useRooms(false);
  const { showToast } = useToast();
  const [deleteModal, setDeleteModal] = useState({ open: false, roomId: null });

  const handleEdit = (room) => {
    navigate(`/admin/rooms/${room.id}/edit`);
  };

  const handleDelete = async (roomId) => {
    setDeleteModal({ open: true, roomId });
  };

  const confirmDelete = async () => {
    try {
      await deleteRoom(deleteModal.roomId);
      showToast('Room deleted successfully', 'success');
      setDeleteModal({ open: false, roomId: null });
    } catch {
      showToast('Error deleting room', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-600">Manage your rooms and apartments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/admin/rooms/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <RoomList
        rooms={rooms}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={true}
      />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, roomId: null })}
        title="Delete Room"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this room? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, roomId: null })}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
          >
            Delete Room
          </Button>
        </div>
      </Modal>
    </div>
  );
};