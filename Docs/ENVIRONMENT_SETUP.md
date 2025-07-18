# Environment Configuration Guide

This guide explains how to set up environment variables for the ArtisanMarket project.

## Quick Setup

1. **Server Environment**:
   ```bash
   cp .env.example .env
   ```

2. **Client Environment**:
   ```bash
   cd client
   cp .env.example .env
   ```

3. Update the values in both `.env` files with your actual credentials.

## Required Services

### 1. Database Services

#### MongoDB
- **Local**: Use `mongodb://localhost:27017/artisanmarket`
- **Cloud**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas) and get connection string

#### Redis
- **Local**: Use `redis://localhost:6379`
- **Cloud**: Use [Redis Cloud](https://redis.com/redis-enterprise-cloud/) or [Upstash](https://upstash.com/)

### 2. Payment Processing

#### Stripe
1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from the Developers section
3. Set up webhook endpoints for payment events

### 3. File Storage

#### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from your dashboard
3. Create upload presets for unsigned uploads

### 4. Email Service

#### SMTP Configuration
- **Gmail**: Use App Passwords (not your regular password)
- **SendGrid**: Professional email service
- **Mailgun**: Alternative email service
- **Nodemailer**: Supports various SMTP providers

## Environment Files Structure

```
artisanmarket/
├── .env                 # Server environment variables
├── .env.example         # Server environment template
└── client/
    ├── .env             # Client environment variables
    └── .env.example     # Client environment template
```

## Security Best Practices

### ✅ Do's
- Use strong, unique passwords and secrets
- Rotate API keys and secrets regularly
- Use environment-specific values (dev/staging/prod)
- Keep `.env` files out of version control
- Use secrets management in production

### ❌ Don'ts
- Never commit real credentials to Git
- Don't share credentials in plain text
- Don't use weak or default passwords
- Don't put sensitive data in client environment variables

## Development vs Production

### Development
```bash
NODE_ENV=development
JWT_SECRET=development-secret-key
MONGODB_URI=mongodb://localhost:27017/artisanmarket
```

### Production
```bash
NODE_ENV=production
JWT_SECRET=your-super-strong-production-secret-min-32-chars
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/artisanmarket
```

## Validation

The application will validate environment variables on startup. Missing required variables will cause the server to exit with error messages.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running locally
   - Verify connection string format
   - Check network connectivity for cloud databases

2. **Redis Connection Failed**
   - Redis is optional in development
   - Check if Redis server is running
   - Verify Redis URL format

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set and consistent
   - Check token expiration settings

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check upload preset configuration
   - Ensure file size limits are appropriate

5. **Email Not Sending**
   - Verify SMTP credentials
   - Check if less secure apps are enabled (Gmail)
   - Test with email service provider's test credentials

## Environment Variables Reference

### Server (.env)
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `development` |
| `PORT` | No | Server port | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string | - |
| `JWT_SECRET` | Yes | JWT signing secret | - |
| `REDIS_URL` | No | Redis connection string | - |
| `STRIPE_SECRET_KEY` | Yes* | Stripe secret key | - |
| `CLOUDINARY_*` | Yes* | Cloudinary credentials | - |

*Required for full functionality

### Client (client/.env)
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes* | Stripe publishable key | - |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes* | Cloudinary cloud name | - |

*Required for full functionality

## Support

If you encounter issues with environment configuration:

1. Check the console for specific error messages
2. Verify all required variables are set
3. Test connections to external services
4. Refer to service provider documentation
5. Check application logs for detailed error information

For development support, create an issue in the project repository with:
- Error messages
- Environment details (without sensitive data)
- Steps to reproduce the issue
