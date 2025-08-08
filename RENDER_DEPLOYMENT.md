# 🚀 Render Deployment Guide for ArtisanMarket

## Prerequisites
1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **MongoDB Atlas**: Set up a production MongoDB database
3. **Render Account**: Sign up at [render.com](https://render.com)

## Step-by-Step Deployment

### Option 1: Using render.yaml (Recommended)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**
   In the Render dashboard, add these environment variables:
   
   **Required:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
   - `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
   - `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `PLAID_CLIENT_ID`: Your Plaid client ID
   - `PLAID_SECRET`: Your Plaid secret key

   **Optional:**
   - `REDIS_URL`: If using Redis for caching
   - `STRIPE_WEBHOOK_SECRET`: For Stripe webhooks
   - `SMTP_*`: Email configuration variables

### Option 2: Manual Web Service Creation

1. **Create Web Service**
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `artisanmarket`

2. **Configure Service**
   - **Name**: `artisanmarket-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server` (if your server code is in a subfolder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add all the variables listed in Option 1

4. **Advanced Settings**
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: Enable (deploys automatically on git push)

## Post-Deployment Setup

### 1. Update Frontend Configuration
If deploying frontend separately, update your client's API URL:
```javascript
// In your frontend .env or config
VITE_API_URL=https://your-render-service-name.onrender.com
```

### 2. Database Setup
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Render's IP ranges
- Test database connection from Render logs

### 3. Domain Configuration (Optional)
- Custom Domain: Add your domain in Render dashboard
- SSL: Automatically handled by Render

### 4. Monitoring
- **Logs**: Check Render dashboard for deployment and runtime logs
- **Health Check**: Your service has a `/health` endpoint
- **Keep-Alive**: Automatically configured to prevent sleeping

## Important Notes

### Security
- Never commit `.env` files with real credentials
- Use Render's environment variables for all secrets
- JWT secrets are auto-generated securely

### Performance
- **Free Tier**: Services may sleep after 15 minutes of inactivity
- **Paid Tiers**: Always-on services with better performance
- **Keep-Alive Service**: Helps prevent sleeping on free tier

### Scaling
- Start with free tier for testing
- Upgrade to Starter ($7/month) for production
- Monitor usage and scale as needed

## Troubleshooting

### Common Issues
1. **Build Failures**: Check package.json dependencies
2. **Database Connection**: Verify MongoDB Atlas IP whitelist
3. **Environment Variables**: Ensure all required vars are set
4. **CORS Errors**: Check CLIENT_URL and CORS_ORIGINS settings

### Useful Commands
```bash
# Check deployment logs
# (Available in Render dashboard)

# Test health endpoint
curl https://your-service.onrender.com/health

# Test API endpoint
curl https://your-service.onrender.com/api/health
```

## Next Steps
1. Deploy and test your API
2. Update frontend to use production API URL
3. Set up monitoring and alerts
4. Consider upgrading to paid tier for production use
5. Set up CI/CD for automated deployments

## Support
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Keep-Alive Service**: Built-in to prevent service sleeping
