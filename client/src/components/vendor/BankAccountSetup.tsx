import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BanknotesIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserIcon,
  CalendarIcon,
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Modal } from '../ui';
import { RootState } from '../../store/store';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';

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

interface BankAccountSetupProps {
  onSetupComplete?: () => void;
  className?: string;
}

const BankAccountSetup: React.FC<BankAccountSetupProps> = ({ 
  onSetupComplete,
  className = '' 
}) => {

  const [bankAccountInfo, setBankAccountInfo] = useState<BankAccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: '',
    type: 'vendor'
  });
  const [updateFormData, setUpdateFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: '',
    type: 'vendor'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});

  // Fetch current bank account info on component mount
  useEffect(() => {
    fetchBankAccountInfo();
  }, []);

  const fetchBankAccountInfo = async () => {
    try {
      const response = await api.get('/bank/account');
      setBankAccountInfo(response.data.bankAccount);
    } catch (error) {
      console.error('Error fetching bank account info:', error);
    }
  };

  const validateForm = (data: typeof formData, errorSetter: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    const newErrors: Record<string, string> = {};

    if (!data.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }

    if (!data.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (data.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    } else if (data.cardNumber.replace(/\s/g, '').length > 19) {
      newErrors.cardNumber = 'Card number cannot exceed 19 digits';
    }

    if (!data.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    } else if (parseInt(data.expiryMonth) < 1 || parseInt(data.expiryMonth) > 12) {
      newErrors.expiryMonth = 'Invalid month';
    }

    if (!data.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    } else if (parseInt(data.expiryYear) < 2024) {
      newErrors.expiryYear = 'Year must be 2024 or later';
    }

    if (!data.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (data.cvv.length < 3 || data.cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    if (!data.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    errorSetter(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isUpdate = false) => {
    const { name, value } = e.target;
    const targetFormData = isUpdate ? updateFormData : formData;
    const setTargetFormData = isUpdate ? setUpdateFormData : setFormData;
    const targetErrors = isUpdate ? updateErrors : errors;
    const setTargetErrors = isUpdate ? setUpdateErrors : setErrors;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      // Add spaces every 4 digits
      formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    setTargetFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (targetErrors[name]) {
      setTargetErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, setErrors)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/bank/connect', formData);
      
      showSuccessNotification('Bank account connected successfully!');
      await fetchBankAccountInfo(); // Refresh bank account info
      setShowForm(false);
      setFormData({
        cardHolderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        bankName: '',
        type: 'vendor'
      });
      onSetupComplete?.();
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to connect bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(updateFormData, setUpdateErrors)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put('/bank/account', updateFormData);
      
      showSuccessNotification('Bank account updated successfully!');
      await fetchBankAccountInfo(); // Refresh bank account info
      setShowUpdateModal(false);
      setUpdateFormData({
        cardHolderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        bankName: '',
        type: 'vendor'
      });
      onSetupComplete?.();
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to update bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await api.delete('/bank/account');
      showSuccessNotification('Bank account deleted successfully');
      await fetchBankAccountInfo();
      setShowDeleteModal(false);
      onSetupComplete?.();
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to delete bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = () => {
    if (bankAccountInfo) {
      setUpdateFormData({
        cardHolderName: bankAccountInfo.cardHolderName,
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        bankName: bankAccountInfo.bankName,
        type: 'vendor'
      });
      setShowUpdateModal(true);
    }
  };

  if (bankAccountInfo) {
    return (
      <>
        <Card className={className}>
          <Card.Content>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Bank Account Connected</h3>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <BanknotesIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">
                  {bankAccountInfo.bankName}
                </span>
              </div>
              <p className="text-sm text-green-700">
                {bankAccountInfo.maskedCardNumber}
              </p>
              <p className="text-sm text-green-600">
                Expires: {bankAccountInfo.maskedExpiry}
              </p>
              <p className="text-sm text-green-600">
                {bankAccountInfo.cardHolderName}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Connected: {new Date(bankAccountInfo.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Your bank account information is securely stored and encrypted
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={openUpdateModal}
                disabled={isLoading}
                className="flex-1"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Update Account
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Update Modal */}
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          title="Update Bank Account"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="cardHolderName"
                  value={updateFormData.cardHolderName}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    updateErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {updateErrors.cardHolderName && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.cardHolderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number (leave blank to keep current)
              </label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                    type="text"
                    name="cardNumber"
                    value={updateFormData.cardNumber}
                    onChange={(e) => handleInputChange(e, true)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      updateErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={23}
                  />
              </div>
              {updateErrors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="expiryMonth"
                    value={updateFormData.expiryMonth}
                    onChange={(e) => handleInputChange(e, true)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      updateErrors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12"
                    maxLength={2}
                  />
                </div>
                {updateErrors.expiryMonth && (
                  <p className="text-red-500 text-xs mt-1">{updateErrors.expiryMonth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  name="expiryYear"
                  value={updateFormData.expiryYear}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    updateErrors.expiryYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2025"
                  maxLength={4}
                />
                {updateErrors.expiryYear && (
                  <p className="text-red-500 text-xs mt-1">{updateErrors.expiryYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="cvv"
                    value={updateFormData.cvv}
                    onChange={(e) => handleInputChange(e, true)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      updateErrors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
                {updateErrors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{updateErrors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={updateFormData.bankName}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Chase Bank"
              />
              {updateErrors.bankName && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.bankName}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Account'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpdateModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Bank Account"
        >
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Are you sure you want to delete your bank account?
                  </p>
                  <p className="text-sm text-red-700">
                    This action cannot be undone. You will need to reconnect your bank account to receive payouts.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  if (showForm) {
    return (
      <Card className={className}>
        <Card.Content>
          <div className="flex items-center mb-4">
            <BanknotesIcon className="w-6 h-6 text-amber-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Connect Bank Account</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.cardHolderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={23}
                  />
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white ${
                      errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.expiryMonth && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white ${
                    errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Chase Bank"
              />
              {errors.bankName && (
                <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Bank Account
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500 text-center">
            By connecting your bank account, you agree to our terms of service and privacy policy
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Content>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BanknotesIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Bank Account</h3>
          <p className="text-gray-600">
            Set up secure payments to receive your earnings
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl mb-6">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-2">
                Required for Payouts
              </h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                To receive payments from your sales, you need to connect a bank account. 
                Your financial information is encrypted and stored securely.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Bank-Level Security</p>
              <p className="text-xs text-green-700">256-bit encryption protects your data</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Instant Transfers</p>
              <p className="text-xs text-blue-700">Receive payments directly to your account</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <ShieldCheckIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">Zero Fees</p>
              <p className="text-xs text-purple-700">No charges for receiving payments</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full py-3 text-base font-medium"
            size="lg"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Connect Bank Account
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="flex items-center justify-center text-xs text-gray-500">
            <LockClosedIcon className="w-3 h-3 mr-1" />
            Secure & Encrypted
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-xs font-medium text-gray-600">ℹ</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 leading-relaxed">
                By connecting your bank account, you agree to our{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700 underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default BankAccountSetup; 