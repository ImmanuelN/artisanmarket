import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ScaleIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
  const lastUpdated = "August 1, 2025"

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing or using ArtisanMarket, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.'
        },
        {
          subtitle: 'Legal Capacity',
          text: 'You must be at least 18 years old or have parental consent to use our platform. By using ArtisanMarket, you represent that you have the legal capacity to enter into this agreement.'
        },
        {
          subtitle: 'Updates to Terms',
          text: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Your continued use constitutes acceptance of any updates.'
        }
      ]
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: UserGroupIcon,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'You must provide accurate, current, and complete information when creating your account. You are responsible for maintaining the confidentiality of your account credentials.'
        },
        {
          subtitle: 'Account Responsibility',
          text: 'You are fully responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any security breaches.'
        },
        {
          subtitle: 'Account Suspension',
          text: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to our platform or users.'
        },
        {
          subtitle: 'Account Deletion',
          text: 'You may delete your account at any time through account settings. Some information may be retained for legal or business purposes after account deletion.'
        }
      ]
    },
    {
      id: 'marketplace',
      title: 'Marketplace Rules',
      icon: ScaleIcon,
      content: [
        {
          subtitle: 'Buyer Responsibilities',
          text: 'Buyers must provide accurate shipping information, make payments promptly, and communicate respectfully with artisans. You are responsible for understanding return and refund policies before purchasing.'
        },
        {
          subtitle: 'Seller Responsibilities',
          text: 'Artisans must accurately describe their products, fulfill orders promptly, provide quality items as described, and maintain professional communication with buyers.'
        },
        {
          subtitle: 'Prohibited Items',
          text: 'Users may not sell illegal items, counterfeit goods, items that infringe intellectual property, hazardous materials, or items that violate our community guidelines.'
        },
        {
          subtitle: 'Content Standards',
          text: 'All product listings, reviews, and communications must be truthful, respectful, and comply with applicable laws. We reserve the right to remove content that violates our standards.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Fees',
      icon: CurrencyDollarIcon,
      content: [
        {
          subtitle: 'Payment Processing',
          text: 'All payments are processed through our secure payment system. We accept major credit cards, PayPal, and other approved payment methods. Payments are held in escrow until order completion.'
        },
        {
          subtitle: 'Platform Fees',
          text: 'ArtisanMarket charges a commission on completed sales. Fee structures vary by product category and are clearly disclosed to sellers before listing items.'
        },
        {
          subtitle: 'Taxes',
          text: 'Users are responsible for determining and paying applicable taxes on their transactions. Sellers must comply with all tax obligations in their jurisdiction.'
        },
        {
          subtitle: 'Refunds & Disputes',
          text: 'Refund policies are set by individual artisans within our guidelines. Our dispute resolution process helps resolve payment and order issues fairly between parties.'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: TruckIcon,
      content: [
        {
          subtitle: 'Shipping Responsibility',
          text: 'Artisans are responsible for packaging and shipping items securely and promptly. Buyers provide accurate shipping addresses and are responsible for any shipping-related costs.'
        },
        {
          subtitle: 'Delivery Timeframes',
          text: 'Delivery times are estimates provided by artisans and shipping carriers. ArtisanMarket is not responsible for shipping delays beyond our control.'
        },
        {
          subtitle: 'International Shipping',
          text: 'International orders may be subject to customs duties, taxes, and regulations of the destination country. Buyers are responsible for any additional fees.'
        },
        {
          subtitle: 'Lost or Damaged Items',
          text: 'Issues with lost or damaged shipments should be reported immediately. We work with artisans and buyers to resolve shipping problems fairly.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Platform Content',
          text: 'ArtisanMarket owns all rights to our platform design, code, trademarks, and content. Users may not copy, modify, or distribute our proprietary content without permission.'
        },
        {
          subtitle: 'User Content',
          text: 'You retain ownership of content you upload but grant us a license to use, display, and distribute it on our platform. You represent that you have rights to all content you upload.'
        },
        {
          subtitle: 'Copyright Protection',
          text: 'We respect intellectual property rights and respond to valid copyright infringement notices. Users must not upload content that infringes others\' intellectual property.'
        },
        {
          subtitle: 'Trademark Policy',
          text: 'Users may not use others\' trademarks without permission or in ways that could cause confusion. We investigate trademark violation reports and take appropriate action.'
        }
      ]
    },
    {
      id: 'prohibited-conduct',
      title: 'Prohibited Conduct',
      icon: ExclamationTriangleIcon,
      content: [
        {
          subtitle: 'Fraudulent Activity',
          text: 'Users may not engage in fraud, misrepresentation, identity theft, or any deceptive practices. This includes fake reviews, counterfeit items, or payment fraud.'
        },
        {
          subtitle: 'Platform Abuse',
          text: 'Users may not attempt to hack, spam, or disrupt our platform. This includes automated scraping, creating multiple accounts to evade restrictions, or circumventing security measures.'
        },
        {
          subtitle: 'Harassment & Abuse',
          text: 'We do not tolerate harassment, threats, hate speech, or abusive behavior toward other users. All communications must be respectful and professional.'
        },
        {
          subtitle: 'Legal Violations',
          text: 'Users must comply with all applicable laws and regulations. Illegal activities of any kind are strictly prohibited and will result in account termination and legal action.'
        }
      ]
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers & Limitations',
      icon: ClockIcon,
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain platform availability but do not guarantee uninterrupted service. We may temporarily suspend service for maintenance, updates, or unforeseen issues.'
        },
        {
          subtitle: 'Third-Party Content',
          text: 'ArtisanMarket is a marketplace platform. We do not manufacture, inspect, or guarantee the quality of items sold by artisans. Transactions are between buyers and sellers.'
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from platform use.'
        },
        {
          subtitle: 'Warranty Disclaimer',
          text: 'The platform is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.'
        }
      ]
    }
  ]

  const governingLaw = {
    jurisdiction: 'New York',
    country: 'United States',
    disputeResolution: 'binding arbitration'
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
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Terms of
              <span className="text-amber-600 block">Service</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              These terms govern your use of ArtisanMarket and establish the rights and responsibilities 
              of all users, buyers, and artisans on our platform.
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

      {/* Quick Overview */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Key Points
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fair Marketplace</h3>
                  <p className="text-sm text-gray-600">
                    Our terms ensure fair treatment and protection for both buyers and artisan sellers.
                  </p>
                </Card.Content>
              </Card>

              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ScaleIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Clear Rules</h3>
                  <p className="text-sm text-gray-600">
                    Transparent guidelines for buying, selling, and using our marketplace platform.
                  </p>
                </Card.Content>
              </Card>

              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Protected Transactions</h3>
                  <p className="text-sm text-gray-600">
                    Secure payment processing and dispute resolution to protect all parties.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Detailed Sections */}
      {sections.map((section, sectionIndex) => (
        <section key={section.id} className={`py-16 ${sectionIndex % 2 === 0 ? '' : 'bg-white'}`}>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, index) => (
                  <Card key={index}>
                    <Card.Content>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.text}
                      </p>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
      ))}

      {/* Governing Law */}
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
                Governing Law & Disputes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <Card.Content>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Applicable Law
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These terms are governed by the laws of {governingLaw.jurisdiction}, {governingLaw.country}, 
                    without regard to conflict of law principles.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Any legal action or proceeding arising under these terms will be brought exclusively 
                    in the courts of {governingLaw.jurisdiction}.
                  </p>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Dispute Resolution
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We encourage users to resolve disputes through our internal resolution process first. 
                    Most issues can be resolved quickly through direct communication.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    For disputes that cannot be resolved internally, parties agree to {governingLaw.disputeResolution} 
                    under the rules of the American Arbitration Association.
                  </p>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Severability & Contact */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-amber-50 border-amber-200">
              <Card.Content>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Severability
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      If any provision of these terms is found to be unenforceable or invalid, 
                      the remaining provisions will continue in full force and effect.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Contact for Legal Matters
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>Email: <a href="mailto:legal@artisanmarket.com" className="text-amber-600 hover:text-amber-700">legal@artisanmarket.com</a></p>
                      <p>Address: 123 Marketplace Ave</p>
                      <p>Creative District, NY 10001</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
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
              Questions About Our Terms?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our support team can help clarify any questions about these terms of service 
              and how they apply to your use of ArtisanMarket.
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

export default TermsOfService
