import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Input, Badge } from '../components/ui';
import { clearCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import { showSuccessNotification, showErrorNotification } from '../utils/notifications';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderDetails] = useState({
    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  });

  // Calculate order summary
  const orderSummary: OrderSummary = {
    subtotal: totalPrice,
    shipping: shippingMethod === 'express' ? 15 : shippingMethod === 'standard' ? 8 : 0,
    tax: totalPrice * 0.08, // 8% tax
    total: totalPrice + (shippingMethod === 'express' ? 15 : shippingMethod === 'standard' ? 8 : 0) + (totalPrice * 0.08)
  };

  const shippingOptions = [
    { id: 'free', name: 'Free Shipping', price: 0, time: '7-10 business days' },
    { id: 'standard', name: 'Standard Shipping', price: 8, time: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 15, time: '1-2 business days' }
  ];

  const steps = [
    { id: 1, name: 'Shipping', icon: TruckIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckCircleIcon }
  ];

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    return required.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '');
  };

  const validatePayment = () => {
    return paymentMethod.cardNumber.length >= 13 && 
           paymentMethod.cardholderName.trim() !== '' && 
           paymentMethod.expiryMonth && 
           paymentMethod.expiryYear && 
           paymentMethod.cvv.length >= 3;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) {
      showErrorNotification('Please fill in all shipping information');
      return;
    }
    if (currentStep === 2 && !validatePayment()) {
      showErrorNotification('Please fill in all payment information');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to confirmation
      dispatch(clearCart());
      navigate(`/order-confirmation?orderId=${orderDetails.orderId}&total=${orderSummary.total.toFixed(2)}`);
    } catch (error) {
      showErrorNotification('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <Card className="mb-8">
              <Card.Content>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id 
                          ? 'bg-amber-600 border-amber-600 text-white' 
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        currentStep >= step.id ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id ? 'bg-amber-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Content>
                      <div className="flex items-center mb-6">
                        <TruckIcon className="w-6 h-6 text-amber-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input
                          label="First Name"
                          value={shippingAddress.firstName}
                          onChange={(e) => handleAddressChange('firstName', e.target.value)}
                          required
                        />
                        <Input
                          label="Last Name"
                          value={shippingAddress.lastName}
                          onChange={(e) => handleAddressChange('lastName', e.target.value)}
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => handleAddressChange('email', e.target.value)}
                          required
                        />
                        <Input
                          label="Phone"
                          value={shippingAddress.phone}
                          onChange={(e) => handleAddressChange('phone', e.target.value)}
                          required
                        />
                        <Input
                          label="Address"
                          value={shippingAddress.address}
                          onChange={(e) => handleAddressChange('address', e.target.value)}
                          required
                          className="md:col-span-2"
                        />
                        <Input
                          label="City"
                          value={shippingAddress.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          required
                        />
                        <Input
                          label="State/Province"
                          value={shippingAddress.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          required
                        />
                        <Input
                          label="ZIP/Postal Code"
                          value={shippingAddress.zipCode}
                          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                          required
                        />
                        <Input
                          label="Country"
                          value={shippingAddress.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          required
                        />
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h3>
                        <div className="space-y-3">
                          {shippingOptions.map((option) => (
                            <label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="shipping"
                                value={option.id}
                                checked={shippingMethod === option.id}
                                onChange={(e) => setShippingMethod(e.target.value)}
                                className="text-amber-600 focus:ring-amber-500"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-gray-900">{option.name}</p>
                                    <p className="text-sm text-gray-600">{option.time}</p>
                                  </div>
                                  <span className="font-semibold text-gray-900">
                                    {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                                  </span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Content>
                      <div className="flex items-center mb-6">
                        <CreditCardIcon className="w-6 h-6 text-amber-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input
                          label="Card Number"
                          value={paymentMethod.cardNumber}
                          onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                          className="md:col-span-2"
                        />
                        <Input
                          label="Cardholder Name"
                          value={paymentMethod.cardholderName}
                          onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                          required
                          className="md:col-span-2"
                        />
                        <select
                          value={paymentMethod.expiryMonth}
                          onChange={(e) => handlePaymentChange('expiryMonth', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <select
                          value={paymentMethod.expiryYear}
                          onChange={(e) => handlePaymentChange('expiryYear', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <Input
                          label="CVV"
                          value={paymentMethod.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm text-gray-600">
                          <LockClosedIcon className="w-4 h-4 mr-2" />
                          Your payment information is encrypted and secure
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Content>
                      <div className="flex items-center mb-6">
                        <CheckCircleIcon className="w-6 h-6 text-amber-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>
                      </div>

                      {/* Shipping Address Review */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900">
                            {shippingAddress.firstName} {shippingAddress.lastName}
                          </p>
                          <p className="text-gray-600">{shippingAddress.address}</p>
                          <p className="text-gray-600">
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                          </p>
                          <p className="text-gray-600">{shippingAddress.country}</p>
                          <p className="text-gray-600">{shippingAddress.email}</p>
                          <p className="text-gray-600">{shippingAddress.phone}</p>
                        </div>
                      </div>

                      {/* Payment Method Review */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900">{paymentMethod.cardholderName}</p>
                          <p className="text-gray-600">
                            •••• •••• •••• {paymentMethod.cardNumber.slice(-4)}
                          </p>
                          <p className="text-gray-600">
                            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                          </p>
                        </div>
                      </div>

                      {/* Order Notes */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Order Notes (Optional)</h3>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Add any special instructions or notes for your order..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center"
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-4 h-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <Card.Content>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <img
                        src={item.images[0]?.url || 'https://via.placeholder.com/60x60'}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-sm text-green-700">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
