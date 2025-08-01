import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CogIcon,
  EyeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const CookiePolicy = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const lastUpdated = "August 1, 2025"

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Strictly Necessary Cookies',
      icon: ShieldCheckIcon,
      description: 'Required for the website to function properly',
      purpose: 'These cookies are essential for our website to work. They enable core functionality such as security, network management, and accessibility.',
      examples: [
        'Authentication cookies to keep you logged in',
        'Security cookies to prevent fraudulent activity',
        'Load balancing cookies to ensure website performance',
        'Cookie consent preferences'
      ],
      retention: 'Session or up to 1 year',
      canDisable: false,
      color: 'red'
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: CogIcon,
      description: 'Enhance your experience and remember your preferences',
      purpose: 'These cookies allow our website to remember choices you make and provide enhanced features and personal content.',
      examples: [
        'Language and region preferences',
        'Shopping cart contents',
        'Display preferences (dark/light mode)',
        'Recently viewed products'
      ],
      retention: 'Up to 2 years',
      canDisable: true,
      color: 'blue'
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: ChartBarIcon,
      description: 'Help us understand how you use our website',
      purpose: 'These cookies collect information about how visitors use our website to help us improve its performance and user experience.',
      examples: [
        'Google Analytics for website usage statistics',
        'Page view and session duration tracking',
        'Popular content and feature usage',
        'Error reporting and debugging information'
      ],
      retention: 'Up to 2 years',
      canDisable: true,
      color: 'green'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: EyeIcon,
      description: 'Used to deliver relevant advertisements',
      purpose: 'These cookies are used to make advertising messages more relevant to you and track the effectiveness of our marketing campaigns.',
      examples: [
        'Social media advertising pixels',
        'Retargeting and remarketing cookies',
        'Affiliate tracking cookies',
        'Email marketing effectiveness tracking'
      ],
      retention: 'Up to 1 year',
      canDisable: true,
      color: 'purple'
    }
  ]

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: 'Website analytics and performance monitoring',
      privacy: 'https://policies.google.com/privacy',
      optOut: 'https://tools.google.com/dlpage/gaoptout'
    },
    {
      name: 'Facebook Pixel',
      purpose: 'Social media advertising and conversion tracking',
      privacy: 'https://www.facebook.com/privacy/explanation',
      optOut: 'https://www.facebook.com/settings?tab=ads'
    },
    {
      name: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      privacy: 'https://stripe.com/privacy',
      optOut: 'Required for payment processing'
    },
    {
      name: 'Intercom',
      purpose: 'Customer support chat functionality',
      privacy: 'https://www.intercom.com/terms-and-policies#privacy',
      optOut: 'Can be disabled in chat settings'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600'
  }

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
                <ComputerDesktopIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Cookie
              <span className="text-amber-600 block">Policy</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              This policy explains how ArtisanMarket uses cookies and similar technologies 
              to enhance your browsing experience and improve our services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-xl px-6 py-3 text-sm text-gray-600">
                <strong>Last Updated:</strong> {lastUpdated}
              </div>
              <div className="bg-white rounded-xl px-6 py-3 text-sm text-gray-600">
                <strong>Effective Date:</strong> {lastUpdated}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* What Are Cookies */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What Are Cookies?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <Card.Content>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <ComputerDesktopIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">Definition</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cookies are small text files stored on your device when you visit a website. 
                    They help websites remember your preferences and provide a better user experience.
                  </p>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">How They Work</h3>
                  <p className="text-gray-600 leading-relaxed">
                    When you visit our website, we may place cookies on your device to remember your 
                    settings, track your interactions, and improve our services over time.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Types of Cookies */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Types of Cookies We Use
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <Card.Content>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(cookie.color)}`}>
                            <cookie.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{cookie.title}</h3>
                            <p className="text-sm text-gray-500">{cookie.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {cookie.canDisable ? (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              Optional
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedSection(expandedSection === cookie.id ? null : cookie.id)}
                        className="w-full text-left mb-4"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {cookie.purpose}
                        </p>
                        <div className="mt-2 text-sm text-amber-600 hover:text-amber-700">
                          {expandedSection === cookie.id ? 'Show Less' : 'Show More'}
                        </div>
                      </button>

                      {expandedSection === cookie.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {cookie.examples.map((example, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              <strong>Retention:</strong> {cookie.retention}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Third-Party Services */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <GlobeAltIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Third-Party Services
              </h2>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              We use several third-party services that may place their own cookies on your device. 
              Here are the main services we use and links to their privacy policies:
            </p>

            <div className="space-y-4">
              {thirdPartyServices.map((service, index) => (
                <Card key={index}>
                  <Card.Content>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-gray-600 text-sm">{service.purpose}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={service.privacy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 text-center"
                        >
                          Privacy Policy
                        </a>
                        {service.optOut !== 'Required for payment processing' && service.optOut !== 'Can be disabled in chat settings' ? (
                          <a
                            href={service.optOut}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 text-center"
                          >
                            Opt Out
                          </a>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded text-center">
                            {service.optOut}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Managing Cookies */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <CogIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Managing Your Cookie Preferences
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <Card.Content>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">Browser Settings</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>View and delete existing cookies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Block cookies from specific websites</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Block third-party cookies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Clear cookies when you close your browser</span>
                    </li>
                  </ul>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <CogIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cookie Preferences</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You can also manage your cookie preferences directly on our website:
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // This would open a cookie preferences modal in a real implementation
                        alert('Cookie preferences would open here')
                      }}
                    >
                      Manage Cookie Preferences
                    </Button>
                    <p className="text-xs text-gray-500">
                      Note: Disabling certain cookies may affect website functionality
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-amber-50 border-amber-200">
              <Card.Content>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Important Information
                    </h3>
                    <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                      <p>
                        <strong>Essential Cookies:</strong> Some cookies are essential for our website to function. 
                        These cannot be disabled as they are necessary for basic website operations like security and authentication.
                      </p>
                      <p>
                        <strong>Impact of Disabling Cookies:</strong> Blocking or deleting certain cookies may impact 
                        your experience on our website, including the ability to stay logged in or remember your preferences.
                      </p>
                      <p>
                        <strong>Updates to This Policy:</strong> We may update this cookie policy from time to time. 
                        Any changes will be posted on this page with an updated effective date.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions About Cookies?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              If you have questions about our use of cookies or this policy, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:privacy@artisanmarket.com">
                <Button variant="outline">
                  Email Privacy Team
                </Button>
              </a>
              <Link to="/privacy">
                <Button variant="outline">
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Continue Browsing with Confidence
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Now that you understand how we use cookies, continue exploring our marketplace 
              of handcrafted artisan products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-50"
                >
                  Start Shopping
                </Button>
              </Link>
              <Link to="/help">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-amber-600"
                >
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default CookiePolicy
