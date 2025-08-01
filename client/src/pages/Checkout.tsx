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
  EnvelopeIcon,
  PlusIcon,
  CheckIcon,
  BuildingOfficeIcon,
  HomeIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Input, Badge, PaymentForm, BankTransferForm } from '../components/ui';
import { clearCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import { showSuccessNotification, showErrorNotification } from '../utils/notifications';
import api from '../utils/api';

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
  createdAt: string;
  updatedAt: string;
}

interface BankAccountInfo {
  id: string;
  type: string;
  cardHolderName: string;
  maskedCardNumber: string;
  maskedExpiry: string;
  bankName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethod {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  bankName: string;
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
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Shipping state
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<ShippingAddress | null>(null);
  const [useExistingShipping, setUseExistingShipping] = useState(true);
  const [showNewShippingForm, setShowNewShippingForm] = useState(false);
  const [newShippingAddress, setNewShippingAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressType: 'home' as const,
    isDefault: false
  });

  // Payment state
  const [bankAccountInfo, setBankAccountInfo] = useState<BankAccountInfo | null>(null);
  const [useExistingPayment, setUseExistingPayment] = useState(true);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank-transfer'>('card');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderDetails] = useState({
    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  });
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [transferId, setTransferId] = useState<string>('');
  const [customerBalance, setCustomerBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

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
    } else {
      fetchUserData();
    }
  }, [items, navigate]);

  const fetchUserData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch shipping addresses
      const shippingResponse = await api.get('/customers/shipping-addresses');
      const addresses = shippingResponse.data.addresses;
      setShippingAddresses(addresses);
      
      // Set default shipping address if available
      const defaultAddress = addresses.find((addr: ShippingAddress) => addr.isDefault);
      if (defaultAddress) {
        setSelectedShippingAddress(defaultAddress);
      } else if (addresses.length > 0) {
        setSelectedShippingAddress(addresses[0]);
      } else {
        setUseExistingShipping(false);
        setShowNewShippingForm(true);
      }

      // Fetch bank account info
      try {
        const bankResponse = await api.get('/bank/account');
        setBankAccountInfo(bankResponse.data.bankAccount);
      } catch (error) {
        // No bank account found, user will need to add one
        setUseExistingPayment(false);
        setShowNewPaymentForm(true);
      }

      // Fetch customer balance
      try {
        const balanceResponse = await api.get('/customer-balance/balance');
        setCustomerBalance(balanceResponse.data.balance.spendingBalance);
      } catch (error) {
        console.error('Error fetching customer balance:', error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showErrorNotification('Failed to load your saved information');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleNewShippingChange = (field: keyof typeof newShippingAddress, value: string) => {
    setNewShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleNewPaymentChange = (field: keyof PaymentMethod, value: string) => {
    setNewPaymentMethod(prev => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (useExistingShipping) {
      return selectedShippingAddress !== null;
    } else {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
      return required.every(field => {
        const value = newShippingAddress[field as keyof typeof newShippingAddress];
        return typeof value === 'string' && value.trim() !== '';
      });
    }
  };

  const validatePayment = () => {
    if (useExistingPayment) {
      return bankAccountInfo !== null && customerBalance !== null && customerBalance >= orderSummary.total;
    } else {
      // For new bank account connection, validate the form fields
      const required = ['cardholderName', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'bankName'];
      return required.every(field => {
        const value = newPaymentMethod[field as keyof PaymentMethod];
        return typeof value === 'string' && value.trim() !== '';
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) {
      showErrorNotification('Please complete shipping information');
      return;
    }
    if (currentStep === 2) {
      if (!validatePayment()) {
        if (customerBalance !== null && customerBalance < orderSummary.total) {
          showErrorNotification(`Insufficient balance. You have $${customerBalance.toLocaleString()} available, but need $${orderSummary.total.toFixed(2)}`);
        } else {
          showErrorNotification('Please complete payment information');
        }
        return;
      }
      // Don't deduct here - just proceed to review
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // First, if using existing payment, deduct from balance
      if (useExistingPayment && bankAccountInfo) {
        try {
          const balanceResponse = await api.post('/customer-balance/deduct', {
            amount: orderSummary.total
          });

          if (!balanceResponse.data.success) {
            showErrorNotification('Insufficient balance to complete this order');
            return;
          }

          setCustomerBalance(balanceResponse.data.newBalance);
        } catch (error: any) {
          showErrorNotification(error.response?.data?.message || 'Failed to process payment');
          return;
        }
      }

      // Create order data
      const orderData = {
        items: items.map((item: any) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          vendor: item.vendor._id
        })),
        shippingAddress: useExistingShipping ? selectedShippingAddress : newShippingAddress,
        paymentMethod: useExistingPayment && bankAccountInfo ? {
          cardNumber: bankAccountInfo.maskedCardNumber,
          cardholderName: bankAccountInfo.cardHolderName,
          expiryMonth: bankAccountInfo.maskedExpiry.substring(0, 2),
          expiryYear: bankAccountInfo.maskedExpiry.substring(2, 4)
        } : {
          cardNumber: newPaymentMethod.cardNumber.replace(/\s/g, ''),
          cardholderName: newPaymentMethod.cardholderName,
          expiryMonth: newPaymentMethod.expiryMonth,
          expiryYear: newPaymentMethod.expiryYear
        },
        shippingMethod: shippingMethod,
        orderNotes: orderNotes,
        subtotal: orderSummary.subtotal,
        shippingCost: orderSummary.shipping,
        tax: orderSummary.tax,
        total: orderSummary.total,
        paymentStatus: useExistingPayment ? 'completed' : 'pending'
      };

      // Place order
      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        showSuccessNotification('Order placed successfully!');
        // Clear cart
        dispatch(clearCart());
        // Redirect to order confirmation
        navigate('/order-confirmation', { 
          state: { orderId: response.data.order._id }
        });
      }
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentIntentId(paymentId);
    showSuccessNotification('Payment successful!');
    handleNext();
  };

  const handlePaymentError = (error: string) => {
    showErrorNotification(`Payment failed: ${error}`);
  };

  const handleTransferSuccess = (transferId: string) => {
    setTransferId(transferId);
    showSuccessNotification('Bank transfer initiated successfully!');
    handleNext();
  };

  const handleTransferError = (error: string) => {
    showErrorNotification(`Transfer failed: ${error}`);
  };

  const handleDeductFromBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const response = await api.post('/customer-balance/deduct', {
        amount: orderSummary.total
      });

      if (response.data.success) {
        setCustomerBalance(response.data.newBalance);
        showSuccessNotification(`Payment processed! Deducted $${orderSummary.total.toFixed(2)} from your balance`);
      }
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to process payment');
      // Don't proceed to next step if deduction fails
      return;
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return HomeIcon;
      case 'work': return BuildingOfficeIcon;
      default: return MapPinIcon;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'text-blue-600 bg-blue-50';
      case 'work': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
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
                    <div key={step.id} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${
                        currentStep >= step.id 
                          ? 'bg-amber-600 border-amber-600 text-white' 
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircleIcon className="w-4 h-4 md:w-6 md:h-6" />
                        ) : (
                          <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </div>
                      <span className={`ml-1 md:ml-2 text-xs md:text-sm font-medium ${
                        currentStep >= step.id ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 md:mx-4 ${
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

                      {isLoadingData ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                          <span className="ml-2 text-gray-600">Loading your information...</span>
                        </div>
                      ) : (
                        <>
                          {/* Existing Shipping Addresses */}
                          {shippingAddresses.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      checked={useExistingShipping}
                                      onChange={() => {
                                        setUseExistingShipping(true);
                                        setShowNewShippingForm(false);
                                      }}
                                      className="text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Use existing</span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      checked={!useExistingShipping}
                                      onChange={() => {
                                        setUseExistingShipping(false);
                                        setShowNewShippingForm(true);
                                      }}
                                      className="text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Add new</span>
                                  </label>
                                </div>
                              </div>

                              {useExistingShipping && (
                                <div className="space-y-3">
                                  {shippingAddresses.map((address) => {
                                    const AddressIcon = getAddressTypeIcon(address.addressType);
                                    return (
                                      <label
                                        key={address.id}
                                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                          selectedShippingAddress?.id === address.id
                                            ? 'border-amber-600 bg-amber-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name="shippingAddress"
                                          value={address.id}
                                          checked={selectedShippingAddress?.id === address.id}
                                          onChange={() => setSelectedShippingAddress(address)}
                                          className="text-amber-600 focus:ring-amber-500 mt-1"
                                        />
                                        <div className="ml-3 flex-1">
                                          <div className="flex items-center mb-2">
                                            <AddressIcon className={`w-4 h-4 mr-2 ${getAddressTypeColor(address.addressType).split(' ')[0]}`} />
                                            <span className="font-medium text-gray-900">
                                              {address.firstName} {address.lastName}
                                            </span>
                                            {address.isDefault && (
                                              <Badge variant="success" className="ml-2">Default</Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">{address.address}</p>
                                          <p className="text-sm text-gray-600">
                                            {address.city}, {address.state} {address.zipCode}
                                          </p>
                                          <p className="text-sm text-gray-600">{address.country}</p>
                                          <p className="text-sm text-gray-600">{address.email}</p>
                                          <p className="text-sm text-gray-600">{address.phone}</p>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* New Shipping Address Form */}
                          {(!useExistingShipping || shippingAddresses.length === 0) && (
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {shippingAddresses.length === 0 ? 'Shipping Address' : 'New Shipping Address'}
                                </h3>
                                {shippingAddresses.length > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setUseExistingShipping(true);
                                      setShowNewShippingForm(false);
                                    }}
                                  >
                                    Use existing address
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  label="First Name"
                                  value={newShippingAddress.firstName}
                                  onChange={(e) => handleNewShippingChange('firstName', e.target.value)}
                                  required
                                />
                                <Input
                                  label="Last Name"
                                  value={newShippingAddress.lastName}
                                  onChange={(e) => handleNewShippingChange('lastName', e.target.value)}
                                  required
                                />
                                <Input
                                  label="Email"
                                  type="email"
                                  value={newShippingAddress.email}
                                  onChange={(e) => handleNewShippingChange('email', e.target.value)}
                                  required
                                />
                                <Input
                                  label="Phone"
                                  value={newShippingAddress.phone}
                                  onChange={(e) => handleNewShippingChange('phone', e.target.value)}
                                  required
                                />
                                <Input
                                  label="Address"
                                  value={newShippingAddress.address}
                                  onChange={(e) => handleNewShippingChange('address', e.target.value)}
                                  required
                                  className="md:col-span-2"
                                />
                                <Input
                                  label="City"
                                  value={newShippingAddress.city}
                                  onChange={(e) => handleNewShippingChange('city', e.target.value)}
                                  required
                                />
                                <Input
                                  label="State/Province"
                                  value={newShippingAddress.state}
                                  onChange={(e) => handleNewShippingChange('state', e.target.value)}
                                />
                                <Input
                                  label="ZIP/Postal Code"
                                  value={newShippingAddress.zipCode}
                                  onChange={(e) => handleNewShippingChange('zipCode', e.target.value)}
                                  required
                                />
                                <Input
                                  label="Country"
                                  value={newShippingAddress.country}
                                  onChange={(e) => handleNewShippingChange('country', e.target.value)}
                                  required
                                />
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address Type
                                  </label>
                                  <select
                                    value={newShippingAddress.addressType}
                                    onChange={(e) => handleNewShippingChange('addressType', e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                  >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Shipping Method */}
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
                        </>
                      )}
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
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <Card>
                      <Card.Content>
                        <div className="flex items-center mb-6">
                          <CreditCardIcon className="w-6 h-6 text-amber-600 mr-3" />
                          <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                        </div>

                        {isLoadingData ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                            <span className="ml-2 text-gray-600">Loading your payment information...</span>
                          </div>
                        ) : (
                          <>
                            {/* Existing Bank Account */}
                            {bankAccountInfo && (
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-medium text-gray-900">Saved Payment Method</h3>
                                  <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        checked={useExistingPayment}
                                        onChange={() => {
                                          setUseExistingPayment(true);
                                          setShowNewPaymentForm(false);
                                        }}
                                        className="text-amber-600 focus:ring-amber-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">Use existing</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        checked={!useExistingPayment}
                                        onChange={() => {
                                          setUseExistingPayment(false);
                                          setShowNewPaymentForm(true);
                                        }}
                                        className="text-amber-600 focus:ring-amber-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">Add new</span>
                                    </label>
                                  </div>
                                </div>

                                {useExistingPayment && (
                                  <div className="p-4 border-2 border-amber-600 bg-amber-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <CreditCardIcon className="w-5 h-5 text-amber-600 mr-3" />
                                        <div>
                                          <p className="font-medium text-gray-900">{bankAccountInfo.cardHolderName}</p>
                                          <p className="text-sm text-gray-600">{bankAccountInfo.maskedCardNumber}</p>
                                          <p className="text-sm text-gray-600">Expires: {bankAccountInfo.maskedExpiry}</p>
                                          <p className="text-sm text-gray-600">{bankAccountInfo.bankName}</p>
                                        </div>
                                      </div>
                                      <CheckIcon className="w-5 h-5 text-amber-600" />
                                    </div>
                                    {customerBalance !== null && (
                                      <div className="mt-3 pt-3 border-t border-amber-200">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-gray-600">Available Balance:</span>
                                          <span className={`font-semibold ${
                                            customerBalance >= orderSummary.total ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            ${customerBalance.toLocaleString()}
                                          </span>
                                        </div>
                                        {customerBalance < orderSummary.total && (
                                          <p className="text-xs text-red-600 mt-1">
                                            Insufficient balance for this purchase
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* New Payment Method */}
                            {(!useExistingPayment || !bankAccountInfo) && (
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-medium text-gray-900">
                                    {!bankAccountInfo ? 'Connect Bank Account' : 'New Payment Method'}
                                  </h3>
                                  {bankAccountInfo && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setUseExistingPayment(true);
                                        setShowNewPaymentForm(false);
                                      }}
                                    >
                                      Use existing payment
                                    </Button>
                                  )}
                                </div>

                                {/* Bank Account Connection Form */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                  <div className="mb-4">
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Bank Account</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                      Securely connect your bank account to complete your purchase. Your information is encrypted and secure.
                                    </p>
                                  </div>

                                  <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setIsProcessing(true);
                                    try {
                                      const response = await api.post('/bank/connect', {
                                        cardHolderName: newPaymentMethod.cardholderName,
                                        cardNumber: newPaymentMethod.cardNumber.replace(/\s/g, ''),
                                        expiryMonth: newPaymentMethod.expiryMonth,
                                        expiryYear: newPaymentMethod.expiryYear,
                                        cvv: newPaymentMethod.cvv,
                                        bankName: newPaymentMethod.bankName,
                                        type: 'customer'
                                      });

                                      if (response.data.success) {
                                        showSuccessNotification('Bank account connected successfully!');
                                        // Refresh bank account info
                                        const bankResponse = await api.get('/bank/account');
                                        setBankAccountInfo(bankResponse.data.bankAccount);
                                        
                                        // Fetch customer balance (should be created automatically)
                                        try {
                                          const balanceResponse = await api.get('/customer-balance/balance');
                                          setCustomerBalance(balanceResponse.data.balance.spendingBalance);
                                        } catch (error) {
                                          console.error('Error fetching customer balance:', error);
                                        }
                                        
                                        setUseExistingPayment(true);
                                        setShowNewPaymentForm(false);
                                        // Proceed to next step
                                        handleNext();
                                      }
                                    } catch (error: any) {
                                      showErrorNotification(error.response?.data?.message || 'Failed to connect bank account');
                                    } finally {
                                      setIsProcessing(false);
                                    }
                                  }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Cardholder Name
                                        </label>
                                        <div className="relative">
                                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input
                                            type="text"
                                            value={newPaymentMethod.cardholderName}
                                            onChange={(e) => handleNewPaymentChange('cardholderName', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="John Doe"
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Bank Name
                                        </label>
                                        <div className="relative">
                                          <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input
                                            type="text"
                                            value={newPaymentMethod.bankName}
                                            onChange={(e) => handleNewPaymentChange('bankName', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Bank of America"
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Card Number
                                        </label>
                                        <div className="relative">
                                          <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input
                                            type="text"
                                            value={newPaymentMethod.cardNumber}
                                            onChange={(e) => {
                                              const value = e.target.value.replace(/\s/g, '');
                                              const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                              handleNewPaymentChange('cardNumber', formatted);
                                            }}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Expiry Month
                                        </label>
                                        <select
                                          value={newPaymentMethod.expiryMonth}
                                          onChange={(e) => handleNewPaymentChange('expiryMonth', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                          required
                                        >
                                          <option value="">Month</option>
                                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                            <option key={month} value={month.toString().padStart(2, '0')}>
                                              {month.toString().padStart(2, '0')}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Expiry Year
                                        </label>
                                        <select
                                          value={newPaymentMethod.expiryYear}
                                          onChange={(e) => handleNewPaymentChange('expiryYear', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                          required
                                        >
                                          <option value="">Year</option>
                                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                            <option key={year} value={year.toString()}>
                                              {year}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          CVV
                                        </label>
                                        <div className="relative">
                                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input
                                            type="password"
                                            value={newPaymentMethod.cvv}
                                            onChange={(e) => handleNewPaymentChange('cvv', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="123"
                                            maxLength={4}
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-6">
                                      <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full"
                                      >
                                        {isProcessing ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Connecting...
                                          </>
                                        ) : (
                                          <>
                                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                            Connect Bank Account
                                          </>
                                        )}
                                      </Button>
                                    </div>

                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                      <div className="flex items-center text-sm text-blue-700">
                                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                        Your payment information is encrypted and secure
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </Card.Content>
                    </Card>
                  </div>
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
                          {useExistingShipping && selectedShippingAddress ? (
                            <>
                              <p className="text-gray-900">
                                {selectedShippingAddress.firstName} {selectedShippingAddress.lastName}
                              </p>
                              <p className="text-gray-600">{selectedShippingAddress.address}</p>
                              <p className="text-gray-600">
                                {selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.zipCode}
                              </p>
                              <p className="text-gray-600">{selectedShippingAddress.country}</p>
                              <p className="text-gray-600">{selectedShippingAddress.email}</p>
                              <p className="text-gray-600">{selectedShippingAddress.phone}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-900">
                                {newShippingAddress.firstName} {newShippingAddress.lastName}
                              </p>
                              <p className="text-gray-600">{newShippingAddress.address}</p>
                              <p className="text-gray-600">
                                {newShippingAddress.city}, {newShippingAddress.state} {newShippingAddress.zipCode}
                              </p>
                              <p className="text-gray-600">{newShippingAddress.country}</p>
                              <p className="text-gray-600">{newShippingAddress.email}</p>
                              <p className="text-gray-600">{newShippingAddress.phone}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Payment Method Review */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {useExistingPayment && bankAccountInfo ? (
                            <>
                              <div className="flex items-center mb-2">
                                <CreditCardIcon className="w-5 h-5 text-amber-600 mr-2" />
                                <span className="font-medium">Saved Payment Method</span>
                                <Badge variant="success" className="ml-2">Ready</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{bankAccountInfo.cardHolderName}</p>
                              <p className="text-sm text-gray-600">{bankAccountInfo.maskedCardNumber}</p>
                              <p className="text-sm text-gray-600">{bankAccountInfo.bankName}</p>
                              {customerBalance !== null && useExistingPayment && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-sm text-gray-600">
                                    Payment will be deducted from your balance: <span className="font-semibold">${customerBalance.toLocaleString()}</span>
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {selectedPaymentMethod === 'card' && paymentIntentId && (
                                <>
                                  <div className="flex items-center mb-2">
                                    <CreditCardIcon className="w-5 h-5 text-amber-600 mr-2" />
                                    <span className="font-medium">Credit/Debit Card</span>
                                    <Badge variant="success" className="ml-2">Paid</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">Payment ID: {paymentIntentId}</p>
                                </>
                              )}
                              {selectedPaymentMethod === 'bank-transfer' && transferId && (
                                <>
                                  <div className="flex items-center mb-2">
                                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
                                    <span className="font-medium">Bank Transfer</span>
                                    <Badge variant="success" className="ml-2">Initiated</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">Transfer ID: {transferId}</p>
                                  <p className="text-sm text-gray-600">Processing time: 1-3 business days</p>
                                </>
                              )}
                            </>
                          )}
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
                  disabled={isLoadingBalance}
                  className="flex items-center"
                >
                  {isLoadingBalance ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </>
                  )}
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
