import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { createRoomData } from '../models/Room';

const COLLECTION_NAME = 'rooms';

export const roomsService = {
  // Get all rooms
  async getAllRooms(onlyActive = true) {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      
      if (onlyActive) {
        q = query(
          collection(db, COLLECTION_NAME), 
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw error;
    }
  },

  // Get single room
  async getRoom(roomId) {
    try {
      console.log('Fetching room with ID:', roomId);
      const docRef = doc(db, COLLECTION_NAME, roomId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.error('Room not found with ID:', roomId);
        throw new Error('Room not found');
      }
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  },

  // Create room
  async createRoom(roomData) {
    try {
      const newRoom = createRoomData(roomData);
      // Remove the id field before saving to Firestore
      const { id: _id, ...roomDataWithoutId } = newRoom;
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...roomDataWithoutId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Return with the Firestore-generated ID
      return {
        ...roomDataWithoutId,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Update room
  async updateRoom(roomId, updates) {
    try {
      const docRef = doc(db, COLLECTION_NAME, roomId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return {
        id: roomId,
        ...updates
      };
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  // Delete room
  async deleteRoom(roomId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, roomId));
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};