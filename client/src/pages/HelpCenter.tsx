import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Topics', icon: QuestionMarkCircleIcon },
    { id: 'orders', name: 'Orders & Payments', icon: ShoppingBagIcon },
    { id: 'shipping', name: 'Shipping & Delivery', icon: TruckIcon },
    { id: 'returns', name: 'Returns & Refunds', icon: ShieldCheckIcon },
    { id: 'account', name: 'Account & Profile', icon: UserGroupIcon },
    { id: 'artisans', name: 'For Artisans', icon: HeartIcon }
  ]

  const popularTopics = [
    {
      category: 'orders',
      title: 'How do I track my order?',
      content: 'You can track your order by logging into your account and visiting the Order History page. Each order will show its current status and tracking information if available.',
      link: '/customer/orders'
    },
    {
      category: 'orders',
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.',
      link: null
    },
    {
      category: 'shipping',
      title: 'How long does shipping take?',
      content: 'Shipping times vary by artisan location and shipping method chosen. Standard shipping typically takes 5-10 business days, while express shipping takes 2-3 business days.',
      link: '/shipping'
    },
    {
      category: 'shipping',
      title: 'Do you ship internationally?',
      content: 'Yes! We ship to most countries worldwide. International shipping times range from 7-21 business days depending on the destination and customs processing.',
      link: '/shipping'
    },
    {
      category: 'returns',
      title: 'What is your return policy?',
      content: 'We offer a 30-day return policy for most items. Items must be in original condition. Custom or personalized items may have different return policies set by individual artisans.',
      link: '/returns'
    },
    {
      category: 'returns',
      title: 'How do I initiate a return?',
      content: 'To start a return, go to your Order History, find the item you want to return, and click "Request Return". Follow the guided process to print your return label.',
      link: '/returns'
    },
    {
      category: 'account',
      title: 'How do I reset my password?',
      content: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a secure link to reset your password.',
      link: null
    },
    {
      category: 'account',
      title: 'How do I update my profile information?',
      content: 'Log into your account and go to Account Settings. You can update your personal information, shipping addresses, and preferences from there.',
      link: '/customer/preferences'
    },
    {
      category: 'artisans',
      title: 'How do I become an artisan on your platform?',
      content: 'We welcome skilled artisans to join our marketplace. Visit our "Why Become a Vendor" page to learn about requirements and the application process.',
      link: '/why-become-vendor'
    },
    {
      category: 'artisans',
      title: 'What commission do you charge artisans?',
      content: 'We charge a competitive commission rate that varies based on product category and sales volume. Contact our artisan relations team for detailed pricing information.',
      link: '/contact'
    }
  ]

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Start Chat',
      primary: true
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us your questions anytime',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      link: 'mailto:support@artisanmarket.com'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri, 9AM-5PM EST',
      action: 'Call Now',
      link: 'tel:+1-800-ARTISAN'
    }
  ]

  const filteredTopics = selectedCategory === 'all' 
    ? popularTopics 
    : popularTopics.filter(topic => topic.category === selectedCategory)

  const searchFilteredTopics = filteredTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              How can we
              <span className="text-amber-600 block">help you today?</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find answers to your questions, get support, and learn how to make the most of your ArtisanMarket experience.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-white">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular Topics */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center">
              {selectedCategory === 'all' ? 'Popular Topics' : `${categories.find(c => c.id === selectedCategory)?.name} Help`}
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Find quick answers to the most common questions'}
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {searchFilteredTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {topic.content}
                  </p>
                  {topic.link && (
                    <Link to={topic.link}>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </Link>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {searchFilteredTopics.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse our categories above.
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our friendly support team is here to help you with any questions or concerns.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className={`h-full text-center ${method.primary ? 'ring-2 ring-amber-500' : ''}`}>
                  <Card.Content>
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      method.primary ? 'bg-amber-600' : 'bg-amber-100'
                    }`}>
                      <method.icon className={`w-6 h-6 ${method.primary ? 'text-white' : 'text-amber-600'}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {method.description}
                    </p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {method.availability}
                    </div>
                    {method.link ? (
                      <a href={method.link}>
                        <Button 
                          variant={method.primary ? 'primary' : 'outline'} 
                          className="w-full"
                        >
                          {method.action}
                        </Button>
                      </a>
                    ) : (
                      <Button 
                        variant={method.primary ? 'primary' : 'outline'} 
                        className="w-full"
                      >
                        {method.action}
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Quick Links
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Access our most popular help pages and resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shipping">
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  Shipping Info
                </Button>
              </Link>
              <Link to="/returns">
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  Returns Policy
                </Button>
              </Link>
              <Link to="/faq">
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  FAQ
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-amber-600"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default HelpCenter
