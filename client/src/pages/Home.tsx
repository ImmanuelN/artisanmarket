import { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  PlayIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { AppDispatch } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import { Container, Card, Button, ProductCard } from '../components/ui';
import api from '../utils/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  vendor: {
    storeName: string;
    _id: string;
    user?: string; // User ID of the vendor
  };
  ratings: {
    average: number;
    count: number;
  };
  status: string;
  categories: string[];
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [realFeaturedProducts, setRealFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    fetchRealFeaturedProducts();
  }, [dispatch]);

  const fetchRealFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?featured=true&limit=6');
      if (response.data.success) {
        setRealFeaturedProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };



  const heroImages = [
    'https://images.unsplash.com/photo-1673339066872-39b9f5bdb48b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1623295291831-4565f0879150?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  // Updated categories to match Product model enum values
  const categories = [
    {
      name: 'Ceramics',
      image: 'https://images.unsplash.com/photo-1595351298020-038700609878?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 150,
      color: 'from-orange-400 to-orange-600',
      slug: 'ceramics'
    },
    {
      name: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 234,
      color: 'from-purple-400 to-purple-600',
      slug: 'jewelry'
    },
    {
      name: 'Leather Goods',
      image: 'https://images.unsplash.com/photo-1711915506137-dd9e9b3488a1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 89,
      color: 'from-amber-400 to-amber-600',
      slug: 'leather-goods'
    },
    {
      name: 'Textiles',
      image: 'https://images.unsplash.com/photo-1562869929-bda0650edb1f?q=80&w=1184&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 178,
      color: 'from-emerald-400 to-emerald-600',
      slug: 'textiles'
    },
    {
      name: 'Woodwork',
      image: 'https://images.unsplash.com/photo-1547609434-b732edfee020?q=80&w=1144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 95,
      color: 'from-rose-400 to-rose-600',
      slug: 'woodwork'
    },
    {
      name: 'Glass',
      image: 'https://images.unsplash.com/photo-1677137340058-a0c01a4c0a5a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 67,
      color: 'from-blue-400 to-blue-600',
      slug: 'glass'
    }
  ];

  const stats = [
    { label: 'Global Artisans', value: '15K+', icon: UserGroupIcon, color: 'text-amber-600' },
    { label: 'Unique Products', value: '50K+', icon: ShoppingBagIcon, color: 'text-blue-600' },
    { label: 'Countries Served', value: '120+', icon: GlobeAltIcon, color: 'text-emerald-600' },
    { label: 'Happy Customers', value: '500K+', icon: StarIcon, color: 'text-purple-600' }
  ];

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Worldwide Shipping',
      description: 'On orders over $75'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Authenticity Guaranteed',
      description: 'Every item is verified handmade'
    },
    {
      icon: CreditCardIcon,
      title: 'Secure Payments',
      description: '256-bit SSL encryption'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Interior Designer',
      image: 'https://plus.unsplash.com/premium_photo-1675425206297-2f34477431b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'The quality of craftsmanship is exceptional. Every piece tells a story and adds character to my designs.',
      rating: 5
    },
    {
      name: 'David Thomas',
      role: 'Art Collector',
      image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'ArtisanMarket has become my go-to source for unique, authentic pieces that you cannot find anywhere else.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Home Decorator',
      image: 'https://images.unsplash.com/photo-1643068470633-aef46b5ce574?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'Supporting artisans while decorating my home has never been easier. The platform is intuitive and the quality is outstanding.',
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent"></div>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-6"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Discover Authentic Handcrafted Treasures
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Where Art Meets
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent block">
                  Authenticity
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Connect with passionate artisans from around the globe. Discover one-of-a-kind, 
                handcrafted pieces that carry the soul of their creators.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/shop">
                  <Button size="lg" className="group shadow-lg">
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    Explore Marketplace
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a target="_blank" rel="noopener noreferrer" href="https://youtube.com/watch?v=example">
                  <Button variant="outline" size="lg" className="group">
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Watch Our Story
                  </Button>
                </a>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">15K+</div>
                  <div className="text-sm text-gray-600">Global Artisans</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Unique Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-6"
                >
                  <Card hover className="overflow-hidden">
                    <img
                      src={heroImages[0]}
                      alt="Handcrafted pottery"
                      className="w-full h-48 object-cover"
                    />
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900">Artisan Pottery</h3>
                      <p className="text-sm text-gray-600">Handmade ceramics</p>
                    </Card.Content>
                  </Card>

                  <Card hover className="overflow-hidden">
                    <img
                      src={heroImages[1]}
                      alt="Leather crafts"
                      className="w-full h-32 object-cover"
                    />
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900">Leather Goods</h3>
                      <p className="text-sm text-gray-600">Premium quality</p>
                    </Card.Content>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-6 mt-12"
                >
                  <Card hover className="overflow-hidden">
                    <img
                      src={heroImages[2]}
                      alt="Handmade jewelry"
                      className="w-full h-32 object-cover"
                    />
                    <Card.Content>
                      <h3 className="font-semibold text-gray-900">Fine Jewelry</h3>
                      <p className="text-sm text-gray-600">Unique designs</p>
                    </Card.Content>
                  </Card>

                  <Card hover className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    <Card.Content>
                      <div className="text-center py-8">
                        <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Join 500K+ Customers</h3>
                        <p className="text-amber-100">Discover authentic craftsmanship</p>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-amber-200 rounded-full opacity-60"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-orange-200 rounded-full opacity-60"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-t border-gray-100">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Trusted by Creators & Collectors Worldwide
            </h2>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Join a thriving community of artisans and art lovers making authentic connections through handcrafted excellence.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-amber-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-6">
              <StarIcon className="w-4 h-4 mr-2" />
              Curated Collection
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Masterpieces
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of extraordinary artisan creations, 
              each piece telling a unique story of craftsmanship and creativity.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {loading ? (
              // Loading skeleton
              [...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
              ))
            ) : realFeaturedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 mb-4">
                  <ShoppingBagIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No featured products available</h3>
                <p className="text-gray-600">Check back later for our curated selection.</p>
              </div>
            ) : (
              realFeaturedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  variant="featured"
                  showQuickView={true}
                  showWishlist={true}
                  showAddToCart={false}
                  index={index}
                />
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Link to="/shop">
              <Button size="lg" variant="outline" className="group">
                Explore All Products
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Enhanced Categories */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive into our diverse collection of artisan crafts, each category representing 
              centuries of tradition and modern innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/shop?category=${category.slug}&sort=newest`}>
                  <Card hover className="overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                        >
                          <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                          <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Explore Collection
                            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-6 right-6 w-4 h-4 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied customers who have discovered the joy of authentic artisan craftsmanship.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center p-8">
                  <div className="mb-6">
                    <div className="flex justify-center space-x-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl lg:text-2xl text-gray-700 font-medium italic mb-6">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Start Your
              <span className="block">Artisan Journey?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-amber-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of talented artisans who are sharing their passion with the world. 
              Set up your shop today and reach customers across the globe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/why-become-vendor">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl px-8 py-4 text-lg"
                >
                  <UserGroupIcon className="w-6 h-6 mr-2" />
                  Why Become an Artisan
                </Button>
              </Link>
              
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
                >
                  <UserGroupIcon className="w-6 h-6 mr-2" />
                  Become an Artisan
                </Button>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-amber-100 mb-4">Join our newsletter for exclusive updates</p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-l-none rounded-r-lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default Home
