import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()

// Mock user database
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@artisanmarket.com',
    password: '$2a$10$9xtJQDQrzKhK1.ZNZVWl1.aWPr8/O7O5KqI8zPo8Cy6JrMZAa8F7e', // password: demo123
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Vendor Demo',
    email: 'vendor@artisanmarket.com',
    password: '$2a$10$9xtJQDQrzKhK1.ZNZVWl1.aWPr8/O7O5KqI8zPo8Cy6JrMZAa8F7e', // password: demo123
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  }
]

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    res.json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body

    // Check if user exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    }

    users.push(newUser)

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user route
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    const user = users.find(u => u.id === decoded.userId)
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router
