import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';

// Public Pages
import { Home } from '../pages/Home';
import { Rooms } from '../pages/Rooms';
import { RoomDetail } from '../pages/RoomDetail';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Booking } from '../pages/Booking';
import { BookingConfirmation } from '../pages/BookingConfirmation';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { MyBookings } from '../pages/MyBookings';

// Admin Pages
import { Dashboard } from '../pages/admin/Dashboard';
import { RoomsManagement } from '../pages/admin/RoomsManagement';
import { AddRoom } from '../pages/admin/AddRoom';
import { EditRoom } from '../pages/admin/EditRoom';
import { Bookings } from '../pages/admin/Bookings';
import { Analytics } from '../pages/admin/Analytics';
import { Settings } from '../pages/admin/Settings';
import { Payment } from '../pages/Payment';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Route>

      

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<RoomsManagement />} />
        <Route path="rooms/new" element={<AddRoom />} />
        <Route path="rooms/:id/edit" element={<EditRoom />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};