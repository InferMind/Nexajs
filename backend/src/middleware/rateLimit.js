const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiting for AI operations (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: {
    error: 'Too many AI requests, please slow down.',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    logger.warn('AI rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userId: req.userId || 'anonymous',
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many AI requests, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

// Rate limiting for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 uploads per minute
  message: {
    error: 'Too many file uploads, please wait before uploading again.',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    logger.warn('Upload rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userId: req.userId || 'anonymous',
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many file uploads, please wait before uploading again.',
      retryAfter: '1 minute'
    });
  }
});

// Rate limiting for email sending
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 emails per hour
  message: {
    error: 'Too many emails sent, please try again later.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    logger.warn('Email rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userId: req.userId || 'anonymous',
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many emails sent, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// Dynamic rate limiting based on user plan
const createUserBasedLimiter = (getUserPlan) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: async (req) => {
      try {
        const userPlan = await getUserPlan(req.userId);
        
        switch (userPlan) {
          case 'free':
            return 5; // 5 requests per minute for free users
          case 'pro':
            return 20; // 20 requests per minute for pro users
          case 'business':
            return 100; // 100 requests per minute for business users
          default:
            return 5;
        }
      } catch (error) {
        logger.error('Error getting user plan for rate limiting', { error: error.message });
        return 5; // Default to free tier limits
      }
    },
    keyGenerator: (req) => {
      // Use user ID instead of IP for authenticated requests
      return req.userId || req.ip;
    },
    message: {
      error: 'Rate limit exceeded for your plan. Consider upgrading for higher limits.',
      retryAfter: '1 minute'
    },
    handler: (req, res) => {
      logger.warn('User-based rate limit exceeded', {
        userId: req.userId,
        ip: req.ip,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent')
      });

      res.status(429).json({
        error: 'Rate limit exceeded for your plan. Consider upgrading for higher limits.',
        retryAfter: '1 minute'
      });
    }
  });
};

// Rate limiting for password reset attempts
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    logger.warn('Password reset rate limit exceeded', {
      ip: req.ip,
      email: req.body.email,
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many password reset attempts, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// Rate limiting for support chat
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each user to 15 chat messages per minute
  keyGenerator: (req) => req.userId || req.ip,
  message: {
    error: 'Too many chat messages, please slow down.',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    logger.warn('Chat rate limit exceeded', {
      userId: req.userId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(429).json({
      error: 'Too many chat messages, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter,
  uploadLimiter,
  emailLimiter,
  passwordResetLimiter,
  chatLimiter,
  createUserBasedLimiter
};