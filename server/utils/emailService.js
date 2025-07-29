const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send donation confirmation to donor
const sendDonationConfirmation = async (donation) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: donation.donorInfo.email,
    subject: 'Thank You for Your Donation - Coodu Trust',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>Thank You for Your Generous Donation!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <p>Dear ${donation.donorInfo.name},</p>
          
          <p>We are deeply grateful for your donation to Coodu Trust. Your contribution will help us continue our mission of empowering communities and transforming lives.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Donation Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Receipt Number:</strong> ${donation.receiptNumber}</li>
              <li><strong>Amount:</strong> ₹${donation.amount}</li>
              <li><strong>Date:</strong> ${donation.paidAt?.toLocaleDateString('en-IN') || new Date().toLocaleDateString('en-IN')}</li>
              <li><strong>Cause:</strong> ${donation.cause.charAt(0).toUpperCase() + donation.cause.slice(1).replace('-', ' ')}</li>
              <li><strong>Payment ID:</strong> ${donation.razorpayPaymentId}</li>
            </ul>
          </div>
          
          ${donation.receiptRequested ? `
          <p><strong>Tax Benefits:</strong> This donation is eligible for tax deduction under Section 80G of the Income Tax Act. The official receipt will be sent to you separately.</p>
          ` : ''}
          
          <p>Your support enables us to:</p>
          <ul>
            <li>Empower women through skill development programs</li>
            <li>Provide healthcare and sanitation facilities</li>
            <li>Promote environmental sustainability</li>
            <li>Support rural development initiatives</li>
          </ul>
          
          <p>We will keep you updated on how your contribution is making a difference.</p>
          
          <p>With heartfelt gratitude,<br>
          <strong>Team Coodu Trust</strong></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>Coodu Trust<br>
            H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India<br>
            Email: director@coodutrust.org | Phone: +91-451-2461362</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send donation notification to admin
const sendDonationNotification = async (donation) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `New Donation Received - ₹${donation.amount}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
          <h1>New Donation Received!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h3>Donation Details:</h3>
          <ul>
            <li><strong>Amount:</strong> ₹${donation.amount}</li>
            <li><strong>Donor:</strong> ${donation.isAnonymous ? 'Anonymous' : donation.donorInfo.name}</li>
            <li><strong>Email:</strong> ${donation.donorInfo.email}</li>
            <li><strong>Phone:</strong> ${donation.donorInfo.phone}</li>
            <li><strong>Cause:</strong> ${donation.cause}</li>
            <li><strong>Type:</strong> ${donation.donationType}</li>
            <li><strong>Receipt Number:</strong> ${donation.receiptNumber}</li>
            <li><strong>Payment ID:</strong> ${donation.razorpayPaymentId}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</li>
          </ul>
          
          ${donation.notes ? `<p><strong>Notes:</strong> ${donation.notes}</p>` : ''}
          
          <p><strong>Receipt Requested:</strong> ${donation.receiptRequested ? 'Yes' : 'No'}</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send contact form confirmation
const sendContactConfirmation = async (contact) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: contact.email,
    subject: 'Message Received - Coodu Trust',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <p>Dear ${contact.name},</p>
          
          <p>We have received your message and will get back to you within 24-48 hours. Thank you for your interest in Coodu Trust.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong> ${contact.message}</p>
          </div>
          
          <p>If you have any urgent queries, please feel free to call us at +91-451-2461362.</p>
          
          <p>Best regards,<br>
          <strong>Team Coodu Trust</strong></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>Coodu Trust<br>
            H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India<br>
            Email: director@coodutrust.org | Phone: +91-451-2461362</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send contact notification to admin
const sendContactNotification = async (contact) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission - ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px;">
          <h3>Contact Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${contact.name}</li>
            <li><strong>Email:</strong> ${contact.email}</li>
            <li><strong>Phone:</strong> ${contact.phone || 'Not provided'}</li>
            <li><strong>Inquiry Type:</strong> ${contact.inquiryType}</li>
            <li><strong>Subject:</strong> ${contact.subject}</li>
            <li><strong>Date:</strong> ${contact.createdAt.toLocaleString('en-IN')}</li>
          </ul>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Message:</h3>
            <p>${contact.message}</p>
          </div>
          
          <p><a href="mailto:${contact.email}?subject=Re: ${contact.subject}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply to ${contact.name}</a></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendDonationConfirmation,
  sendDonationNotification,
  sendContactConfirmation,
  sendContactNotification
};