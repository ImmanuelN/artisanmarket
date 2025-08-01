import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon,
  CreditCardIcon,
  TruckIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  HeartIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  BanknotesIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Badge } from '../../components/ui';
import { RootState } from '../../store/store';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import api from '../../utils/api';
import CustomerProfileSettings from '../../components/customer/CustomerProfileSettings';
import CustomerBankingInfo from '../../components/customer/CustomerBankingInfo';
import CustomerShippingInfo from '../../components/customer/CustomerShippingInfo';
import CustomerPreferences from '../../components/customer/CustomerPreferences';
import OrderHistory from '../OrderHistory';
import DashboardNavigation from '../../components/layout/DashboardNavigation';

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  reviewsGiven: number;
}

const CustomerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
    { id: 'banking', label: 'Banking Information', icon: CreditCardIcon },
    { id: 'shipping', label: 'Shipping Information', icon: TruckIcon },
    { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon },
    { id: 'orders', label: 'Order History', icon: DocumentTextIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon }
  ];

  useEffect(() => {
    fetchCustomerStats();
  }, []);

  const fetchCustomerStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

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
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back, {user?.name || 'Guest'}! Manage your account and preferences.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="success">
                    {user ? 'Customer' : 'Guest'}
                  </Badge>
                </div>
              </div>
            </div>

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
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <Card.Content className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stats?.totalOrders || 0}
                          </p>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <BanknotesIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${stats?.totalSpent?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <HeartIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stats?.wishlistItems || 0}
                          </p>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <DocumentTextIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Reviews Given</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stats?.reviewsGiven || 0}
                          </p>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <Card.Content className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('orders')}
                        className="h-16 flex flex-col items-center justify-center"
                      >
                        <DocumentTextIcon className="w-6 h-6 mb-2" />
                        View Orders
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('wishlist')}
                        className="h-16 flex flex-col items-center justify-center"
                      >
                        <HeartIcon className="w-6 h-6 mb-2" />
                        My Wishlist
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('shipping')}
                        className="h-16 flex flex-col items-center justify-center"
                      >
                        <TruckIcon className="w-6 h-6 mb-2" />
                        Shipping Info
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <CustomerProfileSettings />
            )}

            {/* Banking Information Tab */}
            {activeTab === 'banking' && (
              <CustomerBankingInfo />
            )}

            {/* Shipping Information Tab */}
            {activeTab === 'shipping' && (
              <CustomerShippingInfo />
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <CustomerPreferences />
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <OrderHistory />
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                  <Button variant="outline" onClick={() => window.location.href = '/wishlist'}>
                    View All Items
                  </Button>
                </div>
                <Card>
                  <Card.Content className="p-6">
                    <div className="text-center py-12">
                      <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist</h3>
                      <p className="text-gray-600 mb-4">
                        Save your favorite items and get notified when they're back in stock.
                      </p>
                      <Button onClick={() => window.location.href = '/wishlist'}>
                        View Wishlist
                      </Button>
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
    </div>
  );
};

export default CustomerDashboard; 