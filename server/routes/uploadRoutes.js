import express from 'express';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

// Ensure dotenv is configured right at the start
dotenv.config();

const router = express.Router();

// --- More Detailed Debug Logging ---
console.log('--- Checking ImageKit Environment Variables (uploadRoutes.js) ---');
console.log('IMAGEKIT_PUBLIC_KEY:', process.env.IMAGEKIT_PUBLIC_KEY ? 'Loaded' : 'MISSING');
console.log('IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY ? 'Loaded' : 'MISSING');
console.log('IMAGEKIT_URL_ENDPOINT:', process.env.IMAGEKIT_URL_ENDPOINT ? 'Loaded' : 'MISSING');
console.log('-------------------------------------------');

let imagekit;
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  try {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log("ImageKit SDK initialized successfully.");
  } catch (error) {
    console.error("CRITICAL: Failed to initialize ImageKit SDK:", error.message);
    imagekit = null;
  }
} else {
  console.error("CRITICAL: One or more ImageKit environment variables are missing.");
  imagekit = null;
}

// Endpoint to get ImageKit authentication parameters
router.post('/imagekit-auth', (req, res) => {
  if (!imagekit) {
    console.error("Authentication endpoint called, but ImageKit SDK is not initialized.");
    return res.status(500).json({ message: "ImageKit SDK not initialized. Check server logs." });
  }
  try {
    const authParams = imagekit.getAuthenticationParameters();
    console.log("Successfully generated ImageKit auth params:", authParams);
    res.json(authParams);
  } catch (error) {
    console.error("Error getting ImageKit auth params:", error);
    res.status(500).json({ message: "Could not get authentication parameters." });
  }
});

export default router;
