import express from 'express'

const router = express.Router()

// Placeholder routes for admin
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard endpoint - coming soon'
  })
})

router.get('/vendors', (req, res) => {
  res.json({
    success: true,
    message: 'Admin vendors endpoint - coming soon'
  })
})

export default router
