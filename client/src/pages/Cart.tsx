import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Container, Card, Button } from '../components/ui';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import { showSuccessNotification } from '../utils/notifications';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <Container>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrashIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Start shopping to discover amazing artisan products!
            </p>
            <Link to="/shop">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/shop" className="flex items-center text-gray-600 hover:text-amber-600 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <Button variant="outline" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item._id} className="p-6">
                <div className="flex space-x-6">
                  <img
                    src={item.images[0]?.url || 'https://via.placeholder.com/120x120'}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2">by {item.vendor.storeName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-amber-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart
