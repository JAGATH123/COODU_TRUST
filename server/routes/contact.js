const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactConfirmation, sendContactNotification } = require('../utils/emailService');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('inquiryType').optional().isIn(['general', 'volunteer', 'partnership', 'donation', 'support'])
];

// Submit contact form
router.post('/submit', validateContact, async (req, res) => {
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
      name,
      email,
      phone,
      subject,
      message,
      inquiryType = 'general'
    } = req.body;

    // Create contact entry
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      inquiryType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();

    // Send confirmation and notification emails
    try {
      await sendContactConfirmation(contact);
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the contact submission if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: {
        id: contact._id
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all contacts (admin route - add authentication later)
router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contacts'
    });
  }
});

// Update contact status (admin route)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, respondedBy } = req.body;

    if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (response) {
      updateData.response = response;
      updateData.respondedAt = new Date();
      updateData.respondedBy = respondedBy;
    }

    const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true });

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update contact'
    });
  }
});

module.exports = router;