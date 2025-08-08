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
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderHistory from './pages/OrderHistory'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorBankDashboard from './pages/vendor/VendorBankDashboard'
import BankTestPage from './pages/vendor/BankTestPage'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import WhyBecomeVendor from './pages/WhyBecomeVendor'

// Placeholder Pages
import { Help, Shipping, Returns, FAQ, Privacy, Terms, Cookies } from './pages/PlaceholderPages'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthGuard from './components/auth/AuthGuard'
import OnboardingGuard from './components/vendor/OnboardingGuard'
import StorePage from './pages/vendor/StorePage'

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
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why-become-vendor" element={<WhyBecomeVendor />} />
          <Route path="/vendor/store/:vendorId" element={<StorePage />} />
          
          {/* Placeholder Pages */}
          <Route path="/help" element={<Help />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthGuard redirectIfAuthenticated={true}>
              <Login />
            </AuthGuard>
          } />
          <Route path="/register" element={
            <AuthGuard redirectIfAuthenticated={true}>
              <Register />
            </AuthGuard>
          } />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          
          {/* Customer Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Vendor Routes */}
          <Route path="/vendor/*" element={
            <ProtectedRoute role="vendor">
              <OnboardingGuard>
                <VendorDashboard />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          <Route path="/vendor-bank" element={
            <ProtectedRoute role="vendor">
              <OnboardingGuard>
                <VendorBankDashboard />
              </OnboardingGuard>
            </ProtectedRoute>
          } />
          <Route path="/vendor-bank-test" element={
            <ProtectedRoute role="vendor">
              <OnboardingGuard>
                <BankTestPage />
              </OnboardingGuard>
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
