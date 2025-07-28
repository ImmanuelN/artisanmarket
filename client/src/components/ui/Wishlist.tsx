import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Card, Button } from './index';
import { removeFromWishlist, moveToCart, closeWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import { showSuccessNotification } from '../../utils/notifications';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.wishlist);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    showSuccessNotification('Item removed from wishlist');
  };

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(moveToCart(product._id));
    showSuccessNotification('Product moved to cart!');
  };

  const handleCloseWishlist = () => {
    dispatch(closeWishlist());
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
            onClick={handleCloseWishlist}
          />
          
          {/* Wishlist Sidebar */}
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
                <HeartIcon className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">Wishlist</h2>
                {items.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseWishlist}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-6">Save your favorite products here!</p>
                  <Button onClick={handleCloseWishlist}>
                    Start Shopping
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
                              <button
                                onClick={() => handleMoveToCart(item)}
                                className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                title="Move to cart"
                              >
                                <ShoppingBagIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                title="Remove from wishlist"
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
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCloseWishlist}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Link to="/shop" className="flex-1">
                    <Button 
                      onClick={handleCloseWishlist}
                      className="w-full"
                    >
                      Browse More
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Wishlist; 