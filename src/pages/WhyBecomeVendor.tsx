import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  PaintBrushIcon,
  CubeIcon,
  BeakerIcon,
  ScissorsIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Badge } from '../components/ui';

const WhyBecomeVendor = () => {
  const benefits = [
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Connect with customers worldwide and expand your market beyond local boundaries.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Increased Revenue',
      description: 'Access a larger customer base and increase your sales potential significantly.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Support',
      description: 'Join a thriving community of artisans and get support from fellow creators.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payments',
      description: 'Receive secure, reliable payments with our trusted payment processing system.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Get detailed analytics about your sales, customer behavior, and market trends.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: CogIcon,
      title: 'Easy Management',
      description: 'Manage your products, orders, and customer relationships all in one place.',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const features = [
    {
      icon: CameraIcon,
      title: 'Professional Product Showcase',
      description: 'Create stunning product listings with high-quality images and detailed descriptions.'
    },
    {
      icon: PaintBrushIcon,
      title: 'Custom Branding',
      description: 'Personalize your store with your own logo, banner, and brand colors.'
    },
    {
      icon: CubeIcon,
      title: 'Inventory Management',
      description: 'Track your inventory levels and get low-stock alerts automatically.'
    },
    {
      icon: BeakerIcon,
      title: 'Quality Control',
      description: 'Our verification process ensures only authentic handmade products are featured.'
    },
    {
      icon: ScissorsIcon,
      title: 'Custom Orders',
      description: 'Accept custom orders and special requests from customers worldwide.'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Tools & Resources',
      description: 'Access marketing tools, pricing guides, and business development resources.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Ceramic Artist',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      quote: 'ArtisanMarket helped me reach customers across 15 countries. My sales increased by 300% in the first year!',
      rating: 5
    },
    {
      name: 'Ahmed Hassan',
      role: 'Leather Craftsman',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      quote: 'The platform is incredibly user-friendly. I can focus on my craft while they handle the technical aspects.',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Jewelry Designer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      quote: 'Being part of this community has opened so many opportunities. The support is amazing!',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Vendors' },
    { number: '50K+', label: 'Products Sold' },
    { number: '120+', label: 'Countries Reached' },
    { number: '95%', label: 'Vendor Satisfaction' }
  ];

  const categories = [
    'Ceramics & Pottery',
    'Jewelry & Accessories',
    'Leather Goods',
    'Textiles & Fabrics',
    'Woodwork & Furniture',
    'Metalwork',
    'Glass Art',
    'Paintings & Prints',
    'Sculptures',
    'Home Decor',
    'Toys & Games',
    'Custom Orders'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Passion Into
              <span className="text-amber-600 block">Profit</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of talented artisans who are successfully selling their handcrafted creations 
              to customers worldwide. Start your journey today and build a thriving business doing what you love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="shadow-lg">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Start Selling Today
                </Button>
              </Link>
              <Link to="/contact">
              <Button variant="outline" size="lg">
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Contact Sales Team
              </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ArtisanMarket?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed as an artisan entrepreneur, 
              from powerful tools to a supportive community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <Card.Content>
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${benefit.bgColor} rounded-xl flex items-center justify-center`}>
                        <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to showcase your work, manage your business, and grow your sales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <Card.Content>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perfect for All Types of Artisans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you create ceramics, jewelry, textiles, or any other handcrafted items, 
              our platform is designed to showcase your unique talents.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card hover className="text-center p-4">
                  <Card.Content>
                    <Badge variant="outline" className="text-sm">
                      {category}
                    </Badge>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Vendors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from artisans who have transformed their passion into profitable businesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <Card.Content>
                    <div className="text-center">
                      <div className="flex justify-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-gray-700 font-medium italic mb-6">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-gray-600">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our platform in just a few simple steps and start selling your creations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up and complete your vendor profile with your business information.'
              },
              {
                step: '2',
                title: 'Add Your Products',
                description: 'Upload high-quality photos and detailed descriptions of your handcrafted items.'
              },
              {
                step: '3',
                title: 'Get Verified',
                description: 'Our team reviews your application to ensure quality and authenticity.'
              },
              {
                step: '4',
                title: 'Start Selling',
                description: 'Begin receiving orders and building relationships with customers worldwide.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card hover className="h-full">
                  <Card.Content>
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-500 to-amber-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Artisan Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of successful artisans who are already selling their creations 
              and building thriving businesses on ArtisanMarket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 text-lg"
                >
                  <UserGroupIcon className="w-6 h-6 mr-2" />
                  Become a Vendor Today
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default WhyBecomeVendor; 