import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button, Input } from '../components/ui'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: 'support@artisanmarket.com',
      description: 'Send us an email anytime'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      details: '123 Artisan Street, Creative District',
      description: 'New York, NY 10001'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Mon-Fri: 8am-5pm EST',
      description: 'Weekend support via email'
    }
  ]

  const faqs = [
    {
      question: 'How do I become a seller on ArtisanMarket?',
      answer: 'Simply create an account and apply to become a verified artisan. Our team will review your application and portfolio within 3-5 business days.'
    },
    {
      question: 'What are your shipping policies?',
      answer: 'Shipping policies vary by artisan. Most items ship within 1-3 business days, with delivery times ranging from 3-10 business days depending on location.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes! Many of our artisans offer international shipping. Shipping costs and delivery times vary by location and artisan.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Custom or personalized items may have different return policies as specified by the artisan.'
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
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions about our platform, need help with an order, or want to become an artisan? 
              We're here to help and would love to hear from you.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <Card.Content>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-amber-600 font-medium mb-1">
                      {info.details}
                    </p>
                    <p className="text-sm text-gray-600">
                      {info.description}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <Card.Header>
                  <Card.Title>Send us a Message</Card.Title>
                  <Card.Description>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="seller">Become a Seller</option>
                        <option value="partnership">Partnership</option>
                        <option value="technical">Technical Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <Card>
                <Card.Content>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive Map</p>
                      <p className="text-sm text-gray-500">123 Artisan Street, New York</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Response Time */}
              <Card>
                <Card.Content>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Quick Response
                      </h3>
                      <p className="text-gray-600 mb-2">
                        We typically respond to all inquiries within 24 hours during business days.
                      </p>
                      <p className="text-sm text-gray-500">
                        For urgent matters, please call us directly.
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <QuestionMarkCircleIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our platform and services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
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
    </div>
  )
}

export default Contact
