const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.isServerless = !!process.env.VERCEL || process.env.SERVERLESS === 'true';
    this.logDir = path.join(__dirname, '../../logs');
    if (!this.isServerless) {
      this.ensureLogDirectory();
    }
  }

  ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (e) {
      // On serverless (read-only fs), just skip file logging
      this.isServerless = true;
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}\n`;
  }

  writeToFile(filename, content) {
    if (this.isServerless) return; // skip file writes on serverless
    const filePath = path.join(this.logDir, filename);
    try {
      fs.appendFileSync(filePath, content);
    } catch (_) {
      // ignore file write errors in serverless
    }
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage('info', message, meta);
    console.log(formatted.trim());
    
    if (process.env.NODE_ENV === 'production' && !this.isServerless) {
      this.writeToFile('app.log', formatted);
    }
  }

  error(message, meta = {}) {
    const formatted = this.formatMessage('error', message, meta);
    console.error(formatted.trim());
    
    if (process.env.NODE_ENV === 'production' && !this.isServerless) {
      this.writeToFile('error.log', formatted);
    }
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage('warn', message, meta);
    console.warn(formatted.trim());
    
    if (process.env.NODE_ENV === 'production' && !this.isServerless) {
      this.writeToFile('app.log', formatted);
    }
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, meta);
      console.debug(formatted.trim());
    }
  }

  // Log API requests
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.userId || 'anonymous'
    };

    this.info(`${req.method} ${req.url} - ${res.statusCode}`, logData);
  }

  // Log errors with stack trace
  logError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      ...context
    };

    this.error('Application Error', errorData);
  }

  // Log credit usage
  logCreditUsage(userId, module, action, creditsUsed) {
    this.info('Credit Usage', {
      userId,
      module,
      action,
      creditsUsed,
      timestamp: new Date().toISOString()
    });
  }

  // Log authentication events
  logAuth(event, userId, details = {}) {
    this.info(`Auth Event: ${event}`, {
      userId,
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Log AI API calls
  logAICall(service, operation, userId, tokens = null) {
    this.info('AI API Call', {
      service,
      operation,
      userId,
      tokens,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new Logger();