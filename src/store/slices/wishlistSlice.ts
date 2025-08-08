import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WishlistProduct {
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
  addedAt: string
}

interface WishlistState {
  items: WishlistProduct[]
  isOpen: boolean
}

const getInitialWishlistItems = () => {
  try {
    const wishlistData = localStorage.getItem('wishlist');
    return wishlistData ? JSON.parse(wishlistData) : [];
  } catch (error) {
    console.error('Error parsing wishlist data from localStorage:', error);
    localStorage.removeItem('wishlist'); // Clear corrupted data
    return [];
  }
};

const initialState: WishlistState = {
  items: getInitialWishlistItems(),
  isOpen: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Omit<WishlistProduct, 'addedAt'>>) => {
      const existingItem = state.items.find(item => item._id === action.payload._id)
      
      if (!existingItem) {
        state.items.push({ 
          ...action.payload, 
          addedAt: new Date().toISOString() 
        })
        
        // Save to localStorage
        try {
          localStorage.setItem('wishlist', JSON.stringify(state.items))
        } catch (error) {
          console.error('Error saving wishlist to localStorage:', error)
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload)
      
      // Save to localStorage
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error)
      }
    },
    clearWishlist: (state) => {
      state.items = []
      try {
        localStorage.removeItem('wishlist')
      } catch (error) {
        console.error('Error clearing wishlist from localStorage:', error)
      }
    },
    toggleWishlist: (state) => {
      state.isOpen = !state.isOpen
    },
    closeWishlist: (state) => {
      state.isOpen = false
    },
    moveToCart: (state, action: PayloadAction<string>) => {
      // This will be handled by the cart slice
      // We just remove from wishlist here
      state.items = state.items.filter(item => item._id !== action.payload)
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error)
      }
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
  closeWishlist,
  moveToCart,
} = wishlistSlice.actions

export default wishlistSlice.reducer 