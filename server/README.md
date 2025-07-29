# Coodu Trust Backend Server

This is the Node.js backend server for the Coodu Trust website, providing Razorpay payment integration and contact form functionality.

## Features

- 💳 **Razorpay Payment Integration** - Secure online donations
- 📧 **Email Notifications** - Automated donor and admin notifications
- 🗄️ **MongoDB Database** - Donation and contact form storage
- 🔐 **Security** - Rate limiting, validation, and CORS protection
- 📱 **Mobile Friendly** - UPI, cards, netbanking support

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/coodu_trust

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=noreply@coodutrust.org

# Security
JWT_SECRET=your_random_jwt_secret_here
WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows (if MongoDB is installed as service)
net start MongoDB

# For Linux/Mac
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will be running at `http://localhost:3000`

## API Endpoints

### Donations
- `POST /api/donations/create-order` - Create Razorpay order
- `POST /api/donations/verify-payment` - Verify payment signature
- `POST /api/donations/webhook` - Razorpay webhook handler
- `GET /api/donations/history/:email` - Get donation history

### Contact
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/all` - Get all contacts (admin)
- `PATCH /api/contact/:id/status` - Update contact status

### Health Check
- `GET /api/health` - Server health status

## Razorpay Setup

### 1. Create Razorpay Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Complete KYC verification

### 2. Get API Keys
1. Go to Settings → API Keys
2. Generate Key ID and Key Secret
3. Add these to your `.env` file

### 3. Configure Webhooks (Optional)
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/donations/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Add webhook secret to `.env` file

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for \"Mail\"
3. Use this app password in `EMAIL_PASS`

## Database Schema

### Donations Collection
```javascript
{
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: Number,
  donorInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    panNumber: String
  },
  status: String, // 'created', 'paid', 'failed'
  cause: String,
  donationType: String,
  createdAt: Date,
  paidAt: Date
}
```

### Contacts Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  inquiryType: String,
  status: String, // 'new', 'in-progress', 'resolved'
  createdAt: Date
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific frontend URL
- **Input Validation**: Server-side validation using express-validator
- **Helmet.js**: Security headers
- **Environment Variables**: Sensitive data in `.env` file

## Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create coodu-trust-backend

# Add MongoDB Atlas (recommended)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set RAZORPAY_KEY_ID=your_key_id
heroku config:set RAZORPAY_KEY_SECRET=your_key_secret
# ... set all other env vars

# Deploy
git push heroku main
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/coodu_trust
FRONTEND_URL=https://coodutrust.org
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - For Atlas, ensure IP whitelist is configured

2. **Razorpay Payment Failed**
   - Verify API keys in `.env`
   - Check if Razorpay account is activated
   - Ensure webhook URL is accessible

3. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP settings
   - Ensure less secure apps are allowed (if not using app password)

4. **CORS Errors**
   - Update `FRONTEND_URL` in `.env`
   - Ensure frontend is running on specified URL

### Logs
Check server logs for detailed error information:
```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs coodu-trust-backend
```

## Testing

### Test Payment Flow
1. Use Razorpay test mode keys
2. Test card numbers:
   - Success: 4111 1111 1111 1111
   - Failure: 4000 0000 0000 0002

### Test Contact Form
```bash
curl -X POST http://localhost:3000/api/contact/submit \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"name\": \"Test User\",
    \"email\": \"test@example.com\",
    \"subject\": \"Test Message\",
    \"message\": \"This is a test message\"
  }'
```

## Support

For technical support, contact:
- Email: director@coodutrust.org
- Phone: +91-451-2461362

## License

MIT License - See LICENSE file for details."