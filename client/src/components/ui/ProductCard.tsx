import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Button } from './index';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  vendor: {
    storeName: string;
    _id: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  status: string;
  categories?: string[];
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'featured' | 'compact';
  showQuickView?: boolean;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  className?: string;
  index?: number;
}

const ProductCard = ({
  product,
  variant = 'default',
  showQuickView = false,
  showWishlist = true,
  showAddToCart = true,
  className = '',
  index = 0
}: ProductCardProps) => {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';



  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group ${className}`}
    >
      <Link to={`/product/${product._id}`}>
        {isFeatured ? (
          <Card hover className="group overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Featured badge */}
              <div className="absolute top-4 left-4">
                <Badge variant="success" className="bg-white/90 text-green-700">
                  Featured
                </Badge>
              </div>
              
              {/* Wishlist button */}
              {showWishlist && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}

              {/* Quick view button */}
              {showQuickView && (
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              )}

              {/* Rating badge */}
              <div className="absolute top-4 right-4 group-hover:hidden">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{product.ratings.average}</span>
                </div>
              </div>
            </div>
            
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-amber-600 transition-colors truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600">by {product.vendor.storeName}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        ) : (
          <Card hover className="group overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={product.images[0]?.url || 'https://via.placeholder.com/400x300'}
                alt={product.title}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  isCompact ? 'h-48' : 'h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Wishlist button */}
              {showWishlist && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              )}

              {/* Add to cart button */}
              {showAddToCart && (
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              )}

              {/* Rating badge */}
              <div className="absolute top-4 right-4 group-hover:hidden">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{product.ratings.average}</span>
                </div>
              </div>
            </div>
            
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <h3 className={`font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors truncate ${
                    isCompact ? 'text-base' : 'text-lg'
                  }`}>
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600">by {product.vendor.storeName}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-gray-900 ${
                    isCompact ? 'text-lg' : 'text-2xl'
                  }`}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </Link>
    </motion.div>
  );

  return cardContent;
};

export default ProductCard; 