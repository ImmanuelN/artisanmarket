// ...existing code...
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { TrashIcon, ArrowLeftIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Container, Card, Button, ProductCard } from '../components/ui';
import { removeFromWishlist, moveToCart } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import { showSuccessNotification } from '../utils/notifications';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.wishlist);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    showSuccessNotification('Item removed from wishlist');
  };

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(moveToCart(product._id));
    showSuccessNotification('Product moved to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <Container>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite products here to keep track of items you love!
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
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, index) => {
            // Ensure 'description' property exists for ProductCard
            const productWithDescription = {
              ...item,
              description: item.description || 'No description available.'
            };
            return (
              <div key={item._id} className="relative group">
                <ProductCard
                  product={productWithDescription}
                  variant="compact"
                  showWishlist={false}
                  showAddToCart={false}
                  index={index}
                />
                {/* Custom overlay with actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
                    title="Move to cart"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Actions */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    items.forEach(item => handleMoveToCart(item));
                  }}
                  className="flex-1"
                >
                  Move All to Cart
                </Button>
                <Link to="/cart" className="flex-1">
                  <Button className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Wishlist; 