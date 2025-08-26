const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(options) {
    try {
      if (!this.transporter) {
        return {
          success: false,
          error: 'Email service not configured'
        };
      }

      const {
        to,
        subject,
        text,
        html,
        from = process.env.SMTP_USER,
        senderName = 'Nexa AI'
      } = options;

      const mailOptions = {
        from: `${senderName} <${from}>`,
        to,
        subject,
        text,
        html: html || text?.replace(/\n/g, '<br>')
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        sentTo: to,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendSalesEmail(emailData) {
    try {
      const {
        recipientEmail,
        subject,
        content,
        senderName = 'Sales Team',
        senderEmail = process.env.SMTP_USER
      } = emailData;

      return await this.sendEmail({
        to: recipientEmail,
        subject,
        text: content,
        from: senderEmail,
        senderName
      });
    } catch (error) {
      console.error('Sales email send error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    try {
      const subject = 'Welcome to Nexa AI Business Hub!';
      const text = `Hi ${userName},

Welcome to Nexa AI Business Hub! We're excited to have you on board.

Your account has been created successfully and you're ready to start using our AI-powered business tools:

🤖 Document Summarizer - Upload and get AI-powered summaries
💬 Customer Support Assistant - Automated response generation  
📧 Sales Email Writer - AI-generated personalized sales emails

You've been given 5 free credits to get started. Each AI operation uses 1 credit.

To get more credits, you can upgrade to our Pro or Business plans from your dashboard.

If you have any questions, feel free to reach out to our support team.

Best regards,
The Nexa AI Team`;

      return await this.sendEmail({
        to: userEmail,
        subject,
        text,
        senderName: 'Nexa AI Team'
      });
    } catch (error) {
      console.error('Welcome email send error:', error);
      // Don't throw error for welcome email failures
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
      
      const subject = 'Reset Your Nexa AI Password';
      const text = `Hi,

You requested to reset your password for your Nexa AI account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The Nexa AI Team`;

      return await this.sendEmail({
        to: userEmail,
        subject,
        text,
        senderName: 'Nexa AI Security'
      });
    } catch (error) {
      console.error('Password reset email send error:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      if (!this.transporter) {
        console.log('📧 Email service not configured - running in development mode');
        return true;
      }
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();