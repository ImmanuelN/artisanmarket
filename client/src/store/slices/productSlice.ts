import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../utils/api'

interface Product {
  id: string
  title: string
  price: number
  currency: string
  images: string[]
  description: string
  category: string
  tags: string[]
  vendorId: string
  vendorName: string
  inventory: number
  rating: number
  reviewCount: number
  attributes: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  rating?: number
  vendor?: string
  tags?: string[]
  search?: string
}

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  categories: string[]
  filters: ProductFilters
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  filters: {},
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured products';
      })
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.totalItems = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
})

export const {
  setLoading,
  setError,
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setCategories,
  setFilters,
  updateFilters,
  clearFilters,
  setPagination,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions

// Async thunks
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async () => {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      // For development, return mock data
      return [
        {
          _id: '1',
          name: 'Handcrafted Ceramic Mug',
          price: 28.99,
          images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'],
          vendor: 'Clay & Dreams',
          rating: 4.8,
          reviews: Array(124).fill({}),
          isOnSale: false,
        },
        {
          _id: '2',
          name: 'Leather Laptop Bag',
          price: 89.99,
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
          vendor: 'Leather Works Co.',
          rating: 4.9,
          reviews: Array(89).fill({}),
          isOnSale: true,
          originalPrice: 120.00,
        },
        // Add more mock products...
      ];
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      return { products: [], total: 0 };
    }
  }
);

export default productSlice.reducer
