import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { RootState, AppDispatch } from '../../store/store'
import { logout } from '../../store/slices/authSlice'
import { toggleCart } from '../../store/slices/cartSlice'
import { Container, Button, Badge, Logo } from '../ui'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const { totalItems } = useSelector((state: RootState) => state.cart)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <Logo variant="icon" size="xl" showText={false} className="group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-amber-600'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search artisan products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-11 pr-4 py-2.5 text-sm border rounded-xl transition-all duration-200 ${
                  isSearchFocused
                    ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm'
                    : 'border-gray-300 hover:border-gray-400'
                } focus:outline-none`}
              />
              <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Button - Only show on medium screens */}
            <button
              className="hidden md:flex lg:hidden p-2 text-gray-600 hover:text-amber-600 transition-colors"
              onClick={() => {/* Handle mobile search modal */}}
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* Wishlist - Desktop only */}
            <button className="hidden lg:flex p-2 text-gray-600 hover:text-amber-600 transition-colors">
              <HeartIcon className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge 
                  variant="error" 
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </button>

            {/* User Menu - Desktop only */}
            {user ? (
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">                  
                        {user.role === 'vendor' && (
                          <Link
                            to="/vendor/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BuildingStorefrontIcon className="w-4 h-4 mr-3" />
                            Vendor Dashboard
                          </Link>
                        )}

                        <Link
                          to="/profile?tab=wishlist"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HeartIcon className="w-4 h-4 mr-3" />
                          Wishlist
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-4 space-y-2">
                {/* Mobile Search */}
                <div className="px-4 pb-4">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none"
                    />
                    <MagnifyingGlassIcon className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                  </form>
                </div>

                {/* Mobile Navigation */}
                <nav className="px-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Wishlist */}
                  <Link
                    to="/wishlist"
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HeartIcon className="w-5 h-5 mr-3" />
                    Wishlist
                  </Link>
                </nav>

                {/* Mobile User Actions */}
                {user ? (
                  <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/dashboard"
                          className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BuildingStorefrontIcon className="w-5 h-5 mr-3" />
                          Vendor Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-center h-12"
                      onClick={() => {
                        navigate('/login')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full justify-center h-12"
                      onClick={() => {
                        navigate('/register')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}

export default Header
