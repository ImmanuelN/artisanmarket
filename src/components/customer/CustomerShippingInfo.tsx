import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TruckIcon, 
  MapPinIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  HomeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Modal } from '../ui';
import { RootState } from '../../store/store';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';

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

const CustomerShippingInfo = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressType: 'home' as const,
    isDefault: false
  });
  const [updateFormData, setUpdateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressType: 'home' as const,
    isDefault: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchShippingAddresses();
  }, []);

  const fetchShippingAddresses = async () => {
    try {
      const response = await api.get('/customers/shipping-addresses');
      setShippingAddresses(response.data.addresses);
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
    }
  };

  const validateForm = (data: typeof formData, errorSetter: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!data.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!data.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!data.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!data.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!data.country.trim()) {
      newErrors.country = 'Country is required';
    }

    errorSetter(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isUpdate = false) => {
    const { name, value, type } = e.target;
    const targetFormData = isUpdate ? updateFormData : formData;
    const setTargetFormData = isUpdate ? setUpdateFormData : setFormData;
    const targetErrors = isUpdate ? updateErrors : errors;
    const setTargetErrors = isUpdate ? setUpdateErrors : setErrors;
    
    let formattedValue = value;
    // Handle checkbox for isDefault
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      // Assign string 'true' or 'false' to match expected type
      formattedValue = checked ? 'true' : 'false';
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
      const response = await api.post('/customers/shipping-addresses', formData);
      
      showSuccessNotification('Shipping address added successfully!');
      await fetchShippingAddresses();
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        addressType: 'home',
        isDefault: false
      });
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to add shipping address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(updateFormData, setUpdateErrors)) {
      return;
    }

    if (!selectedAddress) return;

    setIsLoading(true);
    try {
      const response = await api.put(`/customers/shipping-addresses/${selectedAddress.id}`, updateFormData);
      
      showSuccessNotification('Shipping address updated successfully!');
      await fetchShippingAddresses();
      setShowUpdateModal(false);
      setSelectedAddress(null);
      setUpdateFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        addressType: 'home',
        isDefault: false
      });
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to update shipping address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddress) return;

    setIsLoading(true);
    try {
      await api.delete(`/customers/shipping-addresses/${selectedAddress.id}`);
      showSuccessNotification('Shipping address deleted successfully');
      await fetchShippingAddresses();
      setShowDeleteModal(false);
      setSelectedAddress(null);
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || 'Failed to delete shipping address');
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setUpdateFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      addressType: address.addressType as 'home' | 'work' | 'other',
      isDefault: address.isDefault
    });
    setShowUpdateModal(true);
  };

  const openDeleteModal = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <HomeIcon className="w-4 h-4" />;
      case 'work':
        return <BuildingOfficeIcon className="w-4 h-4" />;
      default:
        return <MapPinIcon className="w-4 h-4" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'bg-blue-100 text-blue-800';
      case 'work':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add Shipping Address</h2>
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>

        <Card>
          <Card.Content className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="United States"
                  />
                </div>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Set as default shipping address
                  </label>
                </div>
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
                      Adding...
                    </>
                  ) : (
                    'Add Address'
                  )}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
          <Button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {shippingAddresses.length === 0 ? (
          <Card>
            <Card.Content className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Shipping Addresses</h3>
                <p className="text-gray-600 mb-6">
                  Add your shipping addresses for faster checkout
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl mb-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900 mb-2">
                        Convenient Shipping
                      </h4>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Save your shipping addresses to speed up the checkout process. 
                        You can add multiple addresses for home, work, or other locations.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 text-base font-medium"
                  size="lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add First Address
                </Button>
              </div>
            </Card.Content>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingAddresses.map((address) => (
              <Card key={address.id} hover>
                <Card.Content className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getAddressTypeColor(address.addressType)}`}>
                        {getAddressTypeIcon(address.addressType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {address.addressType} Address
                        </h3>
                        {address.isDefault && (
                          <Badge variant="success" className="ml-2">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUpdateModal(address)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteModal(address)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-900 font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-500">{address.email}</p>
                      <p className="text-sm text-gray-500">{address.phone}</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Shipping Address"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="firstName"
                  value={updateFormData.firstName}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    updateErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
              </div>
              {updateErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={updateFormData.lastName}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {updateErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={updateFormData.email}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    updateErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {updateErrors.email && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={updateFormData.phone}
                  onChange={(e) => handleInputChange(e, true)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    updateErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {updateErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={updateFormData.address}
              onChange={(e) => handleInputChange(e, true)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                updateErrors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main Street"
            />
            {updateErrors.address && (
              <p className="text-red-500 text-xs mt-1">{updateErrors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={updateFormData.city}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="New York"
              />
              {updateErrors.city && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={updateFormData.state}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="NY"
              />
              {updateErrors.state && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={updateFormData.zipCode}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10001"
              />
              {updateErrors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{updateErrors.zipCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <div className="relative">
              <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="country"
                value={updateFormData.country}
                onChange={(e) => handleInputChange(e, true)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  updateErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="United States"
              />
            </div>
            {updateErrors.country && (
              <p className="text-red-500 text-xs mt-1">{updateErrors.country}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                name="addressType"
                value={updateFormData.addressType}
                onChange={(e) => handleInputChange(e, true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="isDefault"
                checked={updateFormData.isDefault}
                onChange={(e) => handleInputChange(e, true)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Set as default shipping address
              </label>
            </div>
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
                'Update Address'
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
        title="Delete Shipping Address"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  Are you sure you want to delete this shipping address?
                </p>
                <p className="text-sm text-red-700">
                  This action cannot be undone. You will need to add the address again if needed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="destructive"
              onClick={handleDeleteAddress}
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
                  Delete Address
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
};

export default CustomerShippingInfo; 