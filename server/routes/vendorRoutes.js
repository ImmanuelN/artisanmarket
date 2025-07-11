import express from 'express'

const router = express.Router()

// Placeholder routes for vendors
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Vendor dashboard endpoint - coming soon'
  })
})

router.get('/products', (req, res) => {
  res.json({
    success: true,
    message: 'Vendor products endpoint - coming soon'
  })
})

export default router
