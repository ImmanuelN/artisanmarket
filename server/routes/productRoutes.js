import express from 'express'
import Product from '../models/Product.js'
import { getCache, setCache, deleteCache } from '../config/redis.js'
import { requireAuth } from '../middleware/authMiddleware.js'; // Assuming auth middleware exists
import { io } from '../server.js'; // Import Socket.IO instance

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
    // Add vendor filter
    if (req.query.vendor) {
      query.vendor = req.query.vendor;
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
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
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

// Helper function to get and emit updated products for a vendor
const emitVendorProducts = async (vendorId) => {
  try {
    const products = await Product.find({ vendor: vendorId });
    io.to(`vendor-${vendorId}`).emit('products-updated', products);
  } catch (error) {
    console.error('Error emitting vendor products:', error);
  }
};

// Create a new product
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, price, categories, tags, images, inventory } = req.body;
    const vendorId = req.user.vendorId;

    if (!vendorId) {
      return res.status(403).json({ success: false, message: "User is not a vendor." });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      categories: categories.map(c => c.toLowerCase().replace(/\s+/g, '-')),
      tags,
      images,
      inventory,
      vendor: vendorId,
      status: 'active',
    });

    await newProduct.save();
    
    // Invalidate cache and emit update
    const cacheKey = `products:{"status":"active","isDeleted":false,"vendor":"${vendorId}"}:1:12:createdAt:desc`;
    await deleteCache(cacheKey);
    emitVendorProducts(vendorId);

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Example: Update a product (add more routes as needed)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Emit update
    emitVendorProducts(product.vendor.toString());
    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Example: Delete a product
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    // Emit update
    emitVendorProducts(product.vendor.toString());
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router
