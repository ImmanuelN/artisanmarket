# ArtisanMarket - Multi-Vendor E-Commerce Platform

![ArtisanMarket Logo](https://via.placeholder.com/300x100/B45309/FFFFFF?text=ArtisanMarket)

## 🎨 Project Overview

ArtisanMarket is a modern, scalable multi-vendor e-commerce platform that connects talented artisans with customers worldwide. Built with cutting-edge technologies including React, Node.js, MongoDB, and Docker, it provides a comprehensive solution for artisan marketplace management.

## ✨ Key Features

### 🛍️ Customer Features
- **Product Discovery**: Advanced search, filtering, and category browsing
- **Multi-Currency Support**: Shop in your preferred currency
- **Secure Payments**: Stripe and PayPal integration
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: Rate and review purchased items
- **Wishlist**: Save favorite products for later
- **PWA Support**: Mobile-first experience with offline browsing

### 🏪 Vendor Features
- **Store Management**: Complete vendor dashboard
- **Product Management**: Easy product listing with multiple images
- **Inventory Tracking**: Real-time stock management
- **Analytics**: Sales reports and performance metrics
- **Order Management**: Process and track orders
- **Commission Tracking**: Transparent earnings reporting

### 🔧 Admin Features
- **Vendor Approval**: Review and approve new vendors
- **Site Analytics**: Comprehensive platform metrics
- **Commission Management**: Configure commission rates
- **Content Management**: Manage categories and site content
- **User Management**: Monitor and manage users

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Vite** for build tooling
- **PWA** capabilities

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and sessions
- **Socket.IO** for real-time features
- **JWT** authentication
- **Stripe** payment processing
- **Cloudinary** for image management

### DevOps & Infrastructure
- **Docker** containerization
- **Docker Compose** for development
- **Nginx** reverse proxy
- **GitHub Actions** CI/CD
- **AWS** deployment ready

## 🏗️ Project Structure

```
artisanmarket/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route components
│   │   ├── store/              # Redux store and slices
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── assets/             # Static assets
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Node.js backend
│   ├── config/                 # Configuration files
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── utils/                  # Helper functions
│   ├── server.js               # Entry point
│   └── package.json
├── docker/                     # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── nginx.conf
├── docs/                       # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Docker** and **Docker Compose**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/artisanmarket.git
   cd artisanmarket
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   
   # Edit the .env file with your configuration
   ```

3. **Start with Docker (Recommended)**
   ```bash
   # Start all services
   docker-compose -f docker/docker-compose.yml up -d
   
   # View logs
   docker-compose -f docker/docker-compose.yml logs -f
   ```

4. **Or run locally**
   ```bash
   # Install dependencies
   cd client && npm install
   cd ../server && npm install
   
   # Start backend
   cd server && npm run dev
   
   # Start frontend (in new terminal)
   cd client && npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Development

### Available Scripts

#### Client
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Server
```bash
npm run dev          # Start with nodemon
npm start           # Start production server
npm run test        # Run tests
npm run lint        # Run ESLint
```

### API Documentation

The API follows RESTful conventions with the following main endpoints:

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Products**: `/api/products`
- **Vendors**: `/api/vendors`
- **Orders**: `/api/orders`
- **Payments**: `/api/payments`
- **Admin**: `/api/admin`

### Database Schema

#### Core Collections
- **Users**: Customer, vendor, and admin accounts
- **Products**: Artisan product listings
- **Vendors**: Vendor profiles and settings
- **Orders**: Purchase transactions
- **Reviews**: Product reviews and ratings

## 🎨 Design System

### Color Palette
- **Primary**: Rust (#B45309)
- **Secondary**: Cream (#F9D889)
- **Accent**: Deep Brown (#8B4513)
- **Neutral**: Grays for text and backgrounds

### Typography
- **Primary**: Poppins (headings)
- **Secondary**: DM Sans (body text)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configured for security
- **Helmet.js**: Security headers

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Cloudinary integration
- **Caching**: Redis for session and data caching
- **Compression**: Gzip compression enabled
- **Database Indexing**: Optimized queries

## 🌍 Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build
```

### Docker Production
```bash
# Build and run production containers
docker-compose -f docker/docker-compose.yml --profile production up -d
```

### Environment Variables
Required environment variables for production:
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_*`

## 🧪 Testing

```bash
# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run e2e tests
npm run test:e2e
```

## 📈 Monitoring & Analytics

- **Application Metrics**: Built-in health checks
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: Request timing and optimization
- **User Analytics**: Track user behavior and sales

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for placeholder images
- **Lucide React** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **Stripe** for secure payments

## 📞 Support

For support, email support@artisanmarket.com or create an issue in the GitHub repository.

---

**Built with ❤️ by NovaEdge**
