import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  id: string
  title: string
  price: number
  image: string
  vendorId: string
  vendorName: string
  quantity?: number
}

interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
}

// Calculate initial totals
const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  )
}

const initialTotals = calculateTotals(initialState.items)
initialState.totalItems = initialTotals.totalItems
initialState.totalPrice = initialTotals.totalPrice

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      
      // Recalculate totals
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
        
        // Recalculate totals
        const totals = calculateTotals(state.items)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      localStorage.removeItem('cart')
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
} = cartSlice.actions

export default cartSlice.reducer
