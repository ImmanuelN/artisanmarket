import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Card } from './index';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  className?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  className = ''
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      const response = await api.post('/payments/create-payment-intent', {
        amount,
        currency: 'usd',
        metadata: {
          type: 'order_payment'
        }
      });

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
      } else {
        setError('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onPaymentError(stripeError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        showSuccessNotification('Payment successful!');
        onPaymentSuccess(paymentIntent.id);
      } else {
        setError('Payment failed');
        onPaymentError('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed');
      onPaymentError('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Card className={className}>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Total Amount: <span className="font-semibold">${amount.toFixed(2)}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Details
              </label>
              <div className="border border-gray-300 rounded-lg p-3 bg-white">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            isLoading={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
};

export default PaymentForm; 