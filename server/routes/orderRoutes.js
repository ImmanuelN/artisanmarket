import express from 'express'

const router = express.Router()

// Placeholder routes for orders
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Orders endpoint - coming soon'
  })
})

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create order endpoint - coming soon'
  })
})

export default router
