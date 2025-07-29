# Coodu Trust Website - Setup Guide

Complete setup guide for the Coodu Trust website with Razorpay payment integration.

## 🚀 Quick Overview

This project consists of:
- **Frontend**: Static HTML/CSS/JS website
- **Backend**: Node.js server with Razorpay integration
- **Database**: MongoDB for storing donations and contacts

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher) installed
- MongoDB installed and running
- Razorpay account (for payment processing)
- Gmail account (for email notifications)

## 🔧 Installation Steps

### Step 1: Clone and Setup
```bash
# Navigate to your project directory
cd COODU_TRUST

# Install backend dependencies
cd server
npm install
```

### Step 2: Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your actual values
# (See detailed configuration below)
```

### Step 3: Database Setup
```bash
# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (Linux/Mac)
sudo systemctl start mongod
```

### Step 4: Start the Backend Server
```bash
# From the server directory
npm run dev
```

### Step 5: Serve the Frontend
You can use any static file server. Options:

**Option A: Using Live Server (VS Code Extension)**
- Install \"Live Server\" extension in VS Code
- Right-click on `index.html` → \"Open with Live Server\"

**Option B: Using Python**
```bash
# From the main project directory
python -m http.server 3001
# Then visit http://localhost:3001
```

**Option C: Using Node.js serve**
```bash
npm install -g serve
serve -s . -p 3001
```

## ⚙️ Detailed Configuration

### 1. Razorpay Setup

#### Create Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up and complete KYC verification
3. Go to Settings → API Keys
4. Generate and copy Key ID and Key Secret

#### Configure NGO Rates
1. Contact Razorpay support for NGO discount rates
2. Upload NGO registration documents
3. Get reduced transaction fees (usually 1.5% instead of 2%)

### 2. Environment Variables (`.env`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/coodu_trust

# Razorpay (Replace with your actual keys)
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=your_secret_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@coodutrust.org

# Security
JWT_SECRET=your-super-secret-jwt-key-here
WEBHOOK_SECRET=your-webhook-secret-here

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security
3. Under \"2-Step Verification\", click \"App passwords\"
4. Generate a password for \"Mail\"
5. Use this password in `EMAIL_PASS`

### 4. Frontend Configuration

Update the API URL in `assets/js/donate.js`:
```javascript
// Change this line to match your backend URL
const API_BASE_URL = 'http://localhost:3000/api'; // Development
// For production: const API_BASE_URL = 'https://your-backend-domain.com/api';
```

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:3000/api/health
```
Should return: `{\"status\":\"success\",\"message\":\"Coodu Trust API is running\"}`

### 2. Test Database Connection
Check server logs - you should see:
```
📊 MongoDB Connected: localhost:27017
```

### 3. Test Payment Flow
1. Open the donation page: `http://localhost:3001/donate.html`
2. Fill in the form with test data
3. Use Razorpay test card: `4111 1111 1111 1111`
4. Check server logs for payment processing

### 4. Test Email Functionality
Submit a contact form and check:
- Console logs for email sending status
- Your email inbox for confirmation

## 🌐 Production Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create coodu-trust-backend

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set RAZORPAY_KEY_ID=your_live_key_id
heroku config:set RAZORPAY_KEY_SECRET=your_live_key_secret
# ... set all other env vars

# Deploy
git subtree push --prefix server heroku main
```

### Frontend Deployment (Netlify)
1. Connect your GitHub repo to Netlify
2. Set build command: (leave empty for static site)
3. Set publish directory: `.` (root)
4. Update API URL in `donate.js` to your backend URL

### MongoDB Atlas Setup (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string and update `MONGODB_URI`

## 🔐 Security Checklist

- [ ] Environment variables are set correctly
- [ ] `.env` file is in `.gitignore`
- [ ] Razorpay webhook secret is configured
- [ ] CORS is configured for your domain only
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] HTTPS is enabled in production

## 📱 Mobile Testing

Test the donation flow on various devices:
- Android Chrome (UPI payments)
- iPhone Safari (Card payments)
- Different screen sizes
- Slow network conditions

## 🐛 Common Issues & Solutions

### Issue: \"Cannot connect to MongoDB\"
**Solution**: 
- Ensure MongoDB service is running
- Check connection string format
- For Atlas, verify IP whitelist

### Issue: \"Razorpay key not found\"
**Solution**:
- Verify `.env` file exists and has correct keys
- Restart the server after changing `.env`
- Check Razorpay dashboard for correct keys

### Issue: \"CORS error on donation\"
**Solution**:
- Update `FRONTEND_URL` in `.env`
- Ensure frontend is running on the specified URL
- Check browser developer tools for exact error

### Issue: \"Emails not sending\"
**Solution**:
- Verify Gmail app password (not regular password)
- Check SMTP settings in `.env`
- Test with a simple email service first

### Issue: \"Payment successful but not recorded\"
**Solution**:
- Check webhook configuration
- Verify database connection
- Check server logs for errors

## 📊 Monitoring & Analytics

### Payment Analytics
- Monitor donation amounts and frequency
- Track successful vs failed payments
- Analyze popular donation causes

### Technical Monitoring
- Server uptime monitoring
- Database performance
- Email delivery rates
- Error tracking

## 🆘 Getting Help

### Technical Support
- Check server logs: `npm run dev` or `heroku logs`
- Database issues: MongoDB compass for GUI
- Payment issues: Razorpay dashboard logs

### Community Support
- GitHub Issues: Create an issue in your repository
- Email: director@coodutrust.org

## 📚 Additional Resources

- [Razorpay Integration Guide](https://razorpay.com/docs/payments/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Express.js Documentation](https://expressjs.com/)
- [Nodemailer Documentation](https://nodemailer.com/)

---

## 🎉 Congratulations!

Your Coodu Trust website with payment integration is now ready! 

The system includes:
✅ Secure Razorpay payment processing  
✅ Automated email notifications  
✅ Database storage for donations  
✅ Contact form functionality  
✅ Mobile-responsive design  
✅ Production-ready architecture  

Happy fundraising! 🚀"