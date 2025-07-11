import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, SparklesIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { AppDispatch } from '../../store/store';
import { register } from '../../store/slices/authSlice';
import { validateRegistration, ValidationError } from '../../utils/validation';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import { Container, Button, Input, Card, Logo } from '../../components/ui';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors([]);

    // Client-side validation
    const errors = validateRegistration(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await dispatch(register(registrationData)).unwrap();
      
      showSuccessNotification('Registration successful! Welcome to ArtisanMarket!');
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      showErrorNotification(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      <Container size="sm" className="relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-6">   
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Join our community
              </h1>
              <p className="text-lg text-gray-600">
                Create your account and start your artisan journey
              </p>
            </div>
          </div>

          {/* Register Form */}
          <Card className="p-8 lg:p-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {validationErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm space-y-1"
                >
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>{error.message}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.role === 'customer'
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, role: 'customer' })}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <ShoppingBagIcon className="w-8 h-8 text-amber-600" />
                        <div className="text-center">
                          <div className="font-medium text-gray-900">Customer</div>
                          <div className="text-sm text-gray-500">Buy products</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.role === 'vendor'
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, role: 'vendor' })}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="vendor"
                        checked={formData.role === 'vendor'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <BuildingStorefrontIcon className="w-8 h-8 text-amber-600" />
                        <div className="text-center">
                          <div className="font-medium text-gray-900">Vendor</div>
                          <div className="text-sm text-gray-500">Sell products</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-amber-600 hover:text-amber-700 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-amber-600 hover:text-amber-700 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Register;
