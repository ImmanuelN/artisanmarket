# Payment Integration Setup Guide

This guide will help you set up Stripe and Plaid payment processing for your ArtisanMarket application.

## Prerequisites

- Node.js and npm installed
- Stripe account (for card payments)
- Plaid account (for bank transfers)

## Environment Variables

Add the following environment variables to your `.env` file:

### Stripe Configuration
```env
# Stripe Keys (get these from your Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Client-side Stripe key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### Plaid Configuration
```env
# Plaid Keys (get these from your Plaid Dashboard)
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_key_here
PLAID_ENV=sandbox  # or 'development' for testing
```

## Stripe Setup

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Navigate to the Dashboard

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy your Publishable key and Secret key
   - Add them to your `.env` file

3. **Set up Webhooks**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Set the endpoint URL to: `https://your-domain.com/api/payments/webhook`
   - Select these events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.succeeded`
     - `charge.failed`
   - Copy the webhook signing secret and add it to your `.env` file

## Plaid Setup

1. **Create a Plaid Account**
   - Go to [plaid.com](https://plaid.com) and create an account
   - Navigate to the Dashboard

2. **Get API Keys**
   - Go to Team Settings → API Keys
   - Copy your Client ID and Secret
   - Add them to your `.env` file

3. **Configure Products**
   - Enable "Auth" and "Transfer" products in your Plaid dashboard
   - These are required for bank account verification and transfers

## Testing

### Stripe Test Cards
Use these test card numbers for testing:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

### Plaid Sandbox
Plaid provides sandbox credentials for testing:
- Username: `user_good`
- Password: `pass_good`

## Features Implemented

### Stripe Integration
- ✅ Payment intent creation
- ✅ Card payment processing
- ✅ Webhook handling
- ✅ Customer management
- ✅ Payment method storage

### Plaid Integration
- ✅ Link token creation
- ✅ Bank account connection
- ✅ Account information retrieval
- ✅ Bank transfer initiation
- ✅ Transfer authorization

### Frontend Components
- ✅ PaymentForm (Stripe card payments)
- ✅ BankTransferForm (Plaid bank transfers)
- ✅ Payment method selection
- ✅ Secure payment processing
- ✅ Payment status tracking

## Security Considerations

1. **Never expose secret keys in client-side code**
2. **Always validate webhook signatures**
3. **Use HTTPS in production**
4. **Implement proper error handling**
5. **Store sensitive data securely**

## Production Deployment

1. **Switch to live keys**
   - Replace test keys with live keys from Stripe and Plaid
   - Update `PLAID_ENV` to `production`

2. **Set up proper webhooks**
   - Configure webhook endpoints for your production domain
   - Test webhook delivery

3. **Monitor payments**
   - Set up logging and monitoring
   - Configure alerts for failed payments

## Troubleshooting

### Common Issues

1. **Payment fails with "Invalid API key"**
   - Check that your Stripe keys are correct
   - Ensure you're using the right environment (test vs live)

2. **Plaid link doesn't work**
   - Verify your Plaid credentials
   - Check that Auth and Transfer products are enabled

3. **Webhooks not receiving events**
   - Verify webhook endpoint URL is accessible
   - Check webhook signature verification
   - Ensure proper error handling

### Getting Help

- [Stripe Documentation](https://stripe.com/docs)
- [Plaid Documentation](https://plaid.com/docs)
- Check server logs for detailed error messages

## Next Steps

1. Test the payment flow thoroughly
2. Implement order creation after successful payment
3. Add payment status tracking
4. Set up automated refunds if needed
5. Implement vendor payout system 