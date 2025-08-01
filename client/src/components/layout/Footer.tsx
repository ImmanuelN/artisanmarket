import { Link } from 'react-router-dom'
import { 
  ShoppingBag, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-brown-800 text-white ">
      <div className="container-custom">
        <div className="py-12 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-rust-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ArtisanMarket</span>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting artisans with customers worldwide. Discover unique, 
                handcrafted products from talented creators around the globe.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-rust-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-rust-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-rust-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-rust-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/why-become-vendor" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Why Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Become a Vendor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-300 hover:text-rust-400 transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-rust-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-rust-400" />
                  <span className="text-gray-300">support@artisanmarket.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-rust-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-rust-400" />
                  <span className="text-gray-300">123 Artisan St, Creative City, CC 12345</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 ArtisanMarket. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-rust-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-rust-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-rust-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
