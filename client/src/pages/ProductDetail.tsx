import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  ArrowLeftIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  TagIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Container, Button, Badge } from '../components/ui';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { RootState } from '../store/store';
import api from '../utils/api';
import { showSuccessNotification, showErrorNotification } from '../utils/notifications';

interface Product {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
  vendor: {
    _id: string;
    storeName: string;
    storeDescription?: string;
    logo?: string;
    contact?: {
      email?: string;
      phone?: string;
      website?: string;
    };
    business?: {
      address?: {
        city?: string;
        country?: string;
      };
    };
  };
  categories: string[];
  inventory: {
    quantity: number;
    lowStockAlert: number;
    trackQuantity: boolean;
  };
  ratings: {
    average: number;
    count: number;
  };
  status: string;
  materials?: string[];
  techniques?: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  shipping?: {
    freeShipping: boolean;
    shippingCost: number;
    processingTime: number;
  };
  views: number;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const isInWishlist = product ? wishlistItems.some(item => item._id === product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
      showSuccessNotification(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
    } catch (error) {
      showErrorNotification('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
        showSuccessNotification('Product removed from wishlist');
      } else {
        dispatch(addToWishlist(product));
        showSuccessNotification('Product added to wishlist!');
      }
    } catch (error) {
      showErrorNotification('Failed to update wishlist');
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
        <Container>
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-300 h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 h-20 w-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded w-3/4"></div>
                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                <div className="bg-gray-300 h-4 rounded w-full"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
        <Container>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <EyeIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/shop')}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const isInStock = product.inventory.quantity > 0;
  const isLowStock = product.inventory.quantity <= product.inventory.lowStockAlert;
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600x600'}
                alt={product.images[selectedImage]?.alt || product.title}
                className="w-full h-96 object-contain"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercentage}%
                </div>
              )}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors ${
                  isInWishlist 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-white ${
                      selectedImage === index ? 'border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Product image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.ratings.average)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">• {product.views} views</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {isInStock ? (
                <Badge color="success" className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  In Stock
                </Badge>
              ) : (
                <Badge color="error" className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Out of Stock
                </Badge>
              )}
              {isLowStock && isInStock && (
                <Badge color="warning" className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Low Stock ({product.inventory.quantity} left)
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                  >
                    {formatCategory(category)}
                  </span>
                ))}
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={product.vendor.logo || 'https://via.placeholder.com/40x40'}
                  alt={product.vendor.storeName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{product.vendor.storeName}</h3>
                  {product.vendor.business?.address?.city && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {product.vendor.business.address.city}
                    </p>
                  )}
                </div>
              </div>
              <Link
                to={`/vendor/store/${product.vendor._id}`}
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                Visit Store
              </Link>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              {product.shipping && (
                <div className="flex items-center space-x-2">
                  <TruckIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.shipping.freeShipping ? 'Free Shipping' : `$${product.shipping.shippingCost} Shipping`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.shipping.processingTime} day processing
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Materials and Techniques */}
          {(product.materials?.length || product.techniques?.length) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
              {product.materials?.length && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material) => (
                      <span
                        key={material}
                        className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.techniques?.length && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.techniques.map((technique) => (
                      <span
                        key={technique}
                        className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.dimensions.length && (
                  <div>
                    <p className="text-sm text-gray-600">Length</p>
                    <p className="font-medium">{product.dimensions.length} {product.dimensions.unit}</p>
                  </div>
                )}
                {product.dimensions.width && (
                  <div>
                    <p className="text-sm text-gray-600">Width</p>
                    <p className="font-medium">{product.dimensions.width} {product.dimensions.unit}</p>
                  </div>
                )}
                {product.dimensions.height && (
                  <div>
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="font-medium">{product.dimensions.height} {product.dimensions.unit}</p>
                  </div>
                )}
                {product.dimensions.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{product.dimensions.weight} {product.dimensions.unit}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
