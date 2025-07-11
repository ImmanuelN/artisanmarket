import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  UserGroupIcon,
  SparklesIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { Container, Card, Button } from '../components/ui'

const About = () => {
  const values = [
    {
      icon: HeartIcon,
      title: 'Passion for Craftsmanship',
      description: 'We believe in the power of handmade goods and the stories they tell. Every piece in our marketplace represents hours of dedication and skill.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Guaranteed',
      description: 'We carefully vet every artisan and product to ensure you receive only the finest handcrafted items that will last for generations.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Community',
      description: 'Connect with talented artisans from around the world and discover unique pieces that reflect diverse cultures and traditions.'
    },
    {
      icon: UserGroupIcon,
      title: 'Supporting Creators',
      description: 'Every purchase directly supports independent artisans and small businesses, helping preserve traditional crafts and techniques.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Verified Artisans' },
    { number: '50K+', label: 'Unique Products' },
    { number: '95%', label: 'Customer Satisfaction' }
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former art curator with a passion for connecting artists with collectors worldwide.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Artisan Relations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Traveled to 40+ countries discovering and building relationships with local artisans.'
    },
    {
      name: 'Elena Volkov',
      role: 'Quality Assurance Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Master craftsperson with 20 years of experience in traditional European techniques.'
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
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Celebrating the Art of
              <span className="text-amber-600 block">Handmade Excellence</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              ArtisanMarket is more than a marketplace—it's a celebration of human creativity, 
              connecting passionate artisans with discerning customers who value authenticity, 
              quality, and the stories behind each handcrafted piece.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-lg">
                <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
                Explore Artisans
              </Button>
              <Button variant="outline" size="lg">
                Our Story
              </Button>
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

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every decision we make is guided by our commitment to artisans, customers, 
              and the preservation of traditional craftsmanship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <Card.Content>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <value.icon className="w-6 h-6 text-amber-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
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

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to connecting the world with exceptional artisan craftsmanship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="text-center">
                  <Card.Content>
                    <div className="mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-amber-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
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
              Join Our Artisan Community
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Whether you're an artisan looking to showcase your work or a customer 
              seeking unique handcrafted pieces, we'd love to have you join our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-50"
              >
                Become an Artisan
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber-600"
              >
                Start Shopping
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default About
