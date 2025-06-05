import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { createBooking } from '../models/Booking';

const COLLECTION_NAME = 'bookings';

export const bookingsService = {
  // Get all bookings
  async getAllBookings() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('checkIn', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  },

  // Get bookings by user
  async getUserBookings(userId) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('checkIn', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },

  // Get bookings by room
  async getRoomBookings(roomId) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('roomId', '==', roomId),
        where('status', '!=', 'cancelled'),
        orderBy('checkIn', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting room bookings:', error);
      throw error;
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const newBooking = createBooking({
        ...bookingData,
        checkIn: Timestamp.fromDate(new Date(bookingData.checkIn)),
        checkOut: Timestamp.fromDate(new Date(bookingData.checkOut))
      });
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...newBooking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update availability
      await this.updateAvailability(
        bookingData.roomId, 
        bookingData.checkIn, 
        bookingData.checkOut, 
        docRef.id
      );
      
      return {
        id: docRef.id,
        ...newBooking
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const docRef = doc(db, COLLECTION_NAME, bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Update availability
  async updateAvailability(roomId, checkIn, checkOut, bookingId) {
    try {
      const availabilityRef = collection(db, 'availability');
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      
      // Create availability records for each day
      const currentDate = new Date(startDate);
      while (currentDate < endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        await addDoc(availabilityRef, {
          roomId,
          date: dateStr,
          isAvailable: false,
          bookingId
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },

  // Check room availability
  async checkAvailability(roomId, checkIn, checkOut) {
    try {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const dates = [];
      
      const currentDate = new Date(startDate);
      while (currentDate < endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const q = query(
        collection(db, 'availability'),
        where('roomId', '==', roomId),
        where('date', 'in', dates),
        where('isAvailable', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.empty; // Returns true if available
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};