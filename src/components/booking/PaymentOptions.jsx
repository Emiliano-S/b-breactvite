import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PaymentOptions = ({ booking, onSuccess, onError }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.totalPrice,
          customerEmail: booking.guestInfo.email
        })
      });

      const session = await response.json();

      // Redirect to checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      showToast(error.message, 'error');
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: 'USD'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer border-2 transition-colors ${
            paymentMethod === 'stripe' ? 'border-primary-500' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('stripe')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Powered by Stripe</p>
              </div>
            </div>
            <input
              type="radio"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              className="text-primary-600"
            />
          </div>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-colors ${
            paymentMethod === 'paypal' ? 'border-primary-500' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-500">Pay with PayPal account</p>
              </div>
            </div>
            <input
              type="radio"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="text-primary-600"
            />
          </div>
        </Card>
      </div>

      {/* Payment Amount */}
      <Card className="bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-primary-600">
            ${booking.totalPrice}
          </span>
        </div>
      </Card>

      {/* Payment Buttons */}
      <div>
        {paymentMethod === 'stripe' ? (
          <Button
            variant="primary"
            fullWidth
            size="large"
            onClick={handleStripePayment}
            loading={processing}
          >
            Pay with Card
          </Button>
        ) : (
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: booking.totalPrice.toString()
                    },
                    description: `Booking for ${booking.room.name}`
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                onSuccess({
                  paymentMethod: 'paypal',
                  transactionId: details.id,
                  details
                });
              }}
              onError={onError}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};