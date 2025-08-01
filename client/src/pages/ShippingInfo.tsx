import { motion } from 'framer-motion'
import {
  TruckIcon,
  GlobeAltIcon,
  ClockIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const ShippingInfo = () => {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      price: '$5.99 - $12.99',
      timeframe: '5-10 business days',
      description: 'Our most economical shipping option for non-urgent deliveries.',
      features: ['Package tracking included', 'Signature not required', 'Insurance up to $100']
    },
    {
      name: 'Express Shipping',
      price: '$15.99 - $24.99',
      timeframe: '2-3 business days',
      description: 'Faster delivery for when you need your artisan items sooner.',
      features: ['Priority handling', 'Package tracking included', 'Insurance up to $500'],
      popular: true
    },
    {
      name: 'Overnight Shipping',
      price: '$29.99 - $39.99',
      timeframe: '1-2 business days',
      description: 'Get your handcrafted items delivered as quickly as possible.',
      features: ['Next-day delivery', 'Signature required', 'Full insurance coverage']
    }
  ]

  const internationalZones = [
    {
      zone: 'Zone 1 (Canada)',
      countries: ['Canada'],
      timeframe: '7-14 business days',
      startingPrice: '$12.99'
    },
    {
      zone: 'Zone 2 (Europe)',
      countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland'],
      timeframe: '10-18 business days',
      startingPrice: '$19.99'
    },
    {
      zone: 'Zone 3 (Asia Pacific)',
      countries: ['Australia', 'Japan', 'South Korea', 'Singapore', 'New Zealand'],
      timeframe: '12-21 business days',
      startingPrice: '$24.99'
    },
    {
      zone: 'Zone 4 (Rest of World)',
      countries: ['All other countries'],
      timeframe: '14-28 business days',
      startingPrice: '$29.99'
    }
  ]

  const shippingPolicies = [
    {
      title: 'Processing Time',
      content: 'Most artisan items are made to order. Processing typically takes 1-5 business days before shipping, but can vary by artisan and product complexity.'
    },
    {
      title: 'Packaging',
      content: 'All items are carefully packaged with eco-friendly materials to ensure your handcrafted items arrive in perfect condition.'
    },
    {
      title: 'Tracking',
      content: 'You\'ll receive tracking information via email once your order ships. Track your package through your account dashboard.'
    },
    {
      title: 'Delivery Attempts',
      content: 'Our carriers will attempt delivery 2-3 times. If unsuccessful, packages will be held at the nearest facility for pickup.'
    },
    {
      title: 'Shipping Restrictions',
      content: 'Some artisan items may have shipping restrictions due to size, materials, or destination country regulations.'
    },
    {
      title: 'Holiday Delays',
      content: 'Please allow extra time during peak holiday seasons. We recommend ordering early for holiday gifts.'
    }
  ]

  const faqs = [
    {
      question: 'Can I change my shipping address after ordering?',
      answer: 'You can modify your shipping address within 2 hours of placing your order. After that, contact our support team for assistance.'
    },
    {
      question: 'Do you offer free shipping?',
      answer: 'We offer free standard shipping on orders over $75 within the continental United States. Some artisan items may qualify for free shipping promotions.'
    },
    {
      question: 'What if my package is damaged during shipping?',
      answer: 'All shipments are insured. If your item arrives damaged, contact us within 48 hours with photos and we\'ll arrange a replacement or refund.'
    },
    {
      question: 'Can I ship to a P.O. Box?',
      answer: 'Standard and Express shipping can be delivered to P.O. Boxes. Overnight shipping requires a physical address for signature confirmation.'
    },
    {
      question: 'Do you ship to military addresses (APO/FPO)?',
      answer: 'Yes, we ship to APO/FPO addresses using standard shipping rates. Delivery times may vary due to military mail processing.'
    }
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
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Shipping &
              <span className="text-amber-600 block">Delivery Information</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We work with trusted shipping partners to deliver your handcrafted treasures safely and efficiently, 
              anywhere in the world.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Shipping Methods */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Domestic Shipping Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the shipping speed that works best for your needs within the United States.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className={`h-full relative ${method.popular ? 'ring-2 ring-amber-500' : ''}`}>
                  {method.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <Card.Content>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {method.name}
                      </h3>
                      <div className="text-2xl font-bold text-amber-600 mb-1">
                        {method.price}
                      </div>
                      <div className="text-gray-600 flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {method.timeframe}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-center">
                      {method.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {method.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* International Shipping */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              International Shipping
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ship handcrafted items worldwide. Shipping costs and times vary by destination.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {internationalZones.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover>
                  <Card.Content>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {zone.zone}
                        </h3>
                        <div className="text-amber-600 font-medium">
                          Starting at {zone.startingPrice}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {zone.timeframe}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Includes:</strong> {zone.countries.join(', ')}
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-amber-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">International Shipping Notes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customs duties and taxes are the responsibility of the recipient</li>
                  <li>• Some countries may have restrictions on certain artisan materials</li>
                  <li>• Delivery times may vary due to customs processing</li>
                  <li>• Tracking may be limited in some international destinations</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Shipping Policies */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shipping Policies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important information about our shipping process and policies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingPolicies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <Card.Content>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {policy.content}
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

      {/* Shipping FAQ */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shipping FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Answers to common questions about shipping and delivery.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <Card.Content>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Have More Questions?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our shipping team is here to help with any questions about delivery options or tracking your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/help">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  Visit Help Center
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-amber-600"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default ShippingInfo
