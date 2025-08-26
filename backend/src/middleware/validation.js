const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      url: req.url,
      method: req.method,
      errors: errors.array(),
      userId: req.userId || 'anonymous'
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

// Middleware to validate JSON body
const validateJSON = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      try {
        if (typeof req.body === 'string') {
          req.body = JSON.parse(req.body);
        }
      } catch (error) {
        logger.warn('Invalid JSON in request body', {
          url: req.url,
          method: req.method,
          error: error.message
        });

        return res.status(400).json({
          error: 'Invalid JSON format in request body'
        });
      }
    }
  }
  next();
};

// Middleware to sanitize input data
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove potential XSS attacks
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Middleware to validate file uploads
const validateFileUpload = (allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
      });
    }

    // Check for malicious file names
    const filename = req.file.originalname;
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        error: 'Invalid file name'
      });
    }

    next();
  };
};

// Middleware to validate pagination parameters
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  if (page < 1) {
    return res.status(400).json({
      error: 'Page number must be greater than 0'
    });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      error: 'Limit must be between 1 and 100'
    });
  }

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };

  next();
};

// Middleware to validate UUID parameters
const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuid || !uuidRegex.test(uuid)) {
      return res.status(400).json({
        error: `Invalid ${paramName} format. Must be a valid UUID.`
      });
    }

    next();
  };
};

// Middleware to validate email format
const validateEmail = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        error: `Invalid ${fieldName} format`
      });
    }

    next();
  };
};

// Middleware to validate required fields
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missing
      });
    }

    next();
  };
};

// Middleware to validate content length
const validateContentLength = (field, minLength = 1, maxLength = 1000) => {
  return (req, res, next) => {
    const content = req.body[field];

    if (content && typeof content === 'string') {
      const trimmed = content.trim();
      
      if (trimmed.length < minLength) {
        return res.status(400).json({
          error: `${field} must be at least ${minLength} characters long`
        });
      }

      if (trimmed.length > maxLength) {
        return res.status(400).json({
          error: `${field} must be less than ${maxLength} characters long`
        });
      }

      // Update the field with trimmed content
      req.body[field] = trimmed;
    }

    next();
  };
};

module.exports = {
  handleValidationErrors,
  validateJSON,
  sanitizeInput,
  validateFileUpload,
  validatePagination,
  validateUUID,
  validateEmail,
  validateRequiredFields,
  validateContentLength
};