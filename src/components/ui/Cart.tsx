import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Card, Button } from './index';
import { removeFromCart, updateQuantity, clearCart, closeCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import { showSuccessNotification } from '../../utils/notifications';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, isOpen } = useSelector((state: RootState) => state.cart);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    showSuccessNotification('Item removed from cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    showSuccessNotification('Cart cleared');
  };

  const handleCloseCart = () => {
    dispatch(closeCart());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseCart}
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingBagIcon className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <Button onClick={handleCloseCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item._id} className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={item.images[0]?.url || 'https://via.placeholder.com/80x80'}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                          <p className="text-sm text-gray-500">by {item.vendor.storeName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <Link to="/checkout" className="flex-1">
                    <Button 
                      onClick={handleCloseCart}
                      className="w-full"
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
                
                <button
                  onClick={handleCloseCart}
                  className="w-full text-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart; 