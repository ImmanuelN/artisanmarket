# 🏦 Demo Banking System Setup Guide

## Overview
This guide explains how to set up and use the **demo in-database banking system** for ArtisanMarket. This system replaces Stripe/Plaid with a fully custom banking simulation that includes encryption, vendor balances, and payout functionality.

## 🚀 **Quick Start**

### 1. **Generate Encryption Key**
First, generate a secure encryption key for the banking system:

```bash
# Generate a 32-character hex encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Add Environment Variables**
Add to your `.env` file in the server directory:

```env
# Demo Banking System
BANK_ENCRYPTION_KEY=your_generated_32_character_hex_key_here

# Example:
# BANK_ENCRYPTION_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### 3. **Start the Server**
```bash
cd server
npm run dev
```

### 4. **Test the System**
1. Navigate to `/vendor-bank-test` in your browser
2. Connect a bank account using demo data
3. Add earnings and test payouts

## 🏗️ **System Architecture**

### **Database Models**
- **BankAccount**: Stores encrypted bank/card info
- **VendorBalance**: Tracks vendor financials and payouts

### **API Endpoints**
- **POST /api/bank/connect**: Connect bank account
- **GET /api/bank/account**: Get bank account info
- **PUT /api/bank/account**: Update bank account
- **DELETE /api/bank/account**: Delete bank account
- **GET /api/vendor-balance/balance**: Get vendor balance
- **POST /api/vendor-balance/payout**: Request payout
- **POST /api/vendor-balance/add-earnings**: Add demo earnings

### **Security Features**
- **AES-256 Encryption**: All sensitive data encrypted
- **Card Validation**: Luhn algorithm for card numbers
- **Input Validation**: Comprehensive form validation
- **Masked Display**: Sensitive data masked in UI

## 🧪 **Testing the System**

### **Demo Bank Account Data**
Use these test values for connecting a bank account:

```
Cardholder Name: John Doe
Card Number: 4111111111111111 (Visa test number)
Expiry Month: 12
Expiry Year: 2025
CVV: 123
Bank Name: Demo Bank
```

### **Testing Flow**
1. **Connect Bank Account**: Fill out the form with demo data
2. **Add Earnings**: Use the "Add Demo Earnings" feature
3. **Request Payout**: Test the payout functionality
4. **View Balance**: Check the financial summary

## 🔒 **Security Implementation**

### **Encryption**
- **Algorithm**: AES-256-CBC
- **Key Management**: Environment variable
- **IV**: Random for each encryption
- **Format**: `iv:encryptedData`

### **Data Protection**
- **Card Numbers**: Encrypted before storage
- **CVV**: Encrypted before storage
- **Expiry Dates**: Encrypted before storage
- **Display**: Masked in UI (e.g., `**** **** **** 1234`)

### **Validation**
- **Card Numbers**: Luhn algorithm validation
- **Expiry Dates**: Future date validation
- **CVV**: 3-4 digit validation
- **Input Sanitization**: XSS protection

## 💰 **Vendor Balance System**

### **Balance Types**
- **Available Balance**: Ready for payout
- **Pending Balance**: Held for processing
- **Total Earnings**: All-time earnings
- **Total Payouts**: All-time payouts

### **Payout Process**
1. **Validation**: Check minimum amount and available balance
2. **Processing**: Simulate bank transfer
3. **Update**: Deduct from available, add to total payouts
4. **Confirmation**: Return success response

### **Demo Features**
- **Add Earnings**: Simulate sales income
- **Payout History**: Track previous payouts
- **Minimum Payout**: Configurable minimum amount
- **Commission Rate**: Platform fee calculation

## 🖥️ **Frontend Components**

### **BankAccountSetup**
- **Form Validation**: Real-time error checking
- **Secure Input**: Masked sensitive fields
- **Status Display**: Connected/disconnected states
- **Update/Delete**: Account management

### **FinancialSummary**
- **Balance Display**: Multiple balance types
- **Payout Request**: Amount validation
- **Demo Controls**: Add earnings for testing
- **History Display**: Payout tracking

## 🔧 **API Reference**

### **Connect Bank Account**
```http
POST /api/bank/connect
Content-Type: application/json
Authorization: Bearer <token>

{
  "cardHolderName": "John Doe",
  "cardNumber": "4111111111111111",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123",
  "bankName": "Demo Bank",
  "type": "vendor"
}
```

