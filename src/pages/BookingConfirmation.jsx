import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CheckCircle, Calendar, Download } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const BookingConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your reservation has been successfully confirmed. 
            We've sent a confirmation email to your registered email address.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <p className="text-sm text-gray-600">Confirmation #: BNB-2025-001234</p>
            <p className="text-sm text-gray-600">Check-in: June 15, 2025</p>
            <p className="text-sm text-gray-600">Check-out: June 18, 2025</p>
          </div>

          <div className="space-y-3">
            <Link to="/bookings" className="block">
              <Button variant="primary" fullWidth>
                <Calendar className="w-4 h-4 mr-2" />
                View My Bookings
              </Button>
            </Link>
            
            <Button variant="outline" fullWidth>
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            
            <Link to="/" className="block">
              <Button variant="ghost" fullWidth>
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};