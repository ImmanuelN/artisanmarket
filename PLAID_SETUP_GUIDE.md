# Plaid Setup Guide

## Overview
This guide explains how to set up Plaid credentials for the vendor bank account functionality.

## 🔧 Setup Options

### Option 1: Development Mode (Recommended for Testing)
The application now includes a development mode that provides mock responses when Plaid credentials are not configured. This allows you to test the frontend functionality without setting up real Plaid credentials.

**Features:**
- Mock link token generation
- Simulated bank account setup
- Mock payout functionality
- No real Plaid API calls

**How to use:**
1. Start the server without Plaid credentials
2. The system will automatically use mock responses
3. Test the full bank account setup flow
4. All data is stored locally in your database

### Option 2: Real Plaid Integration (Production)

#### Step 1: Create Plaid Account
1. Go to [Plaid Dashboard](https://dashboard.plaid.com/)
2. Sign up for a free account
3. Navigate to the "Keys" section

#### Step 2: Get Credentials
1. Copy your `Client ID`
2. Copy your `Sandbox Secret` (for testing)
3. Copy your `Development Secret` (for development)

#### Step 3: Environment Variables
Add to your `.env` file in the server directory:

```env
# Plaid Configuration
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox

# For development environment
# PLAID_ENV=development
# PLAID_SECRET=your_development_secret_here
```

#### Step 4: Test the Integration
1. Restart your server
2. Check the console logs for Plaid initialization status
3. Test the bank account setup flow

## 🧪 Testing

### Development Mode Testing
```bash
# Start server without Plaid credentials
npm run dev

# The system will show:
# 📝 Using test credentials - Plaid API calls will be limited
# 📝 Development mode: Providing mock Plaid link token
```

### Real Plaid Testing
```bash
# Set up environment variables
export PLAID_CLIENT_ID=your_client_id
export PLAID_SECRET=your_sandbox_secret
export PLAID_ENV=sandbox

# Start server
npm run dev

# The system will show:
# ✅ Plaid client initialized successfully
# ✅ Plaid API connection test successful
```

## 🔒 Security Notes

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Use sandbox environment** for testing
4. **Rotate secrets** regularly in production

## 🐛 Troubleshooting

### Common Issues

#### 1. "invalid client_id or secret provided"
- Check that your credentials are correct
- Ensure you're using the right environment (sandbox vs development)
- Verify the credentials are properly set in environment variables

#### 2. "Plaid integration is not configured"
- This is expected in development mode without credentials
- The system will provide mock responses automatically

#### 3. "Request failed with status code 400"
- Check Plaid API documentation for request format
- Verify all required fields are included
- Ensure you're using the correct API version

## 📝 Next Steps

1. **For Development**: Use the mock mode to test functionality
2. **For Production**: Set up real Plaid credentials
3. **For Testing**: Use Plaid's sandbox environment
4. **For Live**: Use Plaid's development environment with real bank accounts

## 🔗 Resources

- [Plaid Documentation](https://plaid.com/docs/)
- [Plaid Dashboard](https://dashboard.plaid.com/)
- [Plaid Sandbox Testing](https://plaid.com/docs/sandbox/)
- [Plaid Link React](https://github.com/plaid/react-plaid-link) 