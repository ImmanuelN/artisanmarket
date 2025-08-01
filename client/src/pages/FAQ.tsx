import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  UserCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const categories = [
    { id: 'all', name: 'All Questions', icon: QuestionMarkCircleIcon },
    { id: 'ordering', name: 'Ordering', icon: ShoppingBagIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'returns', name: 'Returns', icon: ShieldCheckIcon },
    { id: 'account', name: 'Account', icon: UserCircleIcon },
    { id: 'artisans', name: 'For Artisans', icon: HeartIcon },
    { id: 'international', name: 'International', icon: GlobeAltIcon }
  ]

  const faqs = [
    // Ordering Questions
    {
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'Browse our marketplace, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in, provide shipping information, and complete payment. You\'ll receive an order confirmation email immediately after purchase.'
    },
    {
      category: 'ordering',
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'You can cancel or modify your order within 2 hours of placing it by contacting customer service. After this window, the artisan may have already started working on your item, making changes difficult or impossible.'
    },
    {
      category: 'ordering',
      question: 'What if an item is out of stock?',
      answer: 'If an item becomes unavailable after you order, we\'ll contact you immediately with options: wait for restock, choose a similar item, or receive a full refund. Most artisans can provide estimated restock times.'
    },
    {
      category: 'ordering',
      question: 'Can I order custom or personalized items?',
      answer: 'Many of our artisans offer customization services. Look for "Custom Options" on product pages. Custom items typically take longer to create and may have different return policies due to their personalized nature.'
    },
    {
      category: 'ordering',
      question: 'Do you have bulk ordering discounts?',
      answer: 'Some artisans offer quantity discounts for bulk orders. Contact the artisan directly through their shop page or our customer service team can help coordinate bulk purchases and potential discounts.'
    },

    // Shipping Questions
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by location and method chosen. Standard shipping takes 5-10 business days, Express takes 2-3 days, and Overnight takes 1-2 days. International shipping ranges from 7-28 days depending on destination.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track all your orders by logging into your account and visiting the Order History page.'
    },
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'We offer free standard shipping on orders over $75 within the continental US. Some individual artisans may offer free shipping promotions on their items as well.'
    },
    {
      category: 'shipping',
      question: 'What if my package is lost or damaged?',
      answer: 'All shipments are insured. If your package is lost or arrives damaged, contact us within 48 hours with photos (if damaged). We\'ll file a claim and arrange a replacement or full refund.'
    },
    {
      category: 'shipping',
      question: 'Can I change my shipping address?',
      answer: 'You can change your shipping address within 2 hours of placing your order. After that, contact customer service immediately - we may be able to redirect the package depending on shipping status.'
    },

    // Payment Questions
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted connections.'
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption and PCI-compliant payment processors. We never store your complete credit card information on our servers - all payment data is securely handled by our payment partners.'
    },
    {
      category: 'payments',
      question: 'When is my card charged?',
      answer: 'Your payment method is charged immediately when you place your order. For pre-order or custom items with longer lead times, we may authorize the amount first and charge when the item ships.'
    },
    {
      category: 'payments',
      question: 'Can I use multiple payment methods for one order?',
      answer: 'Currently, we only accept one payment method per order. However, you can use gift cards or store credit in combination with another payment method to cover the full order amount.'
    },
    {
      category: 'payments',
      question: 'Do you offer payment plans or financing?',
      answer: 'For orders over $500, we offer financing options through our partner services. You can see available payment plans at checkout for eligible orders. Interest rates and terms vary by plan.'
    },

    // Returns Questions
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return window for most items, and 15 days for change-of-mind returns. Items must be in original condition. Custom or personalized items may have different return policies set by individual artisans.'
    },
    {
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'Log into your account, go to Order History, find the item, and click "Request Return." Select your reason, print the prepaid return label we email you, and ship the item back. We\'ll process your refund once received.'
    },
    {
      category: 'returns',
      question: 'Who pays for return shipping?',
      answer: 'For defective, damaged, or incorrectly described items, we provide free return shipping. For change-of-mind returns, return shipping costs are deducted from your refund unless you choose store credit.'
    },
    {
      category: 'returns',
      question: 'How long do refunds take?',
      answer: 'Once we receive and inspect your return, refunds are processed within 3-5 business days. The time for funds to appear in your account depends on your bank or payment provider, typically 3-7 additional days.'
    },
    {
      category: 'returns',
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Yes! When initiating a return, you can choose to exchange for a different size, color, or similar item from the same artisan. Exchanges are processed like returns - we\'ll send the new item once we receive the original.'
    },

    // Account Questions
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top right corner, enter your email and create a password. You can also sign up using your Google, Facebook, or Apple account for faster registration.'
    },
    {
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a secure link to reset your password. The link expires after 24 hours for security.'
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Log into your account and click on "Account Settings" or your profile picture. You can update your personal information, shipping addresses, payment methods, and communication preferences.'
    },
    {
      category: 'account',
      question: 'Can I have multiple shipping addresses?',
      answer: 'Yes! You can save multiple shipping addresses in your account settings. During checkout, you can choose which address to use or add a new one for that specific order.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Contact our customer service team to request account deletion. We\'ll permanently remove your personal information while keeping order history for legal and tax purposes. This action cannot be undone.'
    },

    // Artisan Questions
    {
      category: 'artisans',
      question: 'How do I become an artisan seller?',
      answer: 'Visit our "Why Become a Vendor" page and click "Apply Now." You\'ll need to provide information about your craft, upload portfolio images, and complete our verification process. Approval typically takes 5-7 business days.'
    },
    {
      category: 'artisans',
      question: 'What are the fees for selling?',
      answer: 'We charge a competitive commission rate that varies by product category (typically 8-15%). There are no monthly fees or listing fees. You only pay when you make a sale. Volume discounts are available for high-volume sellers.'
    },
    {
      category: 'artisans',
      question: 'How do I get paid as an artisan?',
      answer: 'Payments are processed weekly via direct deposit, PayPal, or check. Funds are held for 7-14 days after delivery to allow for any return windows, then automatically transferred to your preferred payment method.'
    },
    {
      category: 'artisans',
      question: 'Can I set my own prices?',
      answer: 'Yes, artisans have full control over their pricing. We provide market insights and pricing guidance to help you stay competitive while ensuring fair compensation for your craft and time.'
    },
    {
      category: 'artisans',
      question: 'What support do you provide to artisans?',
      answer: 'We offer photography tips, marketing support, craft business workshops, and dedicated artisan support team. Plus, we handle all payment processing, customer service, and shipping logistics so you can focus on creating.'
    },

    // International Questions
    {
      category: 'international',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. Some items may have shipping restrictions due to size, materials, or local regulations.'
    },
    {
      category: 'international',
      question: 'What about customs and duties?',
      answer: 'International customers are responsible for any customs duties, taxes, or import fees charged by their country. These charges are not included in our shipping costs and vary by country and item value.'
    },
    {
      category: 'international',
      question: 'How long does international shipping take?',
      answer: 'International shipping typically takes 7-28 business days depending on the destination country and shipping method chosen. Express international options are available for some countries.'
    },
    {
      category: 'international',
      question: 'Can I return items internationally?',
      answer: 'Yes, but international customers are responsible for return shipping costs unless the item was defective or not as described. We recommend contacting us first to ensure the return is necessary.'
    },
    {
      category: 'international',
      question: 'What currencies do you accept?',
      answer: 'We display prices in USD, but accept payments in most major currencies. Your bank or payment provider will handle currency conversion at current exchange rates.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const popularFAQs = [
    'How do I track my order?',
    'What is your return policy?',
    'How long does shipping take?',
    'What payment methods do you accept?',
    'How do I become an artisan seller?',
    'Do you ship internationally?'
  ]

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
              Frequently Asked
              <span className="text-amber-600 block">Questions</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find quick answers to the most common questions about shopping on ArtisanMarket, 
              shipping, returns, and more.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Popular Questions */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="py-8 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Popular Questions
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {popularFAQs.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(question)}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Category Tabs */}
      <section className="py-8 bg-white border-t">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setExpandedFAQ(null)
                }}
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

      {/* FAQ List */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {selectedCategory === 'all' 
                ? (searchQuery ? `Search Results (${filteredFAQs.length})` : 'All Questions')
                : `${categories.find(c => c.id === selectedCategory)?.name} Questions (${filteredFAQs.length})`
              }
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {expandedFAQ === index ? (
                          <ChevronUpIcon className="w-5 h-5 text-amber-600" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
                <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                  View All Questions
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Can't find what you're looking for? Our friendly support team is here to help 
              with any questions about your ArtisanMarket experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/help">
                <Button size="lg" className="shadow-lg">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Send us a Message
                </Button>
              </Link>
            </div>
          </motion.div>
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
              Helpful Resources
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Explore our other help pages for detailed information.
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
              <Link to="/why-become-vendor">
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  Become an Artisan
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-amber-600"
                >
                  About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default FAQ
