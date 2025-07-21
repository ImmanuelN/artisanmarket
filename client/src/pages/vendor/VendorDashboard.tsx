import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  PhotoIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../store/store'
import { Container, Card, Button, Badge, Input } from '../../components/ui'
import { setVendorProfile, setVendorStats, setVendorOrders, setLoading, setError } from '../../store/slices/vendorSlice'
import api from '../../utils/api'
import { Store } from '../../types/stores';
import { CheckCircle, Clock, XCircle, Shield } from 'lucide-react';
import StoreLogo from '../../components/ui/StoreLogo';
import StoreBanner from '../../components/ui/StoreBanner';
import ImageKit from "imagekit-javascript";
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import Modal from '../../components/ui/Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ProductForm from '../../components/forms/ProductForm';
import ProductManagementTab from './tabs/ProductManagementTab';

const VendorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, products, stats, orders, loading } = useSelector((state: RootState) => state.vendor)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [profileData, setProfileData] = useState<Store | null>(null)
  const [uploading, setUploading] = useState<{ logo: boolean; banner: boolean }>({ logo: false, banner: false });
  const [isDirty, setIsDirty] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nextTab, setNextTab] = useState('');
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [vendorProducts, setVendorProducts] = useState([]);

  // Set initial form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  // API Functions
  const fetchVendorProfile = async () => {
    try {
      dispatch(setLoading(true))
      const response = await api.get('/vendors/profile')
      if (response.data.success) {
        dispatch(setVendorProfile(response.data.profile))
        setProfileData(response.data.profile) // Set local state directly
      }
    } catch (error) {
      console.error('Error fetching vendor profile:', error)
      dispatch(setError('Failed to load profile'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchVendorStats = async () => {
    try {
      const response = await api.get('/vendors/stats')
      if (response.data.success) {
        dispatch(setVendorStats(response.data.stats))
      }
    } catch (error) {
      console.error('Error fetching vendor stats:', error)
      dispatch(setError('Failed to load stats'))
    }
  }

  const fetchVendorOrders = async () => {
    try {
      const response = await api.get('/vendors/orders')
      if (response.data.success) {
        dispatch(setVendorOrders(response.data.orders))
      }
    } catch (error) {
      console.error('Error fetching vendor orders:', error)
      dispatch(setError('Failed to load orders'))
    }
  }

  const fetchVendorProducts = async (vendorId: string) => {
    try {
      const response = await api.get(`/products?vendor=${vendorId}`);
      if (response.data.success) {
        setVendorProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    }
  };

  const updateVendorProfile = async (updatedData: any) => {
    try {
      dispatch(setLoading(true))
      const response = await api.put('/vendors/profile', updatedData)
      if (response.data.success) {
        dispatch(setVendorProfile(response.data.profile))
      }
    } catch (error) {
      console.error('Error updating vendor profile:', error)
      dispatch(setError('Failed to update profile'))
      // Just update local state for demo
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    // Fetch vendor data on component mount
    if (user?.role === 'vendor') {
      fetchVendorProfile()
      fetchVendorStats()
      fetchVendorOrders()
    }
  }, [user])

  useEffect(() => {
    if (profile && profile._id) {
      fetchVendorProducts(profile._id);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && profileData) {
      // Create copies to avoid changing original objects for comparison
      const initialProfileState = JSON.parse(JSON.stringify(profile));
      const currentFormState = JSON.parse(JSON.stringify(profileData));

      // Normalize undefined/null to empty strings for fair comparison
      const normalize = (obj: any) => {
        for (const key in obj) {
          if (obj[key] === null || obj[key] === undefined) {
            obj[key] = "";
          } else if (typeof obj[key] === 'object') {
            normalize(obj[key]);
          }
        }
        return obj;
      };

      const hasChanges = JSON.stringify(normalize(initialProfileState)) !== JSON.stringify(normalize(currentFormState));
      setIsDirty(hasChanges);
    }
  }, [profile, profileData]);

  const handleTabChange = (tabId: string) => {
    if (isDirty) {
      setNextTab(tabId);
      setModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleSaveChanges = async () => {
    await updateVendorProfile(profileData);
    setIsDirty(false);
    if (nextTab) {
      setActiveTab(nextTab);
      setNextTab('');
    }
  };

  const handleDiscardChanges = () => {
    setProfileData(profile as Store); // Correctly cast to Store
    setIsDirty(false);
    setModalOpen(false);
    if (nextTab) {
      setActiveTab(nextTab);
      setNextTab('');
    }
  };

  const handleAddProduct = () => {
    setAddProductModalOpen(true);
  };
  const handleProductSubmit = async (formData: any) => {
    try {
      const response = await api.post('/products', formData);
      if (response.data.success) {
        showSuccessNotification('Product created successfully!');
        setAddProductModalOpen(false);
        // Optional: refetch products or add to state
      } else {
        showErrorNotification(response.data.message || 'Failed to create product.');
      }
    } catch (error) {
      console.error('Create product error:', error);
      showErrorNotification('An error occurred while creating the product.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'products', label: 'Products', icon: ShoppingBagIcon },
    { id: 'orders', label: 'Orders', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
    { id: 'profile', label: 'Store Profile', icon: BuildingStorefrontIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'shipped': return 'info'
      case 'pending': return 'warning'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircleIcon
      case 'shipped': return ArrowTrendingUpIcon
      case 'pending': return ClockIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  const handleProfileUpdate = async () => {
    await updateVendorProfile(profileData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    setProfileData((prev: Store | null) => {
      if (!prev) return null;
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      let temp = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = temp[keys[i]] || {};
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Add image preview and upload handlers
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUploading((prev) => ({ ...prev, [name]: true }));

      // Instant preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileData((prev: any) => ({ ...prev, [name]: ev.target?.result as string }));
      };
      reader.readAsDataURL(files[0]);

      try {
        const authResponse = await fetch('/api/upload/imagekit-auth', {
          method: 'POST',
        });

        if (!authResponse.ok) {
          throw new Error(`Auth request failed with status: ${authResponse.status}`);
        }

        const authParams = await authResponse.json();

        const imagekit = new ImageKit({
          publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
          urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
        });

        imagekit.upload(
          {
            file: files[0],
            fileName: files[0].name,
            tags: [name],
            ...authParams, // Pass token, expire, and signature directly
          },
          (err: any, result: any) => {
            setUploading((prev) => ({ ...prev, [name]: false }));
            if (err) {
              console.error('ImageKit upload error after auth:', err);
              showErrorNotification('Image upload failed.');
            } else if (result) {
              setProfileData((prev: any) => ({ ...prev, [name]: result.url }));
              showSuccessNotification('Image uploaded!');
            }
          }
        );
      } catch (error) {
        console.error("Critical error during image upload process:", error);
        setUploading((prev) => ({ ...prev, [name]: false }));
        showErrorNotification('Upload failed. Check console for details.');
      }
    }
  };

  // Use (profile as Store) for all type assertions where needed
  const currentProfile = profile as unknown as Store
  const currentStats = stats
  const currentOrders = orders

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Container>
        <div className="py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={currentProfile?.logo || ''}
                    alt={currentProfile?.storeName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {currentProfile?.verification?.status === 'approved' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentProfile?.storeName}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                    {(currentProfile as Store)?.verification?.status ? (currentProfile as Store)?.verification?.status === 'approved' ? 'Verified Vendor' : (currentProfile as Store)?.verification?.status.charAt(0).toUpperCase() + (currentProfile as Store)?.verification?.status.slice(1) : 'N/A'}
                    • Member since {currentProfile?.createdAt ? new Date(currentProfile.createdAt).getFullYear() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {currentProfile?._id && (
                  <Link to={`/vendor/store/${currentProfile._id}`}>
                <Button variant="outline" size="sm">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Store
                </Button>
                  </Link>
                )}

                <Button size="sm" onClick={handleAddProduct}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ${currentStats?.totalRevenue?.toLocaleString() || '0.00'}
                            </p>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <div className="flex items-center mt-2">
                              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">+12.5%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </Card.Content>
                    </Card>

                    <Card>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {currentStats?.totalOrders?.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <div className="flex items-center mt-2">
                              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">+8.2%</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </Card.Content>
                    </Card>

                    <Card>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {currentStats?.totalProducts || '0'}
                            </p>
                            <p className="text-sm text-gray-600">Active Products</p>
                            <div className="flex items-center mt-2">
                              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">+3 this month</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <PhotoIcon className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                      </Card.Content>
                    </Card>

                    <Card>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ${currentProfile?.financials?.balance?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-600">Available Balance</p>
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-gray-600">Next payout: Jul 25</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <BanknotesIcon className="w-6 h-6 text-amber-600" />
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>

                  {/* Recent Orders & Top Products */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <Card>
                      <Card.Header>
                        <div className="flex items-center justify-between">
                          <Card.Title>Recent Orders</Card.Title>
                          <Link to="/vendor/orders">
                            <Button variant="outline" size="sm">View All</Button>
                          </Link>
                        </div>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-4">
                          {currentOrders?.slice(0, 3).map((order) => {
                            const StatusIcon = getStatusIcon(order.status)
                            return (
                              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={order.avatar}
                                    alt={order.customer}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">{order.customer}</p>
                                    <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">${order.total}</p>
                                  <Badge color={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </Card.Content>
                    </Card>

                    {/* Top Products */}
                    <Card>
                      <Card.Header>
                        <Card.Title>Top Performing Products</Card.Title>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-4">
                          {currentStats?.topProducts?.map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                  <span className="font-bold text-amber-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{product.title}</p>
                                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${product.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <ProductManagementTab products={vendorProducts} onAddProduct={handleAddProduct} />
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                    <div className="flex space-x-3">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                        <option>All Orders</option>
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </div>
                  </div>

                  <Card>
                    <Card.Content>
                      <div className="space-y-4">
                        {currentOrders?.map((order) => {
                          const StatusIcon = getStatusIcon(order.status)
                          return (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={order.avatar}
                                    alt={order.customer}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <div>
                                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                                    <p className="text-gray-600">{order.customer}</p>
                                    <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">${order.total}</p>
                                  <Badge color={getStatusColor(order.status) as any}>
                                    {order.status}
                                  </Badge>
                                  <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
                  
                  <Card>
                    <Card.Content>
                      <div className="text-center py-12">
                        <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Store Profile</h2>
                    {isDirty && (
                    <Button
                        variant="primary"
                        onClick={handleSaveChanges}
                        disabled={uploading.logo || uploading.banner}
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                        {uploading.logo || uploading.banner ? 'Uploading...' : 'Save Changes'}
                    </Button>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <Card.Header>
                          <Card.Title>Basic Information</Card.Title>
                        </Card.Header>
                        <Card.Content>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Name
                              </label>
                                <Input
                                  name="storeName"
                                value={profileData?.storeName || ''}
                                  onChange={handleInputChange}
                                />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <div className="flex items-center">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <p className="text-gray-900">{profileData?.contact?.email || ''}</p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                              </label>
                                <Input
                                name="contact.phone"
                                value={profileData?.contact?.phone || ''}
                                  onChange={handleInputChange}
                                />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  name="contact.website"
                                  value={profileData?.contact?.website || ''}
                                  onChange={handleInputChange}
                                  className="flex-grow"
                                  placeholder="https://yourstore.com"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm" // Changed from "icon"
                                  className="p-2" // Add padding to make it square
                                  onClick={() => {
                                    const url = profileData?.contact?.website;
                                    if (url) {
                                      let fullUrl = url;
                                      if (!/^https?:\/\//i.test(fullUrl)) {
                                        fullUrl = 'https://' + fullUrl;
                                      }
                                      window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                  disabled={!profileData?.contact?.website}
                                >
                                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                </Button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                              </label>
                                <Input
                                name="business.address.city"
                                value={profileData?.business?.address?.city || ''}
                                  onChange={handleInputChange}
                                />
                            </div>
                          </div>
                        </Card.Content>
                      </Card>

                      <Card>
                        <Card.Header>
                          <Card.Title>Store Description</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <textarea
                              name="storeDescription"
                            value={profileData?.storeDescription || ''}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </Card.Content>
                      </Card>
                      <Card>
                        <Card.Header>
                          <Card.Title>Logo & Banner</Card.Title>
                        </Card.Header>
                        <Card.Content>
                          <div className="relative w-full mb-6 flex flex-col items-center">
                            <StoreBanner src={profileData?.banner} height="h-32 md:h-48 w-full" />
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
                              <StoreLogo src={profileData?.logo} />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="flex flex-col items-center">
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Store Logo</label>
                              <div className="flex items-center gap-2 justify-center">
                                <input
                                  type="file"
                                  name="logo"
                                  accept="image/*"
                                  id="logo-upload"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 bg-amber-100 text-amber-700 rounded-lg shadow hover:bg-amber-200 focus:outline-none"
                                  onClick={() => document.getElementById('logo-upload')?.click()}
                                  disabled={uploading.logo}
                                >
                                  {uploading.logo ? (
                                    <svg className="animate-spin h-5 w-5 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <CameraIcon className="w-5 h-5 mr-2" />
                                  )}
                                  Upload Logo
                                </button>
                                {profileData?.logo && (
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-2 bg-red-100 text-red-600 rounded-lg shadow hover:bg-red-200 focus:outline-none"
                                    onClick={() => setProfileData((prev: any) => ({ ...prev, logo: '' }))}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                    <span className="sr-only">Remove Logo</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Store Banner</label>
                              <div className="flex items-center gap-2 justify-center">
                                <input
                                  type="file"
                                  name="banner"
                                  accept="image/*"
                                  id="banner-upload"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 bg-amber-100 text-amber-700 rounded-lg shadow hover:bg-amber-200 focus:outline-none"
                                  onClick={() => document.getElementById('banner-upload')?.click()}
                                  disabled={uploading.banner}
                                >
                                  {uploading.banner ? (
                                    <svg className="animate-spin h-5 w-5 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <CameraIcon className="w-5 h-5 mr-2" />
                                  )}
                                  Upload Banner
                                </button>
                                {profileData?.banner && (
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-2 bg-red-100 text-red-600 rounded-lg shadow hover:bg-red-200 focus:outline-none"
                                    onClick={() => setProfileData((prev: any) => ({ ...prev, banner: '' }))}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                    <span className="sr-only">Remove Banner</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <Card>
                        <Card.Header>
                          <Card.Title>Store Statistics</Card.Title>
                        </Card.Header>
                        <Card.Content>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Verification Status</span>
                              <Badge color={(currentProfile as Store)?.verification?.status === 'approved' ? 'success' : (currentProfile as Store)?.verification?.status === 'pending' ? 'warning' : (currentProfile as Store)?.verification?.status === 'rejected' ? 'error' : 'default'}>
                                {(currentProfile as Store)?.verification?.status === 'approved' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                {(currentProfile as Store)?.verification?.status === 'pending' && <Clock className="w-4 h-4 inline mr-1" />}
                                {(currentProfile as Store)?.verification?.status === 'rejected' && <XCircle className="w-4 h-4 inline mr-1" />}
                                {['approved', 'pending', 'rejected'].indexOf((currentProfile as Store)?.verification?.status) === -1 && <Shield className="w-4 h-4 inline mr-1" />}
                                {(currentProfile as Store)?.verification?.status ? (currentProfile as Store)?.verification?.status === 'approved' ? 'Verified Vendor' : (currentProfile as Store)?.verification?.status.charAt(0).toUpperCase() + (currentProfile as Store)?.verification?.status.slice(1) : 'N/A'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Commission Rate</span>
                              <span className="font-semibold">{currentProfile?.financials?.commissionRate !== undefined ? (currentProfile.financials.commissionRate * 100) : 0}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Member Since</span>
                              <span className="font-semibold">{currentProfile?.createdAt ? new Date(currentProfile.createdAt).getFullYear() : 'N/A'}</span>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>

                      <Card>
                        <Card.Header>
                          <Card.Title>Quick Actions</Card.Title>
                        </Card.Header>
                        <Card.Content>
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                              <PhotoIcon className="w-5 h-5 mr-2" />
                              Upload Store Banner
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <DocumentTextIcon className="w-5 h-5 mr-2" />
                              Update Policies
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                              Contact Support
                            </Button>
                          </div>
                        </Card.Content>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                      <Card.Header>
                        <Card.Title>Account Information</Card.Title>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Display Name
                            </label>
                            <Input value={user?.name || ''} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <Input value={user?.email || ''} disabled />
                          </div>
                          <Button>Update Account</Button>
                        </div>
                      </Card.Content>
                    </Card>

                    <Card>
                      <Card.Header>
                        <Card.Title>Notification Preferences</Card.Title>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Order Notifications</p>
                              <p className="text-sm text-gray-600">Get notified about new orders</p>
                            </div>
                            <button className="bg-amber-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                              <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Marketing Emails</p>
                              <p className="text-sm text-gray-600">Receive promotional emails</p>
                            </div>
                            <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                              <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>

                  <Card>
                    <Card.Header>
                      <Card.Title>Danger Zone</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Deactivate Store</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Temporarily disable your store. You can reactivate it anytime.
                          </p>
                          <Button variant="destructive">Deactivate Store</Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
      {isDirty && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-100 text-amber-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span>You have unsaved changes.</span>
          <Button size="sm" onClick={handleSaveChanges} disabled={uploading.logo || uploading.banner}>
            {uploading.logo || uploading.banner ? 'Uploading...' : 'Save Changes'}
          </Button>
    </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Unsaved Changes"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDiscardChanges}>Discard</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        }
      >
        <p>You have unsaved changes. Would you like to save them before proceeding?</p>
      </Modal>
      <Modal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        title="Add New Product"
        size="3xl" // Widen the modal for the form
      >
        <ProductForm
          onSubmit={handleProductSubmit}
          onCancel={() => setAddProductModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default VendorDashboard;
