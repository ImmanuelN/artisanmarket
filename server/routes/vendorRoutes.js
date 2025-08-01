import express from 'express'
import Vendor from '../models/Vendor.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Simple JWT auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

// GET /profile - get vendor profile for current user
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId
    const vendor = await Vendor.findOne({ user: userId })
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    }
    res.json({ success: true, profile: vendor })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// PUT /profile - update or create vendor profile for current user
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId
    let vendor = await Vendor.findOne({ user: userId })
    if (!vendor) {
      // Create new vendor profile
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      vendor = new Vendor({ user: userId, contact: { email: user.email }, ...req.body })
    } else {
      // Update only the fields provided in req.body
      if (req.body.storeName !== undefined) vendor.storeName = req.body.storeName;
      if (req.body.slogan !== undefined) vendor.slogan = req.body.slogan;
      if (req.body.storeDescription !== undefined) vendor.storeDescription = req.body.storeDescription;
      if (req.body.logo !== undefined) vendor.logo = req.body.logo;
      if (req.body.banner !== undefined) vendor.banner = req.body.banner;
      if (req.body.contact) {
        if (req.body.contact.email !== undefined) vendor.contact.email = req.body.contact.email;
        if (req.body.contact.phone !== undefined) vendor.contact.phone = req.body.contact.phone;
        if (req.body.contact.website !== undefined) vendor.contact.website = req.body.contact.website;
      }
      if (req.body.business && req.body.business.address && req.body.business.address.city !== undefined) {
        vendor.business = vendor.business || {};
        vendor.business.address = vendor.business.address || {};
        vendor.business.address.city = req.body.business.address.city;
      }
      // Handle nested contact updates
      if (req.body.phone !== undefined) {
        vendor.contact = vendor.contact || {};
        vendor.contact.phone = req.body.phone;
      }
      if (req.body.website !== undefined) {
        vendor.contact = vendor.contact || {};
        vendor.contact.website = req.body.website;
      }
      if (req.body.location !== undefined) {
        vendor.business = vendor.business || {};
        vendor.business.address = vendor.business.address || {};
        vendor.business.address.city = req.body.location;
      }
      if (req.body.bio !== undefined) vendor.bio = req.body.bio;
    }
    
    await vendor.save()
    
    // Check if this is the first time saving a complete profile (onboarding)
    const user = await User.findById(userId)
    if (user && !user.onboardingComplete && vendor.storeName && vendor.storeName.trim() !== '' && vendor.storeDescription) {
      user.onboardingComplete = true
      await user.save()
    }
    
    res.json({ success: true, profile: vendor })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /complete-onboarding - mark onboarding as complete
router.post('/complete-onboarding', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Check if vendor profile exists and has required fields
    const vendor = await Vendor.findOne({ user: userId })
    if (!vendor || !vendor.storeName || vendor.storeName.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please complete your store profile with a store name before finishing onboarding' 
      })
    }
    
    user.onboardingComplete = true
    await user.save()
    
    res.json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingComplete: user.onboardingComplete
      }
    })
  } catch (err) {
    console.error('Complete onboarding error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET /stats - get stats for current vendor
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const vendor = await Vendor.findOne({ user: userId });
    if (!vendor) {
      return res.json({ success: true, stats: {} });
    }
    // Return metrics if available
    res.json({ success: true, stats: vendor.metrics || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /orders - get orders for current vendor (basic implementation)
router.get('/orders', requireAuth, async (req, res) => {
  try {
    // If you have an Order model, fetch orders for this vendor
    // For now, return empty array if not implemented
    res.json({ success: true, orders: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Public GET /public/:vendorId - get vendor profile by vendor ID
router.get('/public/:vendorId', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId)
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' })
    }
    res.json({ success: true, profile: vendor })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
