import { useState, useEffect } from 'react';
import { roomsService } from '../services/rooms';

export const useRooms = (onlyActive = true) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [onlyActive]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomsService.getAllRooms(onlyActive);
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData) => {
    const newRoom = await roomsService.createRoom(roomData);
    setRooms(prev => [newRoom, ...prev]);
    return newRoom;
  };

  const updateRoom = async (roomId, updates) => {
    const updatedRoom = await roomsService.updateRoom(roomId, updates);
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
    return updatedRoom;
  };

  const deleteRoom = async (roomId) => {
    await roomsService.deleteRoom(roomId);
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  return {
    rooms,
    loading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    refetch: fetchRooms
  };
};