import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowUpIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../store/store'
import { Container, Card, Button, Badge, Input, Modal } from '../../components/ui'
import { setVendorProfile, setVendorStats, setVendorOrders, setLoading, setError } from '../../store/slices/vendorSlice'
import api from '../../utils/api'
import { Store } from '../../types/stores';
import { CheckCircle, Clock, XCircle, Shield } from 'lucide-react';
import StoreLogo from '../../components/ui/StoreLogo';
import StoreBanner from '../../components/ui/StoreBanner';
import ImageKit from "imagekit-javascript";
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import ProductForm from '../../components/forms/ProductForm';
import DashboardNavigation from '../../components/layout/DashboardNavigation';
import ProductManagementTab from './tabs/ProductManagementTab';
import VendorBankDashboard from './VendorBankDashboard';

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
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [vendorBalance, setVendorBalance] = useState<any>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [productsPage, setProductsPage] = useState(1);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPagination, setProductsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [deliveryProofModal, setDeliveryProofModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    orderNumber: string | null;
  }>({
    isOpen: false,
    orderId: null,
    orderNumber: null
  });
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
    title: string;
  }>({
    isOpen: false,
    imageUrl: null,
    title: ''
  });
  const [deliveryProofForm, setDeliveryProofForm] = useState({
    image: null as File | null,
    deliveryNotes: '',
    deliveryLocation: ''
  });
  const [uploadingProof, setUploadingProof] = useState(false);

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

  const fetchVendorOrders = async (page = 1) => {
    try {
      setOrdersLoading(true);
      const response = await api.get(`/vendors/orders?page=${page}&limit=10`)
      if (response.data.success) {
        dispatch(setVendorOrders(response.data.orders))
        setOrdersPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching vendor orders:', error)
      dispatch(setError('Failed to load orders'))
    } finally {
      setOrdersLoading(false);
    }
  }

  const fetchVendorBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await api.get('/vendor-balance/balance');
      if (response.data.success) {
        setVendorBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching vendor balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchVendorOrdersWithFilter = async (status: string, page = 1) => {
    try {
      setOrdersLoading(true);
      const response = await api.get(`/vendors/orders?status=${status}&page=${page}&limit=10`)
      if (response.data.success) {
        dispatch(setVendorOrders(response.data.orders))
        setOrdersPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching vendor orders:', error)
      dispatch(setError('Failed to load orders'))
    } finally {
      setOrdersLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      if (response.data.success) {
        showSuccessNotification('Order status updated successfully')
        fetchVendorOrders() // Refresh orders
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      showErrorNotification(error.response?.data?.message || 'Failed to update order status')
    }
  }

  const addTrackingInfo = async (orderId: string, trackingNumber: string, trackingUrl: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/tracking`, { 
        trackingNumber, 
        trackingUrl 
      })
      if (response.data.success) {
        showSuccessNotification('Tracking information added successfully')
        fetchVendorOrders() // Refresh orders
      }
    } catch (error: any) {
      console.error('Error adding tracking info:', error)
      showErrorNotification(error.response?.data?.message || 'Failed to add tracking information')
    }
  }

  const uploadDeliveryProof = async (orderId: string, formData: any) => {
    try {
      setUploadingProof(true);
      
      // First upload image to ImageKit
      const authResponse = await fetch('/api/upload/imagekit-auth', {
        method: 'POST',
      });

      if (!authResponse.ok) {
        throw new Error('Failed to get upload authentication');
      }

      const authParams = await authResponse.json();

      // Upload image using ImageKit
      const imagekit = (await import('imagekit-javascript')).default;
      const ikInstance = new imagekit({
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
        urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
      });

      return new Promise((resolve, reject) => {
        ikInstance.upload(
          {
            file: formData.image,
            fileName: `delivery-proof-${orderId}-${Date.now()}.jpg`,
            tags: ['delivery-proof', orderId],
            ...authParams,
          },
          async (err: any, result: any) => {
            if (err) {
              reject(err);
              return;
            }

            try {
              // Submit delivery proof to backend
              const response = await api.post(`/vendors/orders/${orderId}/delivery-proof`, {
                imageUrl: result.url,
                imageId: result.fileId,
                deliveryNotes: formData.deliveryNotes,
                deliveryLocation: {
                  address: formData.deliveryLocation
                },
                metadata: {
                  fileSize: result.size,
                  mimeType: result.fileType,
                  dimensions: {
                    width: result.width,
                    height: result.height
                  }
                }
              });

              if (response.data.success) {
                showSuccessNotification('Arrival proof uploaded successfully! Order moved to processing.');
                fetchVendorOrders(); // Refresh orders
                setDeliveryProofModal({ isOpen: false, orderId: null, orderNumber: null });
                setDeliveryProofForm({ image: null, deliveryNotes: '', deliveryLocation: '' });
                resolve(response.data);
              } else {
                showErrorNotification(response.data.message || 'Failed to upload arrival proof');
                reject(new Error(response.data.message));
              }
            } catch (error: any) {
              console.error('Upload arrival proof error:', error);
              showErrorNotification(error.response?.data?.message || 'An error occurred while uploading arrival proof');
              reject(error);
            } finally {
              setUploadingProof(false);
            }
          }
        );
      });
    } catch (error) {
      setUploadingProof(false);
      throw error;
    }
  };

  const handleDeliveryProofSubmit = async () => {
    if (!deliveryProofModal.orderId || !deliveryProofForm.image) {
      showErrorNotification('Please select an image for arrival proof');
      return;
    }

    try {
      await uploadDeliveryProof(deliveryProofModal.orderId, deliveryProofForm);
    } catch (error) {
      console.error('Arrival proof submission error:', error);
    }
  };

  const fetchVendorProducts = async (vendorId: string, page = 1) => {
    try {
      setProductsLoading(true);
      const response = await api.get(`/products?vendor=${vendorId}&page=${page}&limit=12`);
      if (response.data.success) {
        setVendorProducts(response.data.products);
        setProductsPagination(response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductPageChange = (page: number) => {
    if (profile?._id) {
      setProductsPage(page);
      fetchVendorProducts(profile._id, page);
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
      fetchVendorBalance()
    }
  }, [user])

  useEffect(() => {
    if (profile && profile._id && user?.role === 'vendor') {
      // 1. Fetch the initial product list
      fetchVendorProducts(profile._id, 1);

      // 2. Set up real-time updates with error handling
      let socket: any = null;
      
      try {
        socket = io('http://localhost:5000', {
          transports: ['websocket', 'polling'],
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          forceNew: true
        });

        socket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocketConnected(true);
          socket.emit('join-vendor-room', profile._id);
        });

        socket.on('connect_error', (error: any) => {
          console.error('Socket connection error:', error);
          setSocketConnected(false);
        });

        socket.on('error', (error: any) => {
          console.error('Socket error:', error);
          setSocketConnected(false);
        });

        socket.on('products-updated', (updatedProducts: any) => {
          setVendorProducts(updatedProducts);
        });

        return () => {
          if (socket) {
            socket.disconnect();
          }
        };
      } catch (error) {
        console.error('Error setting up socket connection:', error);
      }
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
        // Refetch products
        if (profile?._id) {
          fetchVendorProducts(profile._id, 1);
        }
      } else {
        showErrorNotification(response.data.message || 'Failed to create product.');
      }
    } catch (error) {
      console.error('Create product error:', error);
      showErrorNotification('An error occurred while creating the product.');
    }
  };

  const handleUpdateProduct = async (id: string, data: any) => {
    try {
      // Transform categories to match the server's format if they haven't been transformed yet
      const formattedData = {
        ...data,
        categories: Array.isArray(data.categories) 
          ? data.categories.map((c: string) => c.toLowerCase().replace(/\s+/g, '-'))
          : data.categories
      };

      const response = await api.put(`/products/${id}`, formattedData);
      if (response.data.success) {
        showSuccessNotification('Product updated successfully!');
        // Refetch products
        if (profile?._id) {
          fetchVendorProducts(profile._id, 1);
        }
      } else {
        showErrorNotification(response.data.message || 'Failed to update product.');
      }
    } catch (error: any) {
      console.error('Update product error:', error);
      showErrorNotification(error.response?.data?.message || 'An error occurred while updating the product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        showSuccessNotification('Product deleted successfully!');
        // Refetch products
        if (profile?._id) {
          fetchVendorProducts(profile._id, 1);
        }
      } else {
        showErrorNotification(response.data.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      showErrorNotification('An error occurred while deleting the product.');
    }
  };

  const handleToggleProductStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await api.patch(`/products/${id}/status`, { status: newStatus });
      if (response.data.success) {
        showSuccessNotification(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        // Refetch products
        if (profile?._id) {
          fetchVendorProducts(profile._id, 1);
        }
      } else {
        showErrorNotification(response.data.message || `Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} product.`);
      }
    } catch (error: any) {
      console.error('Toggle product status error:', error);
      showErrorNotification(error.response?.data?.message || 'An error occurred while updating product status.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'products', label: 'Products', icon: ShoppingBagIcon },
    { id: 'orders', label: 'Orders', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
    { id: 'bank', label: 'Bank & Payouts', icon: BanknotesIcon },
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-20 md:pb-0">
      <DashboardNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="transition-all duration-300 ml-0 md:ml-70 pt-16 pb-20">
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
                              ${stats?.totalRevenue?.toFixed(2) || '0.00'}
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
                              {stats?.totalOrders || '0'}
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
                              {stats?.activeProducts || '0'}
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
                              ${vendorBalance?.availableBalance?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-600">Available Balance</p>
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-gray-600">
                                Pending: ${vendorBalance?.pendingBalance?.toFixed(2) || '0.00'}
                              </span>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveTab('orders')}
                          >
                            View All
                          </Button>
                        </div>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-4">
                          {ordersLoading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mb-3"></div>
                              <p className="text-sm text-gray-600">Loading recent orders...</p>
                            </div>
                          ) : currentOrders && currentOrders.length > 0 ? currentOrders.slice(0, 3).map((order, index) => {
                            const StatusIcon = getStatusIcon(order.status)
                            return (
                              <div key={order._id || order.id || `order-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={order.avatar}
                                    alt={typeof order.customer === 'object' 
                                      ? (order.customer?.name || order.customer?.email || 'Customer')
                                      : order.customer || 'Customer'
                                    }
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {typeof order.customer === 'object' 
                                        ? (order.customer?.name || order.customer?.email || 'Customer')
                                        : order.customer || 'Customer'
                                      }
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.items?.map((item: any, index: number) => (
                                        <span key={index}>
                                          {item.product?.title || 'Unknown Product'} (x{item.quantity || 1})
                                          {index < order.items.length - 1 ? ', ' : ''}
                                        </span>
                                      )) || 'No items'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                                  <Badge color={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            )
                          }) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No recent orders</p>
                            </div>
                          )}
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
                          {loading ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                            </div>
                          ) : currentStats?.topProducts && currentStats.topProducts.length > 0 ? currentStats.topProducts.map((product, index) => (
                            <div key={product.id || `product-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                          )) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No products yet</p>
                            </div>
                          )}
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <ProductManagementTab 
                  products={vendorProducts} 
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  loading={productsLoading}
                  pagination={productsPagination}
                  onPageChange={handleProductPageChange}
                />
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                    <div className="flex space-x-3">
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => {
                          const status = e.target.value;
                          if (status === 'all') {
                            fetchVendorOrders(1);
                          } else {
                            fetchVendorOrdersWithFilter(status, 1);
                          }
                        }}
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <Card>
                    <Card.Content>
                      <div className="space-y-4">
                        {ordersLoading ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading orders...</p>
                          </div>
                        ) : currentOrders && Array.isArray(currentOrders) && currentOrders.length > 0 ? (
                          currentOrders.map((order, index) => {
                            const StatusIcon = getStatusIcon(order.status)
                            return (
                              <div key={order._id || `order-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                      <UserIcon className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                      <p className="text-gray-600">
                                        {typeof order.customer === 'object' 
                                          ? (order.customer?.name || order.customer?.email || 'Customer')
                                          : order.customer || 'Customer'
                                        }
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {order.items?.map((item: any, index: number) => (
                                          <span key={index}>
                                            {item.product?.title || 'Unknown Product'} (x{item.quantity || 1})
                                            {index < order.items.length - 1 ? ', ' : ''}
                                          </span>
                                        )) || 'No items'}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                                    <Badge variant={getStatusColor(order.status) as any}>
                                      {order.status}
                                    </Badge>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {order.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0)} item{order.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                
                                                                 {/* Order Details */}
                                 <div className="mt-4 pt-4 border-t border-gray-100">
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                     <div>
                                       <p className="font-medium text-gray-700">Shipping Address</p>
                                       <p className="text-gray-600">
                                         {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                       </p>
                                       <p className="text-gray-600">{order.shippingAddress?.address}</p>
                                       <p className="text-gray-600">
                                         {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                                       </p>
                                     </div>
                                     <div>
                                       <p className="font-medium text-gray-700">Payment Status</p>
                                       <p className={`${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                         {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                       </p>
                                     </div>
                                     <div>
                                       <p className="font-medium text-gray-700">Order Summary</p>
                                       <p className="text-gray-600">Subtotal: ${order.subtotal?.toFixed(2)}</p>
                                       <p className="text-gray-600">Shipping: ${order.shippingCost?.toFixed(2)}</p>
                                       <p className="text-gray-600">Tax: ${order.tax?.toFixed(2)}</p>
                                     </div>
                                   </div>
                                   
                                   {/* Order Actions */}
                                   <div className="mt-4 pt-4 border-t border-gray-100">
                                     <div className="flex flex-wrap gap-2">
                                       {/* Escrow Status */}
                                       <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-md">
                                         <span className="text-sm font-medium text-blue-700">
                                           Escrow: {order.escrowStatus || 'held'}
                                         </span>
                                         {order.escrowStatus === 'held' && (
                                           <span className="text-xs text-blue-600">
                                             ${order.escrowAmount?.toFixed(2) || order.total?.toFixed(2)} held
                                           </span>
                                         )}
                                       </div>

                                       {/* Status Display (Read-only for vendors) */}
                                       <div className="px-3 py-1 bg-gray-50 rounded-md">
                                         <span className="text-sm text-gray-600">
                                           Status: <span className="font-medium">{order.status}</span>
                                         </span>
                                       </div>
                                       
                                       {/* Tracking Info */}
                                       {order.status === 'shipped' && !order.deliveryProof && (
                                         <Button 
                                           size="sm" 
                                           variant="outline"
                                           onClick={() => {
                                             const trackingNumber = prompt('Enter tracking number:')
                                             if (trackingNumber && trackingNumber.trim()) {
                                               const trackingUrl = prompt('Enter tracking URL (optional):')
                                               addTrackingInfo(order._id, trackingNumber.trim(), trackingUrl?.trim() || '')
                                             } else if (trackingNumber !== null) {
                                               showErrorNotification('Tracking number is required')
                                             }
                                           }}
                                         >
                                           <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                                           Add Tracking
                                         </Button>
                                       )}

                                       {/* Delivery Proof Upload - Only for pending orders */}
                                       {order.status === 'pending' && !order.deliveryProof && (
                                         <Button 
                                           size="sm" 
                                           variant="primary"
                                           onClick={() => setDeliveryProofModal({
                                             isOpen: true,
                                             orderId: order._id,
                                             orderNumber: order.orderNumber
                                           })}
                                         >
                                           <CameraIcon className="w-4 h-4 mr-1" />
                                           Upload Proof of Order HandOff
                                         </Button>
                                       )}

                                       {/* Show if proof was uploaded and allow re-upload within 15 minutes */}
                                       {order.deliveryProof && (
                                         <div className="w-full">
                                           <div className="flex items-center gap-2 mb-2">
                                             <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md flex-1">
                                               <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                               <div className="flex-1">
                                                 <span className="text-sm font-medium text-green-800 block">
                                                   Arrival Proof Uploaded
                                                 </span>
                                                 <span className="text-xs text-green-600">
                                                   {new Date(order.deliveryProof?.createdAt || order.deliveryProof?.uploadedAt || order.updatedAt).toLocaleString()}
                                                 </span>
                                               </div>
                                             </div>
                                           </div>
                                           
                                           <div className="flex flex-wrap gap-2">
                                             {/* Re-upload button - only available within 15 minutes */}
                                             {(() => {
                                               // Use createdAt as fallback since uploadedAt might not be available
                                               const uploadTime = new Date(order.deliveryProof?.createdAt || order.deliveryProof?.uploadedAt || order.updatedAt).getTime();
                                               const now = new Date().getTime();
                                               const timeDiffMinutes = (now - uploadTime) / (1000 * 60);
                                               const canReupload = timeDiffMinutes < 15;
                                               
                                               console.log('Upload time:', new Date(uploadTime), 'Now:', new Date(now), 'Diff minutes:', timeDiffMinutes, 'Can reupload:', canReupload);
                                               
                                               return canReupload ? (
                                                 <Button 
                                                   size="sm" 
                                                   variant="outline"
                                                   onClick={() => setDeliveryProofModal({
                                                     isOpen: true,
                                                     orderId: order._id,
                                                     orderNumber: order.orderNumber
                                                   })}
                                                   className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                                 >
                                                   <CameraIcon className="w-4 h-4 mr-1" />
                                                   Re-upload ({Math.ceil(15 - timeDiffMinutes)}m left)
                                                 </Button>
                                               ) : (
                                                 <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
                                                   Re-upload disabled (15 min window expired)
                                                 </div>
                                               );
                                             })()}
                                             
                                             {/* View proof button */}
                                             <Button 
                                               size="sm" 
                                               variant="outline"
                                               onClick={() => {
                                                 if (order.deliveryProof?.imageUrl) {
                                                   setImageModal({
                                                     isOpen: true,
                                                     imageUrl: order.deliveryProof.imageUrl,
                                                     title: `Delivery Proof - Order #${order.orderNumber}`
                                                   });
                                                 }
                                               }}
                                               className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                             >
                                               <EyeIcon className="w-4 h-4 mr-1" />
                                               View Proof
                                             </Button>
                                           </div>
                                           
                                           {/* Information note */}
                                           <div className="mt-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                                             <strong>Note:</strong> Re-uploading is only allowed within 15 minutes of the original upload.
                                           </div>
                                         </div>
                                       )}

                                       {/* Admin Note */}
                                       <div className="w-full mt-2 px-3 py-2 bg-amber-50 rounded-md">
                                         <p className="text-xs text-amber-700">
                                           <strong>Note:</strong> Upload arrival proof when items reach the processing center. 
                                           The proof will be recorded for order tracking and review.
                                         </p>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                            <p className="text-gray-600">Orders from your products will appear here.</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Pagination Controls */}
                      {ordersPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-700">
                            <span>
                              Showing page {ordersPagination.currentPage} of {ordersPagination.totalPages} 
                              ({ordersPagination.totalOrders} total orders)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchVendorOrders(ordersPagination.currentPage - 1)}
                              disabled={!ordersPagination.hasPrevPage || ordersLoading}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchVendorOrders(ordersPagination.currentPage + 1)}
                              disabled={!ordersPagination.hasNextPage || ordersLoading}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
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

              {/* Bank & Payouts Tab */}
              {activeTab === 'bank' && (
                <VendorBankDashboard />
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
                                Store Slogan
                              </label>
                                <Input
                                  name="slogan"
                                value={profileData?.slogan || ''}
                                  onChange={handleInputChange}
                                  placeholder="A catchy tagline for your store"
                                  maxLength={200}
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
      </div>
    
      {isDirty && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-100 text-amber-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span>You have unsaved changes.</span>
          <Button size="sm" onClick={handleSaveChanges} disabled={uploading.logo || uploading.banner}>
            {uploading.logo || uploading.banner ? 'Uploading...' : 'Save Changes'}
          </Button>
        </div>
      )}

      {/* Image Modal for viewing delivery proof */}
      <Modal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ isOpen: false, imageUrl: null, title: '' })}
        title={imageModal.title}
        size="3xl"
      >
        <div className="flex justify-center">
          <img
            src={imageModal.imageUrl || ''}
            alt="Delivery proof"
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      </Modal>

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

      {/* Delivery Proof Upload Modal */}
      <Modal
        isOpen={deliveryProofModal.isOpen}
        onClose={() => {
          setDeliveryProofModal({ isOpen: false, orderId: null, orderNumber: null });
          setDeliveryProofForm({ image: null, deliveryNotes: '', deliveryLocation: '' });
        }}
        title={`Upload Arrival Proof - Order #${deliveryProofModal.orderNumber}`}
        size="2xl"
        footer={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setDeliveryProofModal({ isOpen: false, orderId: null, orderNumber: null });
                setDeliveryProofForm({ image: null, deliveryNotes: '', deliveryLocation: '' });
              }}
              disabled={uploadingProof}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeliveryProofSubmit}
              disabled={uploadingProof || !deliveryProofForm.image}
            >
              {uploadingProof ? 'Uploading...' : 'Upload Arrival Proof'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-sm text-amber-700">
                  Upload a clear photo showing the items have arrived at the processing center/warehouse. 
                  This will record the arrival proof for order tracking and review.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Photo *
            </label>
            <div 
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-amber-400 transition-colors"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-amber-400', 'bg-amber-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-amber-400', 'bg-amber-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-amber-400', 'bg-amber-50');
                const files = Array.from(e.dataTransfer.files);
                const imageFile = files.find(file => file.type.startsWith('image/'));
                if (imageFile) {
                  setDeliveryProofForm(prev => ({ ...prev, image: imageFile }));
                }
              }}
            >
              <div className="space-y-1 text-center">
                {deliveryProofForm.image ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(deliveryProofForm.image)} 
                        alt="Arrival proof preview" 
                        className="mx-auto h-40 w-auto rounded-lg border-2 border-green-200 shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Image Selected Successfully</span>
                      </div>
                      <p className="text-sm text-green-700 mb-1">{deliveryProofForm.image.name}</p>
                      <p className="text-xs text-green-600">
                        Size: {(deliveryProofForm.image.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="arrival-photo-replace"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDeliveryProofForm(prev => ({ ...prev, image: file }));
                          }
                          // Reset the input value so the same file can be selected again
                          e.target.value = '';
                        }}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => document.getElementById('arrival-photo-replace')?.click()}
                        className="flex items-center gap-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <PhotoIcon className="w-4 h-4" />
                        Replace Image
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setDeliveryProofForm(prev => ({ ...prev, image: null }))}
                        className="flex items-center gap-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <p className="mb-3">Drop an image here, or choose an option below</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          id="arrival-photo-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDeliveryProofForm(prev => ({ ...prev, image: file }));
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => document.getElementById('arrival-photo-upload')?.click()}
                          className="flex items-center gap-1"
                        >
                          <PhotoIcon className="w-4 h-4" />
                          Upload File
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          id="arrival-photo-camera"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDeliveryProofForm(prev => ({ ...prev, image: file }));
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => document.getElementById('arrival-photo-camera')?.click()}
                          className="flex items-center gap-1"
                        >
                          <CameraIcon className="w-4 h-4" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Any notes about the arrival at processing center..."
              value={deliveryProofForm.deliveryNotes}
              onChange={(e) => setDeliveryProofForm(prev => ({ ...prev, deliveryNotes: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Center Location (Optional)
            </label>
            <Input
              placeholder="e.g., Warehouse A, Section 3, Processing Bay 2"
              value={deliveryProofForm.deliveryLocation}
              onChange={(e) => setDeliveryProofForm(prev => ({ ...prev, deliveryLocation: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorDashboard;
