import express from 'express'
import Product from '../models/Product.js'
import { getCache, setCache } from '../config/redis.js'

const router = express.Router()

// Get all products with filtering, pagination, and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query

    // Build query
    const query = { status: 'active', isDeleted: false }
    
    if (category) {
      query.category = category
    }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }
    
    if (featured === 'true') {
      query.featured = true
    }

    // Create cache key
    const cacheKey = `products:${JSON.stringify(query)}:${page}:${limit}:${sortBy}:${sortOrder}`
    
    // Check cache
    const cachedProducts = await getCache(cacheKey)
    if (cachedProducts) {
      return res.json(cachedProducts)
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Execute query
    const products = await Product.find(query)
      .populate('vendor', 'storeName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))

    const totalProducts = await Product.countDocuments(query)
    const totalPages = Math.ceil(totalProducts / limit)

    const response = {
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }

    // Cache the response for 5 minutes
    await setCache(cacheKey, response, 300)

    res.json(response)
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'storeName storeDescription contact')
      .populate('reviews')

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Increment view count
    product.views += 1
    await product.save()

    res.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const cacheKey = 'products:featured'
    const cachedProducts = await getCache(cacheKey)
    
    if (cachedProducts) {
      return res.json(cachedProducts)
    }

    const products = await Product.find({ 
      featured: true, 
      status: 'active',
      isDeleted: false 
    })
      .populate('vendor', 'storeName')
      .sort({ 'ratings.average': -1 })
      .limit(8)

    const response = {
      success: true,
      products
    }

    // Cache for 10 minutes
    await setCache(cacheKey, response, 600)

    res.json(response)
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const cacheKey = 'categories:list'
    const cachedCategories = await getCache(cacheKey)
    
    if (cachedCategories) {
      return res.json(cachedCategories)
    }

    const categories = await Product.aggregate([
      { $match: { status: 'active', isDeleted: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const response = {
      success: true,
      categories
    }

    // Cache for 1 hour
    await setCache(cacheKey, response, 3600)

    res.json(response)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router
