import winston from 'winston'
import { config } from './config'

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`
    }
    
    return log
  })
)

// Create logger instance
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: {
    service: 'nexajs-api',
    version: '1.0.0',
    environment: config.NODE_ENV
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: config.NODE_ENV === 'development' ? consoleFormat : logFormat,
      level: config.LOG_LEVEL
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: logFormat
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: logFormat
    })
  ]
})

// Create child loggers for different modules
export function createModuleLogger(moduleName: string) {
  return logger.child({ module: moduleName })
}

// Create child logger for requests
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({ 
    requestId, 
    userId,
    type: 'request'
  })
}

// Create child logger for database operations
export function createDatabaseLogger(operation: string, table?: string) {
  return logger.child({ 
    type: 'database',
    operation,
    table
  })
}

// Create child logger for external API calls
export function createExternalAPILogger(service: string, endpoint?: string) {
  return logger.child({ 
    type: 'external-api',
    service,
    endpoint
  })
}

// Create child logger for workflow operations
export function createWorkflowLogger(workflowId: string, step?: string) {
  return logger.child({ 
    type: 'workflow',
    workflowId,
    step
  })
}

// Create child logger for audit operations
export function createAuditLogger(action: string, resource?: string) {
  return logger.child({ 
    type: 'audit',
    action,
    resource
  })
}

// Helper functions for common logging patterns
export const logHelpers = {
  // Log API requests
  logRequest: (requestId: string, method: string, url: string, userId?: string) => {
    const requestLogger = createRequestLogger(requestId, userId)
    requestLogger.info('API Request', { method, url })
  },
  
  // Log API responses
  logResponse: (requestId: string, statusCode: number, responseTime: number, userId?: string) => {
    const requestLogger = createRequestLogger(requestId, userId)
    requestLogger.info('API Response', { statusCode, responseTime })
  },
  
  // Log database queries
  logQuery: (operation: string, table: string, duration: number, rows?: number) => {
    const dbLogger = createDatabaseLogger(operation, table)
    dbLogger.debug('Database Query', { duration, rows })
  },
  
  // Log external API calls
  logExternalAPI: (service: string, endpoint: string, method: string, statusCode: number, duration: number) => {
    const apiLogger = createExternalAPILogger(service, endpoint)
    apiLogger.info('External API Call', { method, statusCode, duration })
  },
  
  // Log workflow transitions
  logWorkflowTransition: (workflowId: string, fromState: string, toState: string, userId?: string) => {
    const workflowLogger = createWorkflowLogger(workflowId)
    workflowLogger.info('Workflow Transition', { fromState, toState, userId })
  },
  
  // Log audit events
  logAudit: (action: string, resource: string, resourceId: string, userId: string, details?: any) => {
    const auditLogger = createAuditLogger(action, resource)
    auditLogger.info('Audit Event', { resourceId, userId, details })
  },
  
  // Log performance metrics
  logPerformance: (operation: string, duration: number, metadata?: any) => {
    logger.info('Performance Metric', { operation, duration, ...metadata })
  },
  
  // Log security events
  logSecurity: (event: string, userId?: string, ip?: string, details?: any) => {
    logger.warn('Security Event', { event, userId, ip, details })
  },
  
  // Log business events
  logBusiness: (event: string, entity: string, entityId: string, userId?: string, details?: any) => {
    logger.info('Business Event', { event, entity, entityId, userId, details })
  }
}

// Middleware for request logging
export function requestLoggerMiddleware() {
  return (request: any, reply: any, done: any) => {
    const startTime = Date.now()
    const requestId = request.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Add request ID to request object
    request.requestId = requestId
    
    // Log request
    logHelpers.logRequest(
      requestId,
      request.method,
      request.url,
      request.user?.id
    )
    
    // Log response when request completes
    reply.addHook('onResponse', (request: any, reply: any, done: any) => {
      const responseTime = Date.now() - startTime
      
      logHelpers.logResponse(
        requestId,
        reply.statusCode,
        responseTime,
        request.user?.id
      )
      
      done()
    })
    
    done()
  }
}

// Export default logger for backward compatibility
export default logger 