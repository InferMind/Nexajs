const { body, param, query, validationResult } = require('express-validator');

class ValidationUtils {
  // Common validation rules
  static email() {
    return body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address');
  }

  static password() {
    return body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number');
  }

  static name() {
    return body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters');
  }

  static company() {
    return body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name must be less than 100 characters');
  }

  static plan() {
    return body('plan')
      .isIn(['free', 'pro', 'business'])
      .withMessage('Plan must be one of: free, pro, business');
  }

  static uuid() {
    return param('id')
      .isUUID()
      .withMessage('Invalid ID format');
  }

  static emailType() {
    return body('emailType')
      .isIn(['cold', 'follow-up', 'proposal'])
      .withMessage('Email type must be one of: cold, follow-up, proposal');
  }

  static customerName() {
    return body('customerName')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Customer name is required and must be less than 100 characters');
  }

  static customerCompany() {
    return body('customerCompany')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Customer company is required and must be less than 100 characters');
  }

  static customerEmail() {
    return body('customerEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid customer email address');
  }

  static message() {
    return body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message is required and must be less than 1000 characters');
  }

  static category() {
    return body('category')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Category must be less than 50 characters');
  }

  static question() {
    return body('question')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Question is required and must be less than 500 characters');
  }

  static answer() {
    return body('answer')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Answer is required and must be less than 2000 characters');
  }

  static subject() {
    return body('subject')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Subject is required and must be less than 200 characters');
  }

  static content() {
    return body('content')
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Content is required and must be less than 5000 characters');
  }

  static recipientEmail() {
    return body('recipientEmail')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid recipient email address');
  }

  static senderName() {
    return body('senderName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Sender name must be less than 100 characters');
  }

  static senderEmail() {
    return body('senderEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid sender email address');
  }

  static documents() {
    return body('documents')
      .isArray({ min: 1 })
      .withMessage('At least one document is required')
      .custom((documents) => {
        if (documents.some(doc => typeof doc !== 'string' || doc.trim().length === 0)) {
          throw new Error('All documents must be non-empty strings');
        }
        return true;
      });
  }

  static conversationId() {
    return body('conversationId')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Conversation ID must be less than 100 characters');
  }

  static emailId() {
    return body('emailId')
      .isUUID()
      .withMessage('Invalid email ID format');
  }

  // Pagination validation
  static pagination() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
    ];
  }

  // File validation
  static validateFile(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed.' 
      });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File size exceeds 10MB limit' 
      });
    }

    next();
  }

  // Middleware to handle validation errors
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }

  // Custom validation for text content
  static validateTextContent(text, minLength = 10, maxLength = 10000) {
    if (!text || typeof text !== 'string') {
      return { isValid: false, error: 'Text content is required' };
    }

    const trimmed = text.trim();
    if (trimmed.length < minLength) {
      return { isValid: false, error: `Text must be at least ${minLength} characters long` };
    }

    if (trimmed.length > maxLength) {
      return { isValid: false, error: `Text must be less than ${maxLength} characters long` };
    }

    return { isValid: true };
  }

  // Sanitize HTML content
  static sanitizeHtml(html) {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Validate JSON structure
  static validateJSON(jsonString, requiredFields = []) {
    try {
      const parsed = JSON.parse(jsonString);
      
      for (const field of requiredFields) {
        if (!(field in parsed)) {
          return { isValid: false, error: `Missing required field: ${field}` };
        }
      }

      return { isValid: true, data: parsed };
    } catch (error) {
      return { isValid: false, error: 'Invalid JSON format' };
    }
  }
}

module.exports = ValidationUtils;