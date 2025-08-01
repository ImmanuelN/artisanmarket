import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../utils/api'

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'vendor' | 'admin'
  onboardingComplete?: boolean
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })
      // register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUser,
  clearError,
} = authSlice.actions

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        const { user, token } = response.data
        localStorage.setItem('token', token)
        
        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { user, token }
      } else {
        return rejectWithValue(response.data.message || 'Login failed')
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ')
        return rejectWithValue(errorMessages)
      } else if (error.message) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Login failed. Please try again.')
      }
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        const { user, token } = response.data
        localStorage.setItem('token', token)
        
        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { user, token }
      } else {
        return rejectWithValue(response.data.message || 'Registration failed')
      }
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ')
        return rejectWithValue(errorMessages)
      } else if (error.message) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue('Registration failed. Please try again.')
      }
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
  return null
})

// Check if user is authenticated
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token found')
      }

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await api.get('/auth/me')
      
      if (response.data.success) {
        return { user: response.data.user, token }
      } else {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        return rejectWithValue('Token invalid')
      }
    } catch (error: any) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      return rejectWithValue('Authentication check failed')
    }
  }
)

export default authSlice.reducer
