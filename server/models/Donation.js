const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Razorpay Details
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  
  // Donation Details
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'INR'
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly', 'yearly'],
    default: 'one-time'
  },
  cause: {
    type: String,
    enum: ['general', 'education', 'health', 'environment', 'women-empowerment'],
    default: 'general'
  },
  
  // Donor Information
  donorInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    }
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'cancelled'],
    default: 'created'
  },
  
  // Additional Information
  isAnonymous: {
    type: Boolean,
    default: false
  },
  receiptRequested: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes for better performance (razorpayOrderId already indexed due to unique: true)
donationSchema.index({ 'donorInfo.email': 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });

// Virtual for receipt number
donationSchema.virtual('receiptNumber').get(function() {
  return `CT${this.createdAt.getFullYear()}${String(this.createdAt.getMonth() + 1).padStart(2, '0')}${this._id.toString().slice(-6).toUpperCase()}`;
});

// Ensure virtual fields are serialized
donationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Donation', donationSchema);