import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://nexajs_user:nexajs_password@localhost:5432/nexajs',
  
  // Redis Configuration
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || true,
  
  // Rate Limiting
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '1 minute',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  MAX_FILES: parseInt(process.env.MAX_FILES || '10', 10),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // API Configuration
  API_HOST: process.env.API_HOST || 'localhost:3001',
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@nexajs.com',
  
  // External Services
  SENTRY_DSN: process.env.SENTRY_DSN,
  
  // Feature Flags
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER !== 'false',
  ENABLE_RATE_LIMIT: process.env.ENABLE_RATE_LIMIT !== 'false',
  ENABLE_CORS: process.env.ENABLE_CORS !== 'false',
  
  // Development
  ENABLE_HOT_RELOAD: process.env.NODE_ENV === 'development',
  
  // Security
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  
  // Cache Configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
  
  // Queue Configuration
  QUEUE_REDIS_URL: process.env.QUEUE_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Monitoring
  ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
  METRICS_PORT: parseInt(process.env.METRICS_PORT || '9090', 10),
  
  // Backup Configuration
  BACKUP_ENABLED: process.env.BACKUP_ENABLED === 'true',
  BACKUP_SCHEDULE: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
  
  // AI Integration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_ENABLED: process.env.AI_ENABLED === 'true',
  
  // Payment Processing
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Storage
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local', // local, s3, gcs
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  
  // WebSocket
  WS_ENABLED: process.env.WS_ENABLED !== 'false',
  WS_PORT: parseInt(process.env.WS_PORT || '3002', 10),
  
  // Testing
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://nexajs_user:nexajs_password@localhost:5432/nexajs_test',
  
  // Performance
  ENABLE_COMPRESSION: process.env.ENABLE_COMPRESSION !== 'false',
  ENABLE_ETAG: process.env.ENABLE_ETAG !== 'false',
  
  // Internationalization
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en',
  SUPPORTED_LOCALES: (process.env.SUPPORTED_LOCALES || 'en,es,fr,de').split(','),
  
  // Business Logic
  COMPANY_NAME: process.env.COMPANY_NAME || 'NexaJS',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@nexajs.com',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@nexajs.com',
  
  // Timezone
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'UTC',
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  
  // Search
  ENABLE_FULL_TEXT_SEARCH: process.env.ENABLE_FULL_TEXT_SEARCH === 'true',
  SEARCH_INDEX_PREFIX: process.env.SEARCH_INDEX_PREFIX || 'nexajs',
  
  // Workflow
  WORKFLOW_ENABLED: process.env.WORKFLOW_ENABLED !== 'false',
  WORKFLOW_MAX_STEPS: parseInt(process.env.WORKFLOW_MAX_STEPS || '50', 10),
  
  // Reports
  REPORTS_ENABLED: process.env.REPORTS_ENABLED !== 'false',
  REPORTS_STORAGE_PATH: process.env.REPORTS_STORAGE_PATH || './reports',
  
  // Notifications
  NOTIFICATIONS_ENABLED: process.env.NOTIFICATIONS_ENABLED !== 'false',
  PUSH_NOTIFICATIONS_ENABLED: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
  
  // Audit
  AUDIT_ENABLED: process.env.AUDIT_ENABLED !== 'false',
  AUDIT_RETENTION_DAYS: parseInt(process.env.AUDIT_RETENTION_DAYS || '365', 10),
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
  
  // API Keys
  API_KEY_HEADER: process.env.API_KEY_HEADER || 'X-API-Key',
  API_KEY_ENABLED: process.env.API_KEY_ENABLED === 'true',
  
  // Health Checks
  HEALTH_CHECK_ENABLED: process.env.HEALTH_CHECK_ENABLED !== 'false',
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10), // 30 seconds
  
  // Maintenance
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
  MAINTENANCE_MESSAGE: process.env.MAINTENANCE_MESSAGE || 'System is under maintenance. Please try again later.',
  
  // Development Tools
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_PROFILING: process.env.ENABLE_PROFILING === 'true',
  
  // Database Pool
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN || '2', 10),
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10', 10),
  DB_POOL_IDLE_TIMEOUT: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
  
  // Redis Pool
  REDIS_POOL_MIN: parseInt(process.env.REDIS_POOL_MIN || '2', 10),
  REDIS_POOL_MAX: parseInt(process.env.REDIS_POOL_MAX || '10', 10),
  
  // Timeouts
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
  RESPONSE_TIMEOUT: parseInt(process.env.RESPONSE_TIMEOUT || '30000', 10),
  
  // Limits
  MAX_REQUEST_SIZE: parseInt(process.env.MAX_REQUEST_SIZE || '1048576', 10), // 1MB
  MAX_RESPONSE_SIZE: parseInt(process.env.MAX_RESPONSE_SIZE || '10485760', 10), // 10MB
} as const

// Type for config keys
export type ConfigKey = keyof typeof config

// Helper function to get config value with type safety
export function getConfig<T extends ConfigKey>(key: T): typeof config[T] {
  return config[key]
}

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: string): boolean {
  const featureKey = `ENABLE_${feature.toUpperCase()}` as ConfigKey
  return config[featureKey] === true
}

// Helper function to get database configuration
export function getDatabaseConfig() {
  return {
    url: config.DATABASE_URL,
    pool: {
      min: config.DB_POOL_MIN,
      max: config.DB_POOL_MAX,
      idleTimeout: config.DB_POOL_IDLE_TIMEOUT
    }
  }
}

// Helper function to get Redis configuration
export function getRedisConfig() {
  return {
    url: config.REDIS_URL,
    pool: {
      min: config.REDIS_POOL_MIN,
      max: config.REDIS_POOL_MAX
    }
  }
}

// Helper function to get email configuration
export function getEmailConfig() {
  return {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
    from: config.SMTP_FROM
  }
}

// Helper function to get AWS configuration
export function getAWSConfig() {
  return {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION,
    s3Bucket: config.AWS_S3_BUCKET
  }
} 