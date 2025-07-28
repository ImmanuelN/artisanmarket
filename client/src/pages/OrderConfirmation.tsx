import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  EnvelopeIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClockIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button } from '../components/ui';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: searchParams.get('orderId') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    total: searchParams.get('total') || '0.00'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. We've received your order and will begin processing it right away.
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <Card.Content>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold text-gray-900">{orderDetails.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-gray-900">${orderDetails.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <Card.Content>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                      <p className="text-sm text-gray-600">
                        You'll receive an order confirmation email within the next few minutes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Order Processing</h3>
                      <p className="text-sm text-gray-600">
                        Our artisans will begin crafting your items. You'll receive updates on your order status.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TruckIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Shipping Updates</h3>
                      <p className="text-sm text-gray-600">
                        Once your order ships, you'll receive tracking information via email.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/" className="flex-1">
              <Button className="w-full">
                <HomeIcon className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArchiveBoxIcon className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600 mb-4">
              Have questions about your order? Contact our support team at{' '}
              <a href="mailto:support@artisanmarket.com" className="text-amber-600 hover:text-amber-700">
                support@artisanmarket.com
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Thank you for supporting independent artisans and their craft!
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmation; 