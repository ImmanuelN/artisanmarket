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
} from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../store/store'
import { Container, Card, Button, Badge, Input } from '../../components/ui'
import { setVendorProfile, setVendorStats, setVendorOrders, setLoading, setError } from '../../store/slices/vendorSlice'
import api from '../../utils/api'

const VendorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, products, stats, orders, loading } = useSelector((state: RootState) => state.vendor)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    storeName: '',
    storeDescription: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    bio: ''
  })

  // API Functions
  const fetchVendorProfile = async () => {
    try {
      dispatch(setLoading(true))
      const response = await api.get('/vendors/profile')
      if (response.data.success) {
        dispatch(setVendorProfile(response.data.profile))
        // Update local state
        const profile = response.data.profile
        setProfileData({
          storeName: profile.storeName || '',
          storeDescription: profile.storeDescription || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          website: profile.website || '',
          location: profile.location || '',
          bio: profile.bio || ''
        })
      }
    } catch (error) {
      console.error('Error fetching vendor profile:', error)
      // Use mock data as fallback
      initializeMockData()
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
      // Use mock stats as fallback
      dispatch(setVendorStats(mockVendorData.stats))
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
      // Use mock orders as fallback
      dispatch(setVendorOrders(mockVendorData.orders))
    }
  }

  const updateVendorProfile = async (updatedData: any) => {
    try {
      dispatch(setLoading(true))
      const response = await api.put('/vendors/profile', updatedData)
      if (response.data.success) {
        dispatch(setVendorProfile(response.data.profile))
        setIsEditingProfile(false)
      }
    } catch (error) {
      console.error('Error updating vendor profile:', error)
      dispatch(setError('Failed to update profile'))
      // Just update local state for demo
      setIsEditingProfile(false)
    } finally {
      dispatch(setLoading(false))
    }
  }

  // Initialize mock data function
  const initializeMockData = () => {
    dispatch(setVendorProfile(mockVendorData.profile))
    setProfileData({
      storeName: mockVendorData.profile.storeName,
      storeDescription: mockVendorData.profile.storeDescription,
      email: mockVendorData.profile.email,
      phone: mockVendorData.profile.phone,
      website: mockVendorData.profile.website,
      location: mockVendorData.profile.location,
      bio: mockVendorData.profile.bio
    })
  }

  // Mock data for demonstration - in real app, this would come from API
  const mockVendorData = {
    profile: {
      id: user?.id || '1',
      storeName: 'Artisan Creations Studio',
      email: user?.email || 'vendor@example.com',
      bio: 'Passionate artisan creating unique handcrafted pieces with over 10 years of experience.',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      approved: true,
      balance: 2450.75,
      commissionRate: 0.15,
      createdAt: '2023-01-15',
      phone: '+1 (555) 123-4567',
      website: 'https://artisancreations.com',
      location: 'Portland, Oregon',
      storeDescription: 'Specializing in handcrafted ceramics, wooden furniture, and unique home decor items made with sustainable materials.'
    },
    stats: {
      totalProducts: 45,
      totalSales: 1234,
      totalRevenue: 18750.50,
      totalOrders: 892,
      monthlyRevenue: [1200, 1800, 2200, 1900, 2400, 2100, 2800, 2600, 3100, 2900, 3400, 3200],
      topProducts: [
        {
          id: '1',
          title: 'Handcrafted Ceramic Vase',
          price: 89.99,
          inventory: 12,
          status: 'active' as const,
          sales: 156,
          revenue: 14038.44,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Wooden Coffee Table',
          price: 299.99,
          inventory: 3,
          status: 'active' as const,
          sales: 34,
          revenue: 10199.66,
          createdAt: '2024-02-10'
        }
      ]
    },
    orders: [
      {
        id: 'ORD-001',
        customer: 'Sarah Johnson',
        items: ['Ceramic Vase', 'Wooden Bowl'],
        total: 145.50,
        status: 'pending',
        date: '2024-07-15',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: 'ORD-002',
        customer: 'Michael Chen',
        items: ['Coffee Table'],
        total: 299.99,
        status: 'shipped',
        date: '2024-07-12',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: 'ORD-003',
        customer: 'Emily Davis',
        items: ['Decorative Bowl', 'Candle Holder'],
        total: 78.50,
        status: 'delivered',
        date: '2024-07-10',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ]
  }

  useEffect(() => {
    // Fetch vendor data on component mount
    if (user?.role === 'vendor') {
      fetchVendorProfile()
      fetchVendorStats()
      fetchVendorOrders()
    } else {
      // Use mock data for demo
      initializeMockData()
      dispatch(setVendorStats(mockVendorData.stats))
      dispatch(setVendorOrders(mockVendorData.orders))
    }
  }, [user])

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
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  // Use either real profile data or mock data
  const currentProfile = profile || mockVendorData.profile
  const currentStats = stats || mockVendorData.stats
  const currentOrders = orders || mockVendorData.orders

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
                    src={currentProfile.avatar}
                    alt={currentProfile.storeName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircleIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentProfile.storeName}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                    Verified Vendor • Member since {new Date(currentProfile.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Store
                </Button>
                <Button variant="outline" size="sm">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button size="sm">
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
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
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
                              ${currentStats.totalRevenue.toLocaleString()}
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
                              {currentStats.totalOrders.toLocaleString()}
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
                              {currentStats.totalProducts}
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
                              ${currentProfile.balance.toFixed(2)}
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
                          {currentOrders.slice(0, 3).map((order) => {
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
                                  <Badge variant={getStatusColor(order.status) as any} size="sm">
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
                          {currentStats.topProducts.map((product, index) => (
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
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
                    <Button>
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add New Product
                    </Button>
                  </div>
                  
                  <Card>
                    <Card.Content>
                      <div className="text-center py-12">
                        <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first product to your store.</p>
                        <Button>
                          <PlusIcon className="w-5 h-5 mr-2" />
                          Add Your First Product
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
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
                        {currentOrders.map((order) => {
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
                                  <Badge variant={getStatusColor(order.status) as any}>
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
                    <Button
                      variant="outline"
                      onClick={() => isEditingProfile ? handleProfileUpdate() : setIsEditingProfile(true)}
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                    </Button>
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
                              {isEditingProfile ? (
                                <Input
                                  name="storeName"
                                  value={profileData.storeName}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <p className="text-gray-900">{profileData.storeName}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <div className="flex items-center">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <p className="text-gray-900">{profileData.email}</p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                              </label>
                              {isEditingProfile ? (
                                <Input
                                  name="phone"
                                  value={profileData.phone}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <div className="flex items-center">
                                  <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                                  <p className="text-gray-900">{profileData.phone}</p>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                              </label>
                              {isEditingProfile ? (
                                <Input
                                  name="website"
                                  value={profileData.website}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <div className="flex items-center">
                                  <GlobeAltIcon className="w-5 h-5 text-gray-400 mr-2" />
                                  <a href={profileData.website} className="text-amber-600 hover:text-amber-700">
                                    {profileData.website}
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                              </label>
                              {isEditingProfile ? (
                                <Input
                                  name="location"
                                  value={profileData.location}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <div className="flex items-center">
                                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
                                  <p className="text-gray-900">{profileData.location}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card.Content>
                      </Card>

                      <Card>
                        <Card.Header>
                          <Card.Title>Store Description</Card.Title>
                        </Card.Header>
                        <Card.Content>
                          {isEditingProfile ? (
                            <textarea
                              name="storeDescription"
                              value={profileData.storeDescription}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900">{profileData.storeDescription}</p>
                          )}
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
                              <Badge variant="success">Verified</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Commission Rate</span>
                              <span className="font-semibold">{(mockVendorData.profile.commissionRate * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Member Since</span>
                              <span className="font-semibold">{new Date(mockVendorData.profile.createdAt).getFullYear()}</span>
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
  )
}

export default VendorDashboard
