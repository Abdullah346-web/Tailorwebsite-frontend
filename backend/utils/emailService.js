const nodemailer = require('nodemailer');

/**
 * Email Service for sending OTP and password reset emails
 * Configure your email credentials in environment variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASSWORD
 * - SENDER_EMAIL
 */

class EmailService {
  constructor() {
    // Initialize transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;
  }

  /**
   * Generate a 6-digit OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification OTP email for signup
   * @param {string} email - Recipient email address
   * @param {string} name - User's name
   * @param {string} otp - OTP to send
   * @returns {Promise<boolean>} True if sent successfully
   */
  async sendVerificationOTP(email, name, otp) {
    const mailOptions = {
      from: this.senderEmail,
      to: email,
      subject: 'Verify Your Email - Tailor Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Tailor Services!</h2>
          <p style="color: #666; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="color: #666; font-size: 16px;">
            Thank you for signing up. To complete your registration, please verify your email using the code below:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <p style="font-size: 32px; font-weight: bold; color: #2196F3; margin: 0; letter-spacing: 5px;">
              ${otp}
            </p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>. If you didn't sign up for this account, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 Tailor Services. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✓ Verification OTP sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to send verification OTP to ${email}:`, error.message);
      return false;
    }
  }

  /**
   * Send password reset token via email
   * @param {string} email - Recipient email address
   * @param {string} name - User's name
   * @param {string} resetToken - Reset token or OTP
   * @returns {Promise<boolean>} True if sent successfully
   */
  async sendPasswordResetEmail(email, name, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: this.senderEmail,
      to: email,
      subject: 'Reset Your Password - Tailor Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="color: #666; font-size: 16px;">
            We received a request to reset your password. If you didn't make this request, please ignore this email.
          </p>
          <p style="color: #666; font-size: 16px;">
            Click the button below to reset your password. This link will expire in <strong>30 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">
            Or copy and paste this link in your browser: <br>
            <a href="${resetLink}" style="color: #2196F3;">${resetLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 Tailor Services. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✓ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to send password reset email to ${email}:`, error.message);
      return false;
    }
  }

  /**
   * Verify email transporter connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✓ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('✗ Email service connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
