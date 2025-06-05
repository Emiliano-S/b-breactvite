import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  // Upload room image
  async uploadRoomImage(file) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const fileExtension = file.name.split('.').pop();
      const fileName = `rooms/${timestamp}_${randomString}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  // Delete image by URL
  async deleteImage(imageUrl) {
    try {
      // Create reference from URL
      const imageRef = ref(storage, imageUrl);
      
      // Delete the file
      await deleteObject(imageRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error if image not found (already deleted)
      if (error.code !== 'storage/object-not-found') {
        throw new Error('Failed to delete image');
      }
    }
  },

  // Upload multiple images
  async uploadMultipleImages(files) {
    try {
      const uploadPromises = files.map(file => this.uploadRoomImage(file));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  },

  // Get storage reference from URL
  getStorageRefFromUrl(url) {
    try {
      // Extract path from Firebase Storage URL
      const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
      if (url.startsWith(baseUrl)) {
        const path = url.substring(baseUrl.length).split('?')[0];
        return decodeURIComponent(path);
      }
      return null;
    } catch (error) {
      console.error('Error parsing storage URL:', error);
      return null;
    }
  },

  // Upload user avatar
  async uploadUserAvatar(userId, file) {
    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `users/${userId}/avatar_${timestamp}.${fileExtension}`;
      
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }
};