### **Get Bank Account**
```http
GET /api/bank/account
Authorization: Bearer <token>
```

### **Request Payout**
```http
POST /api/vendor-balance/payout
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 100.00,
  "description": "Monthly payout"
}
```

### **Add Demo Earnings**
```http
POST /api/vendor-balance/add-earnings
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 50.00,
  "description": "Demo sale"
}
```

## 🚨 **Error Handling**

### **Common Errors**
- **Invalid Card Number**: Luhn algorithm failed
- **Expired Card**: Date validation failed
- **Insufficient Balance**: Payout amount too high
- **No Bank Account**: Account not connected
- **Encryption Error**: Key configuration issue

### **Error Responses**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

## 🔄 **Integration with Existing System**

### **Vendor Dashboard**
- **Bank Tab**: Integrated bank account management
- **Financial Tab**: Balance and payout management
- **Real-time Updates**: Balance changes reflected immediately

### **Order Processing**
- **Commission Calculation**: Automatic fee deduction
- **Balance Updates**: Earnings added to vendor balance
- **Payout Eligibility**: Balance requirements for payouts

## 📊 **Monitoring & Logging**

### **Server Logs**
- **Bank Account Operations**: Connect, update, delete
- **Payout Processing**: Success/failure tracking
- **Encryption Events**: Key validation and errors
- **Balance Changes**: Earnings and payouts

### **Security Events**
- **Failed Validations**: Invalid card data attempts
- **Encryption Errors**: Key or algorithm issues
- **Unauthorized Access**: Invalid token attempts

## 🚀 **Production Considerations**

### **Security Enhancements**
- **Key Rotation**: Regular encryption key updates
- **Audit Logging**: Comprehensive transaction logs
- **Rate Limiting**: API request throttling
- **Input Validation**: Enhanced sanitization

### **Scalability**
- **Database Indexing**: Optimized queries
- **Caching**: Redis for balance data
- **Queue Processing**: Background payout processing
- **Monitoring**: Performance metrics

### **Compliance**
- **PCI DSS**: Payment card data standards
- **GDPR**: Data protection regulations
- **Audit Trails**: Complete transaction history
- **Data Retention**: Secure data lifecycle

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Encryption Key Error**
```
❌ BANK_ENCRYPTION_KEY must be exactly 32 characters long
```
**Solution**: Generate a new 32-character hex key

#### **2. Bank Account Not Found**
```
❌ Bank account not found
```
**Solution**: Check if user has connected a bank account

#### **3. Insufficient Balance**
```
❌ Insufficient available balance for this payout amount
```
**Solution**: Add earnings or reduce payout amount

#### **4. Validation Errors**
```
❌ Invalid card number
```
**Solution**: Use valid test card numbers (4111111111111111)

### **Debug Commands**
```bash
# Check encryption key
echo $BANK_ENCRYPTION_KEY | wc -c

# Test encryption
node -e "
const crypto = require('crypto');
const key = process.env.BANK_ENCRYPTION_KEY;
console.log('Key length:', key ? key.length : 'undefined');
console.log('Key valid:', /^[0-9a-fA-F]{64}$/.test(key));
"
```

## 📝 **Next Steps**

### **Immediate**
1. **Test the System**: Use demo data to verify functionality
2. **Customize UI**: Adjust styling and branding
3. **Add Validation**: Enhance input validation rules
4. **Error Handling**: Improve error messages

### **Future Enhancements**
1. **Real Banking Integration**: Connect to actual banks
2. **Automated Payouts**: Scheduled payout processing
3. **Multi-Currency**: Support different currencies
4. **Advanced Analytics**: Financial reporting and insights
5. **Webhook Integration**: Real-time notifications
6. **Mobile App**: Native mobile banking features

## 🔗 **Resources**

- **AES Encryption**: [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- **Card Validation**: [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)
- **Security Best Practices**: [OWASP Guidelines](https://owasp.org/)
- **PCI Compliance**: [PCI DSS Standards](https://www.pcisecuritystandards.org/)

---

**🎉 Your demo banking system is now ready! Test it out and let me know if you need any adjustments.** 