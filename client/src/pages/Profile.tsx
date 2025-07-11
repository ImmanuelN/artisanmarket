import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  PhoneIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  PencilIcon,
  CameraIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button, Input, Badge } from '../components/ui'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate collector of handcrafted items and supporter of independent artisans. Love discovering unique pieces that tell a story.',
    memberSince: '2023',
    favoriteCategories: ['Jewelry', 'Pottery', 'Textiles']
  })

  const stats = [
    { label: 'Orders', value: '24', icon: ShoppingBagIcon },
    { label: 'Favorites', value: '156', icon: HeartIcon },
    { label: 'Reviews', value: '18', icon: StarIcon },
    { label: 'Member Since', value: '2023', icon: CalendarIcon }
  ]

  const recentOrders = [
    {
      id: '1234',
      date: '2024-01-15',
      artisan: 'Maya Pottery Studio',
      item: 'Handcrafted Ceramic Vase',
      status: 'Delivered',
      total: '$89.99',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
    },
    {
      id: '1235',
      date: '2024-01-10',
      artisan: 'Silver Moon Jewelry',
      item: 'Sterling Silver Necklace',
      status: 'Shipped',
      total: '$124.50',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop'
    },
    {
      id: '1236',
      date: '2024-01-05',
      artisan: 'Woodland Crafts',
      item: 'Wooden Cutting Board Set',
      status: 'Processing',
      total: '$67.00',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
    }
  ]

  const favoriteItems = [
    {
      id: '1',
      name: 'Bohemian Tapestry',
      artisan: 'Textile Dreams',
      price: '$156.00',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Hand-blown Glass Bowl',
      artisan: 'Crystal Arts',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Leather Journal',
      artisan: 'BookCraft Co',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Handle save logic here
    console.log('Profile updated:', profileData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Container className="py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Content>
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-12 h-12 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                      <CameraIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-600">Member since {profileData.memberSince}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card.Content>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <Card key={stat.label}>
                      <Card.Content>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </div>
                          <stat.icon className="w-8 h-8 text-amber-600" />
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </div>

                {/* Profile Information */}
                <Card>
                  <Card.Header>
                    <div className="flex justify-between items-center">
                      <Card.Title>Profile Information</Card.Title>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        {isEditing ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <Input
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <p className="text-gray-900">{profileData.email}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        {isEditing ? (
                          <Input
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center">
                            <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <p className="text-gray-900">{profileData.phone}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        {isEditing ? (
                          <Input
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <p className="text-gray-900">{profileData.location}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.bio}</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favorite Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.favoriteCategories.map((category) => (
                          <Badge key={category} variant="info">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <Card.Header>
                    <Card.Title>Recent Orders</Card.Title>
                    <Card.Description>
                      Track your recent purchases and order history
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={order.image}
                            alt={order.item}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {order.item}
                            </h3>
                            <p className="text-sm text-gray-600">by {order.artisan}</p>
                            <p className="text-sm text-gray-500">Order #{order.id} • {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{order.total}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <Card.Header>
                    <Card.Title>Favorite Items</Card.Title>
                    <Card.Description>
                      Items you've saved for later
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteItems.map((item) => (
                        <Card key={item.id} hover>
                          <Card.Content>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">by {item.artisan}</p>
                            <p className="text-lg font-semibold text-amber-600">{item.price}</p>
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <Card.Header>
                    <Card.Title>Account Settings</Card.Title>
                    <Card.Description>
                      Manage your account preferences and privacy settings
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive updates about your orders and new products</p>
                        </div>
                        <button className="bg-amber-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                          <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Marketing Communications</h3>
                          <p className="text-sm text-gray-600">Receive promotional emails and special offers</p>
                        </div>
                        <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                          <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                      </div>

                      <div className="pt-4">
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Profile
