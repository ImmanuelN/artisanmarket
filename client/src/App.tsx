import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Store
import { AppDispatch } from './store/store'
import { checkAuth } from './store/slices/authSlice'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VendorDashboard from './pages/vendor/VendorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Vendor Routes */}
          <Route path="/vendor/*" element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </motion.main>
      
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white text-gray-900 shadow-lg',
          duration: 4000,
        }}
      />
    </div>
  )
}

export default App
