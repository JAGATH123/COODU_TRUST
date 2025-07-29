const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Donation = require('../models/Donation');
const { sendDonationConfirmation, sendDonationNotification } = require('../utils/emailService');

const router = express.Router();

// Validation middleware
const validateDonation = [
  body('amount').isNumeric().withMessage('Amount must be a number').custom(value => {
    if (value < 1) throw new Error('Amount must be at least ₹1');
    return true;
  }),
  body('donorInfo.name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('donorInfo.email').isEmail().withMessage('Valid email is required'),
  body('donorInfo.phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
  body('donationType').optional().isIn(['one-time', 'monthly', 'yearly']),
  body('cause').optional().isIn(['general', 'education', 'health', 'environment', 'women-empowerment'])
];

// Create Razorpay Order
router.post('/create-order', validateDonation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      amount,
      donorInfo,
      donationType = 'one-time',
      cause = 'general',
      isAnonymous = false,
      receiptRequested = true,
      notes = ''
    } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        cause: cause
      }
    });

    // Save donation to database
    const donation = new Donation({
      razorpayOrderId: razorpayOrder.id,
      amount,
      donationType,
      cause,
      donorInfo,
      isAnonymous,
      receiptRequested,
      notes,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await donation.save();

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payment signature'
      });
    }

    // Update donation status
    const donation = await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date()
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        status: 'error',
        message: 'Donation not found'
      });
    }

    // Send confirmation emails
    try {
      await sendDonationConfirmation(donation);
      await sendDonationNotification(donation);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the payment verification if email fails
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        receiptNumber: donation.receiptNumber,
        amount: donation.amount,
        donorName: donation.donorInfo.name
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Webhook handler for Razorpay
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET;
    const signature = req.get('X-Razorpay-Signature');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);
    
    // Handle different events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get donation history for a donor
router.get('/history/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({
      'donorInfo.email': email,
      status: 'paid'
    })
    .select('amount cause donationType createdAt receiptNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Donation.countDocuments({
      'donorInfo.email': email,
      status: 'paid'
    });

    res.status(200).json({
      status: 'success',
      data: {
        donations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Donation history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch donation history'
    });
  }
});

// Helper functions
async function handlePaymentCaptured(payment) {
  await Donation.findOneAndUpdate(
    { razorpayOrderId: payment.order_id },
    {
      razorpayPaymentId: payment.id,
      status: 'paid',
      paidAt: new Date(payment.created_at * 1000)
    }
  );
}

async function handlePaymentFailed(payment) {
  await Donation.findOneAndUpdate(
    { razorpayOrderId: payment.order_id },
    { status: 'failed' }
  );
}

module.exports = router;