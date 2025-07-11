import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, StarIcon, HeartIcon, ShoppingBagIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts, updateFilters } from '../store/slices/productSlice';
import { Container, Card, Button, Input } from '../components/ui';

const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, filters, pagination } = useSelector((state: RootState) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All Categories',
    'Jewelry',
    'Home Decor',
    'Pottery',
    'Textiles',
    'Woodwork',
    'Art',
    'Accessories'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      dispatch(updateFilters({ category }));
    }
    dispatch(fetchProducts(filters));
  }, [dispatch, searchParams, filters]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(updateFilters(newFilters));
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== 'All Categories') {
      params.set('category', newFilters.category);
    }
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-gray-600 mt-1">
                  Showing {products.length} of {pagination.totalItems} products
                </p>
              </div>
              
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full sm:w-80"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-8">
              <Card.Content>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category || (!filters.category && category === 'All Categories')}
                          onChange={(e) => handleFilterChange({ category: e.target.value === 'All Categories' ? undefined : e.target.value })}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      value={filters.priceRange?.[0] || ''}
                      onChange={(e) => handleFilterChange({ 
                        priceRange: [Number(e.target.value), filters.priceRange?.[1] || 1000] 
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      value={filters.priceRange?.[1] || ''}
                      onChange={(e) => handleFilterChange({ 
                        priceRange: [filters.priceRange?.[0] || 0, Number(e.target.value)] 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => handleFilterChange({})}
                className="w-full px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Clear All Filters
              </button>
              </Card.Content>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <ShoppingBagIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                        alt={product.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <HeartIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 truncate">by {product.vendorName}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">${product.price}</span>
                        <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                          <ShoppingBagIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === i + 1
                          ? 'text-white bg-indigo-600 border border-indigo-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
