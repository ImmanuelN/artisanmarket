import { motion } from 'framer-motion'
import {
  ArrowUturnLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const Returns = () => {
  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and go to Order History. Find the item you want to return and click "Request Return".',
      icon: DocumentTextIcon
    },
    {
      step: 2,
      title: 'Select Reason',
      description: 'Choose the reason for your return and provide any additional details about the item condition.',
      icon: CheckCircleIcon
    },
    {
      step: 3,
      title: 'Print Label',
      description: 'We\'ll email you a prepaid return shipping label. Print it and attach it to your package.',
      icon: DocumentTextIcon
    },
    {
      step: 4,
      title: 'Ship Item',
      description: 'Package the item securely and drop it off at any authorized shipping location.',
      icon: ArrowUturnLeftIcon
    },
    {
      step: 5,
      title: 'Get Refund',
      description: 'Once we receive and inspect your return, we\'ll process your refund within 3-5 business days.',
      icon: CurrencyDollarIcon
    }
  ]

  const returnReasons = [
    {
      reason: 'Defective or Damaged',
      eligible: true,
      timeframe: '30 days',
      refundType: 'Full refund + return shipping',
      description: 'Item arrived damaged or has manufacturing defects'
    },
    {
      reason: 'Not as Described',
      eligible: true,
      timeframe: '30 days',
      refundType: 'Full refund + return shipping',
      description: 'Item significantly different from listing description'
    },
    {
      reason: 'Wrong Item Received',
      eligible: true,
      timeframe: '30 days',
      refundType: 'Full refund + return shipping',
      description: 'You received a different item than what was ordered'
    },
    {
      reason: 'Changed Mind',
      eligible: true,
      timeframe: '15 days',
      refundType: 'Refund minus return shipping',
      description: 'Item no longer needed or wanted (must be unused)'
    },
    {
      reason: 'Size/Fit Issues',
      eligible: true,
      timeframe: '30 days',
      refundType: 'Exchange or refund minus return shipping',
      description: 'Item doesn\'t fit as expected (clothing, jewelry, etc.)'
    }
  ]

  const nonReturnableItems = [
    'Custom or personalized items made specifically for you',
    'Perishable goods (food, candles, cosmetics with short shelf life)',
    'Digital downloads or digital products',
    'Items damaged by normal wear and tear',
    'Items returned after the return window has expired',
    'Items without original tags or in unsellable condition'
  ]

  const refundMethods = [
    {
      method: 'Original Payment Method',
      timeframe: '3-5 business days',
      description: 'Refund will be credited back to your original payment method',
      preferred: true
    },
    {
      method: 'Store Credit',
      timeframe: 'Instant',
      description: 'Receive store credit immediately for future purchases',
      bonus: '+5% bonus credit'
    },
    {
      method: 'Exchange',
      timeframe: '2-3 business days processing',
      description: 'Exchange for a different size, color, or similar item'
    }
  ]

  const tips = [
    {
      title: 'Keep Original Packaging',
      content: 'Return items in their original packaging when possible. This helps ensure safe transport and faster processing.'
    },
    {
      title: 'Document Condition',
      content: 'Take photos of damaged items before returning. This helps us improve our artisan partners and expedite your refund.'
    },
    {
      title: 'Check Artisan Policies',
      content: 'Some artisans may have specific return policies for custom work. These will be clearly stated on the product page.'
    },
    {
      title: 'International Returns',
      content: 'International customers are responsible for return shipping costs unless the item was defective or not as described.'
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
                <ArrowUturnLeftIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Returns &
              <span className="text-amber-600 block">Refund Policy</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We want you to love your handcrafted purchases. If you're not completely satisfied, 
              we offer a generous return policy to ensure your peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/orders">
                <Button size="lg" className="shadow-lg">
                  Start a Return
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Track Return Status
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Return Window */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">30-Day Return Window</h2>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                You have 30 days from the delivery date to return most items. For items where you've simply 
                changed your mind, you have 15 days. Custom or personalized items may have different policies.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span>Free returns for defective or misdescribed items</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span>Easy online return process</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span>Multiple refund options available</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Satisfaction Guarantee
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We stand behind the quality of every artisan item in our marketplace. 
                  If you're not happy with your purchase, we'll make it right.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How to Return an Item
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our return process is designed to be simple and hassle-free.
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid md:grid-cols-5 gap-8">
              {returnProcess.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card hover className="text-center h-full">
                    <Card.Content>
                      <div className="relative mb-4">
                        <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mx-auto">
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-600">{step.step}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </Card.Content>
                  </Card>
                  
                  {/* Connector line */}
                  {index < returnProcess.length - 1 && (
                    <div className="hidden md:block absolute top-6 -right-4 w-8 h-0.5 bg-amber-200" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Return Reasons */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Return Eligibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different return reasons have different policies and timeframes.
            </p>
          </motion.div>

          <div className="space-y-4">
            {returnReasons.map((reason, index) => (
              <motion.div
                key={reason.reason}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <Card.Content>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          reason.eligible ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {reason.eligible ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {reason.reason}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {reason.timeframe}
                        </div>
                        <div className="text-xs text-gray-600">
                          {reason.refundType}
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

      {/* Non-Returnable Items */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Items We Can't Accept</h2>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                For health, safety, and quality reasons, some items cannot be returned. 
                These restrictions are clearly marked on product pages.
              </p>
              
              <ul className="space-y-3">
                {nonReturnableItems.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <XCircleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Refund Options</h3>
              
              <div className="space-y-4">
                {refundMethods.map((method) => (
                  <Card key={method.method} className={method.preferred ? 'ring-2 ring-amber-500' : ''}>
                    <Card.Content>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {method.method}
                        </h4>
                        {method.preferred && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                        {method.bonus && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {method.bonus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {method.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Processing time: {method.timeframe}
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Tips & Best Practices */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Return Tips & Best Practices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these tips to ensure a smooth return process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <Card.Content>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {tip.content}
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
              Need Help with a Return?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our customer service team is here to help you through the return process 
              and answer any questions you may have.
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

export default Returns
