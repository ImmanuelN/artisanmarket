import express from 'express'

const router = express.Router()

// Placeholder routes for file uploads
router.post('/image', (req, res) => {
  res.json({
    success: true,
    message: 'Image upload endpoint - coming soon'
  })
})

export default router
