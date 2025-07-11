import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface VendorProduct {
  id: string
  title: string
  price: number
  inventory: number
  status: 'active' | 'inactive' | 'pending'
  sales: number
  revenue: number
  createdAt: string
}

interface VendorStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalOrders: number
  monthlyRevenue: number[]
  topProducts: VendorProduct[]
}

interface VendorState {
  profile: {
    id: string
    storeName: string
    email: string
    bio: string
    avatar: string
    approved: boolean
    balance: number
    commissionRate: number
    createdAt: string
  } | null
  products: VendorProduct[]
  stats: VendorStats | null
  orders: any[]
  loading: boolean
  error: string | null
}

const initialState: VendorState = {
  profile: null,
  products: [],
  stats: null,
  orders: [],
  loading: false,
  error: null,
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setVendorProfile: (state, action: PayloadAction<VendorState['profile']>) => {
      state.profile = action.payload
    },
    setVendorProducts: (state, action: PayloadAction<VendorProduct[]>) => {
      state.products = action.payload
    },
    setVendorStats: (state, action: PayloadAction<VendorStats>) => {
      state.stats = action.payload
    },
    setVendorOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload
    },
    addVendorProduct: (state, action: PayloadAction<VendorProduct>) => {
      state.products.push(action.payload)
    },
    updateVendorProduct: (state, action: PayloadAction<VendorProduct>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    removeVendorProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
    updateVendorProfile: (state, action: PayloadAction<Partial<VendorState['profile']>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setVendorProfile,
  setVendorProducts,
  setVendorStats,
  setVendorOrders,
  addVendorProduct,
  updateVendorProduct,
  removeVendorProduct,
  updateVendorProfile,
} = vendorSlice.actions

export default vendorSlice.reducer
