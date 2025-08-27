const app = require('./app');
const emailService = require('./services/emailService');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

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