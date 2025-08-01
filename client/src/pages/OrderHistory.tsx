import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CogIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Badge, OrderStatus, OrderStatusTracker, Modal } from '../components/ui';
import { RootState } from '../store/store';
import api from '../utils/api';
import { showErrorNotification } from '../utils/notifications';
import { Link } from 'react-router-dom';

interface OrderItem {
  product: {
    _id: string;
    title: string;
    images: { url: string }[];
    price: number;
  };
  quantity: number;
  price: number;
  vendor: {
    _id: string;
    storeName: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
  };
  shippingMethod: string;
  orderNotes?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  estimatedDelivery: string;
  trackingNumber?: string;
  trackingUrl?: string;
  isPaid: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

const OrderHistory = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusTrackingModal, setStatusTrackingModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({
    isOpen: false,
    order: null
  });
  const [deliveryProof, setDeliveryProof] = useState<any>(null);
  const [deliveryProofLoading, setDeliveryProofLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/orders?${params}`);
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showErrorNotification('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryProof = async (orderId: string) => {
    try {
      setDeliveryProofLoading(true);
      console.log('Fetching delivery proof for order:', orderId);
      
      const response = await api.get(`/delivery-proof/order/${orderId}`);
      console.log('Delivery proof response:', response.data);
      
      if (response.data.success) {
        setDeliveryProof(response.data.deliveryProof);
      } else {
        setDeliveryProof(null);
      }
    } catch (error: any) {
      console.error('Error fetching delivery proof:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        console.error('Access denied - user may not have permission to view this order');
        showErrorNotification('Access denied: You do not have permission to view delivery proof for this order');
      } else if (error.response?.status === 404) {
        console.error('Order not found');
        showErrorNotification('Order not found');
      } else {
        showErrorNotification('Failed to load delivery proof');
      }
      
      setDeliveryProof(null);
    } finally {
      setDeliveryProofLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'processing':
        return CogIcon;
      case 'shipped':
        return TruckIcon;
      case 'delivered':
        return CheckCircleIcon;
      case 'cancelled':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case 'free':
        return 'Free Shipping';
      case 'standard':
        return 'Standard Shipping';
      case 'express':
        return 'Express Shipping';
      default:
        return method;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Container>
          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to access your order history.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders and view order history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="mb-6">
              <Card.Content>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              </Card.Content>
            </Card>

            {/* Orders List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <Card.Content>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="bg-gray-300 h-4 rounded w-1/4 mb-2"></div>
                          <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                        </div>
                        <div className="bg-gray-300 h-8 rounded w-20"></div>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <Card.Content className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {statusFilter === 'all' 
                      ? "You haven't placed any orders yet." 
                      : `No ${statusFilter} orders found.`
                    }
                  </p>
                  <Link to="/shop">
                    <Button>
                      Start Shopping
                    </Button>
                  </Link>
                </Card.Content>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card hover>
                        <Card.Content>
                          <div className="space-y-4">
                            {/* Order Info Section */}
                            <div className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                              <div className="flex items-center space-x-4 mb-3">
                                <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                                <OrderStatus status={order.status} />
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Items:</span> {order.items.length}
                                </div>
                                <div>
                                  <span className="font-medium">Payment:</span> 
                                  <span className={`ml-1 ${
                                    order.paymentStatus === 'completed' ? 'text-green-600' : 
                                    order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons Section */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center justify-center"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setStatusTrackingModal({ isOpen: true, order });
                                  await fetchDeliveryProof(order._id);
                                }}
                              >
                                <TruckIcon className="w-4 h-4 mr-2" />
                                Track Status
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Card className="mt-6">
                    <Card.Content>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ArrowLeftIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            <ArrowRightIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedOrder ? (
                <Card>
                  <Card.Content>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(null)}
                      >
                        ×
                      </Button>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">#{selectedOrder.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span>{formatDateTime(selectedOrder.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <OrderStatus status={selectedOrder.status} />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-medium ${
                              selectedOrder.paymentStatus === 'completed' ? 'text-green-600' : 
                              selectedOrder.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {selectedOrder.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span>{getShippingMethodName(selectedOrder.shippingMethod)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost:</span>
                            <span>{selectedOrder.shippingCost === 0 ? 'Free' : `$${selectedOrder.shippingCost.toFixed(2)}`}</span>
                          </div>
                          {selectedOrder.estimatedDelivery && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estimated Delivery:</span>
                              <span>{formatDate(selectedOrder.estimatedDelivery)}</span>
                            </div>
                          )}
                          {selectedOrder.trackingNumber && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tracking:</span>
                              <a 
                                href={selectedOrder.trackingUrl || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-amber-600 hover:text-amber-700 underline"
                              >
                                {selectedOrder.trackingNumber}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${selectedOrder.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span>{selectedOrder.shippingCost === 0 ? 'Free' : `$${selectedOrder.shippingCost.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span>${selectedOrder.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                          <p>{selectedOrder.shippingAddress.email}</p>
                          <p>{selectedOrder.shippingAddress.phone}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <img
                                src={item.product.images[0]?.url || 'https://via.placeholder.com/40x40'}
                                alt={item.product.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                <p className="text-xs text-gray-600">by {item.vendor.storeName}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedOrder.orderNotes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {selectedOrder.orderNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              ) : (
                <Card>
                  <Card.Content className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Order</h3>
                    <p className="text-gray-600">Click on any order to view its details</p>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Status Tracking Modal */}
        <Modal
          isOpen={statusTrackingModal.isOpen}
          onClose={() => {
            setStatusTrackingModal({ isOpen: false, order: null });
            setDeliveryProof(null);
          }}
          title={`Live Order Status - #${statusTrackingModal.order?.orderNumber}`}
          size="4xl"
        >
          {deliveryProofLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading delivery proof...</span>
            </div>
          ) : statusTrackingModal.order ? (
            <OrderStatusTracker
              order={{
                status: statusTrackingModal.order.status,
                trackingNumber: statusTrackingModal.order.trackingNumber,
                trackingUrl: statusTrackingModal.order.trackingUrl,
                estimatedDelivery: statusTrackingModal.order.estimatedDelivery
              }}
              orderNumber={statusTrackingModal.order.orderNumber}
              deliveryProof={deliveryProof}
            />
          ) : null}
        </Modal>
      </Container>
    </div>
  );
};

export default OrderHistory; 