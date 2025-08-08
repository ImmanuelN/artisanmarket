import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  _id: string
  title: string
  price: number
  images: { url: string }[]
  vendor: {
    storeName: string
    _id: string
  }
  ratings: {
    average: number
    count: number
  }
  status: string
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

const getInitialCartItems = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error parsing cart data from localStorage:', error);
    localStorage.removeItem('cart'); // Clear corrupted data
    return [];
  }
};

const initialState: CartState = {
  items: getInitialCartItems(),
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
      const existingItem = state.items.find(item => item._id === action.payload._id)
      
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
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload)
      
      // Recalculate totals
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item._id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
        
        // Recalculate totals
        const totals = calculateTotals(state.items)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        
        // Save to localStorage
        try {
          localStorage.setItem('cart', JSON.stringify(state.items))
        } catch (error) {
          console.error('Error saving cart to localStorage:', error)
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      try {
        localStorage.removeItem('cart')
      } catch (error) {
        console.error('Error clearing cart from localStorage:', error)
      }
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
