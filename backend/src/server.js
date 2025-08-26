const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Import middleware
const corsMiddleware = require('./middleware/cors');
const authMiddleware = require('./middleware/auth');
const requestLogger = require('./middleware/requestLogger');
const { generalLimiter } = require('./middleware/rateLimit');
const { sanitizeInput, validateJSON } = require('./middleware/validation');

// Import routes
const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');
const supportRoutes = require('./routes/support');
const salesRoutes = require('./routes/sales');
const billingRoutes = require('./routes/billing');

// Import services
const emailService = require('./services/emailService');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
app.use(generalLimiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation and sanitization
app.use(validateJSON);
app.use(sanitizeInput);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Make upload middleware available globally
app.locals.upload = upload;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/billing', billingRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Nexa AI Business Hub API',
    version: '1.0.0',
    description: 'AI-powered business automation platform',
    endpoints: {
      auth: '/api/auth',
      documents: '/api/documents',
      support: '/api/support',
      sales: '/api/sales',
      billing: '/api/billing'
    },
    documentation: 'https://docs.nexa.ai'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.logError(err, {
    url: req.url,
    method: req.method,
    userId: req.userId || 'anonymous',
    ip: req.ip
  });

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size exceeds 10MB limit'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file',
        message: 'Unexpected file field'
      });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Authentication token has expired'
    });
  }

  // Validation errors
  if (err.message === 'Invalid file type') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF, DOC, DOCX, TXT, and MD files are allowed'
    });
  }

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS error',
      message: 'Origin not allowed by CORS policy'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    error: 'Server error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Verify email service connection
    await emailService.verifyConnection();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Nexa AI Backend Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();

module.exports = app;