import express from 'express'

const router = express.Router()

// Placeholder routes for payments
router.post('/create-payment-intent', (req, res) => {
  res.json({
    success: true,
    message: 'Payment intent endpoint - coming soon'
  })
})

router.post('/webhook', (req, res) => {
  res.json({
    success: true,
    message: 'Payment webhook endpoint - coming soon'
  })
})

export default router
