import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  UserIcon,
  DocumentTextIcon,
  CogIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  const lastUpdated = "August 1, 2025"

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: DocumentTextIcon,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you create an account, make a purchase, or contact us, we may collect personal information including your name, email address, phone number, shipping and billing addresses, and payment information.'
        },
        {
          subtitle: 'Account Information',
          text: 'We collect information you provide when creating your account, including profile details, preferences, and any information you choose to share in your public profile.'
        },
        {
          subtitle: 'Transaction Information',
          text: 'We collect details about your purchases, including items bought, payment methods used, shipping information, and communication with artisans.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use our platform, including pages viewed, search queries, time spent on pages, and interaction patterns.'
        },
        {
          subtitle: 'Device Information',
          text: 'We collect information about the device you use to access our platform, including IP address, browser type, operating system, and mobile device identifiers.'
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: CogIcon,
      content: [
        {
          subtitle: 'Provide Services',
          text: 'We use your information to process orders, facilitate communication between buyers and artisans, provide customer support, and deliver our marketplace services.'
        },
        {
          subtitle: 'Improve Experience',
          text: 'We analyze usage patterns to improve our platform, personalize your experience, recommend relevant products, and develop new features.'
        },
        {
          subtitle: 'Communications',
          text: 'We use your contact information to send order updates, shipping notifications, promotional emails (with your consent), and important service announcements.'
        },
        {
          subtitle: 'Security & Fraud Prevention',
          text: 'We use your information to verify identities, prevent fraud, protect against security threats, and ensure the safety of our platform.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with legal obligations, resolve disputes, and enforce our terms of service.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: UserIcon,
      content: [
        {
          subtitle: 'With Artisans',
          text: 'When you make a purchase, we share necessary information with the artisan (name, shipping address, order details) to fulfill your order.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We share information with trusted third-party service providers who help us operate our platform, including payment processors, shipping companies, and analytics providers.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, to respond to legal processes, protect our rights, or ensure user safety.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.'
        },
        {
          subtitle: 'With Your Consent',
          text: 'We may share information in other circumstances with your explicit consent or at your direction.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: LockClosedIcon,
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard SSL encryption to protect data in transit and encrypt sensitive information stored on our servers.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict access controls to ensure only authorized personnel can access personal information, and only when necessary for business purposes.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We regularly audit our security practices, conduct vulnerability assessments, and update our security measures to protect against new threats.'
        },
        {
          subtitle: 'Payment Security',
          text: 'We are PCI DSS compliant and use tokenization to protect payment information. We never store complete credit card numbers on our servers.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights & Choices',
      icon: EyeIcon,
      content: [
        {
          subtitle: 'Access & Correction',
          text: 'You can access and update your personal information through your account settings. Contact us if you need help accessing or correcting your data.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your personal information. Some information may be retained for legal or business purposes even after account deletion.'
        },
        {
          subtitle: 'Marketing Communications',
          text: 'You can opt out of promotional emails at any time by clicking unsubscribe links or updating your communication preferences in account settings.'
        },
        {
          subtitle: 'Cookie Management',
          text: 'You can control cookies through your browser settings. See our Cookie Policy for more details about the cookies we use.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You can request a copy of your personal information in a portable format. Contact our support team to make this request.'
        }
      ]
    },
    {
      id: 'international',
      title: 'International Transfers',
      icon: GlobeAltIcon,
      content: [
        {
          subtitle: 'Global Operations',
          text: 'ArtisanMarket operates globally and may transfer your information to countries other than where you live, including the United States where our servers are located.'
        },
        {
          subtitle: 'Adequate Protection',
          text: 'When we transfer information internationally, we ensure adequate protection through appropriate safeguards such as standard contractual clauses.'
        },
        {
          subtitle: 'GDPR Compliance',
          text: 'For users in the European Union, we comply with GDPR requirements and provide appropriate protections for international data transfers.'
        }
      ]
    }
  ]

  const contactInfo = {
    email: 'privacy@artisanmarket.com',
    address: '123 Marketplace Ave, Creative District, NY 10001',
    phone: '+1 (800) ARTISAN'
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
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Privacy
              <span className="text-amber-600 block">Policy</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data.
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
              Privacy at a Glance
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure by Design</h3>
                  <p className="text-sm text-gray-600">
                    We use industry-standard encryption and security measures to protect your data.
                  </p>
                </Card.Content>
              </Card>

              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <EyeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full Transparency</h3>
                  <p className="text-sm text-gray-600">
                    We clearly explain what data we collect, how we use it, and who we share it with.
                  </p>
                </Card.Content>
              </Card>

              <Card className="text-center">
                <Card.Content>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
                  <p className="text-sm text-gray-600">
                    You have rights to access, correct, delete, and control how your data is used.
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

      {/* Contact Information */}
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
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Contact Us About Privacy
              </h2>
            </div>

            <Card>
              <Card.Content>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  If you have questions about this privacy policy, want to exercise your rights, 
                  or have concerns about how we handle your personal information, please contact us:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-amber-600 hover:text-amber-700">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                    <a href={`tel:${contactInfo.phone}`} className="text-amber-600 hover:text-amber-700">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 text-sm">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Policy Updates */}
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
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Changes to This Policy
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We may update this privacy policy from time to time to reflect changes in our practices, 
                      technology, legal requirements, or other factors. We will notify you of any material 
                      changes by email or through a prominent notice on our platform.
                    </p>
                    <p className="text-sm text-gray-500">
                      Your continued use of ArtisanMarket after any changes indicates your acceptance of the updated policy.
                    </p>
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
              Questions About Your Privacy?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Our privacy team is here to help you understand how we protect your data 
              and exercise your privacy rights.
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
                  Contact Privacy Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default PrivacyPolicy
