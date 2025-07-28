import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, ShoppingBagIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Container, Card, Button, Input, Badge, ProductCard } from '../components/ui';
import api from '../utils/api';

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
}

interface Store {
  _id: string;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  business?: {
    address?: {
      city?: string;
      country?: string;
    };
  };
  specialties?: string[];
}

// Helper function to convert category to kebab-case for backend
const formatCategory = (category: string) => category.toLowerCase().replace(/\s+/g, '-');



const Shop = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearchPending, setIsSearchPending] = useState(false);

  // Updated categories to match Product model enum values
  const categories = [
    'All Categories',
    'Ceramics',
    'Textiles',
    'Jewelry',
    'Leather Goods',
    'Woodwork',
    'Metalwork',
    'Glass',
    'Paintings',
    'Sculptures',
    'Home Decor',
    'Accessories',
    'Toys',
    'Other'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set pending state
    setIsSearchPending(true);

    // Set new timeout for 3 seconds
    const timeout = setTimeout(() => {
      handleFilterChange({ search: searchTerm });
      setIsSearchPending(false);
    }, 1000);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      
      // If there's a search term, use the combined search endpoint
      if (filters.search) {
        const queryParams = new URLSearchParams();
        queryParams.set('search', filters.search);
        queryParams.set('page', pagination.currentPage.toString());
        queryParams.set('limit', '12');

        const response = await api.get(`/products/search/combined?${queryParams.toString()}`);
        if (response.data.success) {
          setProducts(response.data.products);
          setStores(response.data.stores);
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalItems
          });
        }
      } else {
        // Regular product filtering without search
        const queryParams = new URLSearchParams();
        
        if (filters.category && filters.category !== 'All Categories') {
          queryParams.set('category', formatCategory(filters.category));
        }
        if (filters.minPrice) {
          queryParams.set('minPrice', filters.minPrice);
        }
        if (filters.maxPrice) {
          queryParams.set('maxPrice', filters.maxPrice);
        }
        if (filters.sort) {
          const [sortBy, sortOrder] = filters.sort === 'price-low' 
            ? ['price', 'asc'] 
            : filters.sort === 'price-high'
            ? ['price', 'desc']
            : filters.sort === 'rating'
            ? ['ratings.average', 'desc']
            : ['createdAt', 'desc'];
          
          queryParams.set('sortBy', sortBy);
          queryParams.set('sortOrder', sortOrder);
        }
        queryParams.set('page', pagination.currentPage.toString());
        queryParams.set('limit', '12');

        const response = await api.get(`/products?${queryParams.toString()}`);
        if (response.data.success) {
          setProducts(response.data.products);
          setStores([]); // Clear stores when not searching
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalProducts
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [filters, pagination.currentPage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.category && updatedFilters.category !== 'All Categories') {
      params.set('category', updatedFilters.category);
    }
    if (updatedFilters.search) {
      params.set('search', updatedFilters.search);
    }
    if (updatedFilters.minPrice) {
      params.set('minPrice', updatedFilters.minPrice);
    }
    if (updatedFilters.maxPrice) {
      params.set('maxPrice', updatedFilters.maxPrice);
    }
    if (updatedFilters.sort) {
      params.set('sort', updatedFilters.sort);
    }
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      category: undefined,
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchInput('');
    setStores([]);
    setIsSearchPending(false);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchParams({});
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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
                  {filters.search ? (
                    <>
                      Showing {products.length + stores.length} of {pagination.totalItems} results for "{filters.search}"
                      {stores.length > 0 && (
                        <span className="text-amber-600 ml-2">
                          ({stores.length} stores, {products.length} products)
                        </span>
                      )}
                    </>
                  ) : (
                    `Showing ${products.length} of ${pagination.totalItems} products`
                  )}
                </p>
              </div>
              
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search products, stores, or artisans..."
                    className="w-full sm:w-80 pl-10"
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                  />
                  {searchInput && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
                      Search includes product names, descriptions, tags, and store names
                    </p>
                  )}
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={filters.sort}
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
          <div className={`lg:w-48 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50"
                >
                  Clear All Filters
                </button>
              </Card.Content>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (products.length === 0 && stores.length === 0) ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <ShoppingBagIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stores Section */}
                {stores.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-amber-600" />
                      Stores ({stores.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {stores.map((store) => (
                        <motion.div
                          key={store._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <Link to={`/vendor/store/${store._id}`}>
                            <div className="relative">
                              <img
                                src={store.logo || 'https://via.placeholder.com/400x300?text=Store'}
                                alt={store.storeName}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2">
                                <Badge variant="success" className="bg-amber-600 text-white">
                                  Store
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-800 mb-1 truncate">{store.storeName}</h3>
                              {store.storeDescription && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{store.storeDescription}</p>
                              )}
                              {store.business?.address?.city && (
                                <p className="text-xs text-gray-500 mb-2 flex items-center">
                                  <MapPinIcon className="w-3 h-3 mr-1" />
                                  {store.business.address.city}
                                  {store.business.address.country && `, ${store.business.address.country}`}
                                </p>
                              )}
                              {store.specialties && store.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {store.specialties.slice(0, 3).map((specialty, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                  {store.specialties.length > 3 && (
                                    <span className="text-xs text-gray-500">+{store.specialties.length - 3} more</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ShoppingBagIcon className="w-5 h-5 mr-2 text-amber-600" />
                      Products ({products.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {products.map((product, index) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          variant="default"
                          showWishlist={true}
                          showAddToCart={true}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Pagination */}
            {!loading && (products.length > 0 || stores.length > 0) && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === i + 1
                          ? 'text-white bg-amber-600 border border-amber-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
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
