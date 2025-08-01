import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'
import Stripe from 'stripe'
import mongoose from 'mongoose'
import './models/Review.js';
import './models/Order.js';

// Load environment variables FIRST
dotenv.config()

// Import configurations AFTER loading env vars
import connectDB from './config/database.js'
import { connectRedis } from './config/redis.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import vendorRoutes from './routes/vendorRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import vendorBankRoutes from './routes/vendorBankRoutes.js'
import bankRoutes from './routes/bankRoutes.js'
import vendorBalanceRoutes from './routes/vendorBalanceRoutes.js'
import customerBalanceRoutes from './routes/customerBalanceRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import mockApiRoutes from './routes/mockApi.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

// Connect to databases
connectDB()
connectRedis()

// Initialize Plaid configuration
console.log('🔗 Initializing Plaid configuration...')
console.log('📋 Plaid Environment:', process.env.PLAID_ENV || 'sandbox (default)')
console.log('🔑 Plaid Client ID:', process.env.PLAID_CLIENT_ID ? '✓ Loaded' : '❌ Missing')
console.log('🔐 Plaid Secret:', process.env.PLAID_SECRET ? '✓ Loaded' : '❌ Missing')
console.log('📝 Credential Status:', process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET ? '✅ Both credentials available' : '⚠️ Missing credentials - using test mode')

let plaidClient = null
let plaidStatus = '❌ Failed'
try {
  const plaidConfig = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || 'test_client_id',
        'PLAID-SECRET': process.env.PLAID_SECRET || 'test_secret',
      },
    },
  })
  
  plaidClient = new PlaidApi(plaidConfig)
  console.log('✅ Plaid client initialized successfully')
  
  // Test Plaid connection with a simple API call
  if (process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET) {
    try {
      // This is a lightweight test to verify credentials
      await plaidClient.institutionsGet({
        count: 1,
        offset: 0
      })
      console.log('✅ Plaid API connection test successful')
      plaidStatus = '✅ Connected'
    } catch (error) {
      console.warn('⚠️ Plaid API connection test failed:', error.message)
      console.log('📝 This is normal if using test credentials or in development mode')
      plaidStatus = '⚠️ Test Mode'
    }
  } else {
    console.log('📝 Using test credentials - Plaid API calls will be limited')
    plaidStatus = '📝 Test Mode'
  }
} catch (error) {
  console.error('❌ Failed to initialize Plaid client:', error.message)
  console.log('📝 Continuing without Plaid functionality...')
  plaidStatus = '❌ Failed'
}

// Initialize Stripe configuration
console.log('💳 Initializing Stripe configuration...')
console.log('📋 Stripe Environment:', process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'Live' : 'Test')
console.log('🔑 Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? '✓ Loaded' : '❌ Missing')
console.log('🔑 Stripe Publishable Key:', process.env.STRIPE_PUBLISHABLE_KEY ? '✓ Loaded' : '❌ Missing')
console.log('🔑 Stripe Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET ? '✓ Loaded' : '❌ Missing')
console.log('📝 Credential Status:', process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Both keys available' : '⚠️ Missing keys - using test mode')

let stripeClient = null
let stripeStatus = '❌ Failed'
try {
  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
  })
  console.log('✅ Stripe client initialized successfully')
  
  // Test Stripe connection with a simple API call
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    try {
      // This is a lightweight test to verify credentials
      await stripeClient.paymentMethods.list({
        limit: 1
      })
      console.log('✅ Stripe API connection test successful')
      stripeStatus = '✅ Connected'
    } catch (error) {
      console.warn('⚠️ Stripe API connection test failed:', error.message)
      console.log('📝 This is normal if using test credentials or in development mode')
      stripeStatus = '⚠️ Test Mode'
    }
  } else {
    console.log('📝 Using test credentials - Stripe API calls will be limited')
    stripeStatus = '📝 Test Mode'
  }
} catch (error) {
  console.error('❌ Failed to initialize Stripe client:', error.message)
  console.log('📝 Continuing without Stripe functionality...')
  stripeStatus = '❌ Failed'
}

// Create Express app
const app = express()
const server = createServer(app)



// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5172",
    methods: ["GET", "POST"]
  }
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
  crossOriginEmbedderPolicy: false
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5172",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Raw body parsing for webhooks (must be before JSON parsing)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// API routes
app.use('/api/auth', authRoutes) // Use real auth routes with MongoDB
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/vendor-bank', vendorBankRoutes)
app.use('/api/bank', bankRoutes)
app.use('/api/vendor-balance', vendorBalanceRoutes)
app.use('/api/customer-balance', customerBalanceRoutes)
app.use('/api/customers', customerRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join vendor room for real-time notifications
  socket.on('join-vendor-room', (vendorId) => {
    socket.join(`vendor-${vendorId}`)
    console.log(`Vendor ${vendorId} joined room`)
  })

  // Handle order updates
  socket.on('order-update', (orderData) => {
    socket.to(`vendor-${orderData.vendorId}`).emit('new-order', orderData)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log('')
  console.log('🎉 ArtisanMarket Server Started Successfully!')
  console.log('=' * 50)
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
  console.log('')
  console.log('📋 Service Status:')
  console.log(`   🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`)
  console.log(`   🔴 Redis: ${process.env.NODE_ENV === 'development' && !process.env.REDIS_URL ? '📝 Disabled (dev mode)' : '✅ Connected'}`)
  console.log(`   💳 Plaid: ${plaidStatus}`)
  console.log(`   💳 Stripe: ${stripeStatus}`)
  console.log(`   🔌 Socket.IO: ✅ Ready`)
  console.log('')
  console.log('✨ Ready to handle requests!')
  console.log('=' * 50)
})

export { io, plaidClient, stripeClient }
