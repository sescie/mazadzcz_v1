// server/utils/authHelpers.js
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a secure random password
const generateSecurePassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Send welcome email (mock implementation - configure with your SMTP details)
const sendWelcomeEmail = async (email, tempPassword) => {
  // In development, just log to console
  console.log(`Welcome email would be sent to: ${email}`);
  console.log(`Temporary password: ${tempPassword}`);
  
  // Production example (uncomment and configure):
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: 'your-app@example.com',
    to: email,
    subject: 'Welcome to Your App',
    text: `Your temporary password: ${tempPassword}`
  });
  */
};

module.exports = { generateSecurePassword, sendWelcomeEmail };