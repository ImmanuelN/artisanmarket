import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, StarIcon, HeartIcon, ShoppingBagIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const categories = [
    {
      name: 'Ceramics',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      count: 150
    },
    {
      name: 'Leather Goods',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      count: 89
    },
    {
      name: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      count: 234
    },
    {
      name: 'Textiles',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop',
      count: 178
    }
  ]

  const stats = [
    { label: 'Active Vendors', value: '2,500+', icon: UserGroupIcon },
    { label: 'Products', value: '25,000+', icon: ShoppingBagIcon },
    { label: 'Countries', value: '50+', icon: GlobeAltIcon },
    { label: 'Happy Customers', value: '100,000+', icon: StarIcon }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rust-50 to-cream-100 py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover Unique
                <span className="text-rust-500"> Artisan </span>
                Products
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with talented artisans from around the world. 
                Find one-of-a-kind, handcrafted items that tell a story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-primary flex items-center justify-center">
                  Shop Now
                  <ChevronRightIcon className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/register" className="btn-secondary flex items-center justify-center">
                  Become a Vendor
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
                alt="Artisan crafting"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-rust-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-rust-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular artisan creations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {product.vendorName}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-rust-500">${product.price}</span>
                      <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore our diverse collection of artisan crafts
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <Link to={`/shop?category=${category.name.toLowerCase()}`}>
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} items</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-rust-500">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Artisan Journey?
            </h2>
            <p className="text-xl text-rust-100 mb-8 max-w-2xl mx-auto">
              Join thousands of artisans who are sharing their craft with the world. 
              Set up your shop today and reach customers globally.
            </p>
            <Link to="/register" className="btn-secondary bg-white text-rust-500 hover:bg-gray-100">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
