import Fastify, { FastifyInstance } from 'fastify'
import { Server as HTTPServer } from 'http'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { ModelRegistry } from '@/core/registry/model-registry'
import { MigrationManager, initializeMigrations } from '@/core/database/migrations'
import { DataSeeder, initializeSeeder } from '@/core/database/seeder'
import { AuditLogger } from '@/core/audit/audit-logger'
import { FileManager } from '@/core/files/file-manager'
import { EmailService } from '@/core/email/email-service'
import { WebSocketManager } from '@/core/realtime/websocket-manager'
import { SearchEngine } from '@/core/search/search-engine'
import { config } from '@/utils/config'
import { logger } from '@/utils/logger'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    },
    trustProxy: true
  })

  // Register security plugins
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })

  await app.register(cors, {
    origin: config.CORS_ORIGIN || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })

  // Rate limiting
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX || 100,
    timeWindow: config.RATE_LIMIT_WINDOW || '1 minute',
    errorResponseBuilder: (request, context) => ({
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after
    })
  })

  // JWT Authentication
  await app.register(jwt, {
    secret: config.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    sign: {
      expiresIn: config.JWT_EXPIRES_IN || '24h'
    }
  })

  // Multipart support for file uploads
  await app.register(multipart, {
    limits: {
      fileSize: config.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
      files: config.MAX_FILES || 10
    }
  })

  // Swagger documentation
  await app.register(swagger, {
    swagger: {
      info: {
        title: 'NexaJS API',
        description: 'Modern ERP Framework API Documentation',
        version: '1.0.0',
        contact: {
          name: 'NexaJS Team',
          email: 'support@nexajs.com'
        }
      },
      host: config.API_HOST || 'localhost:3001',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  })

  await app.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })

  // Health check endpoint
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      version: '1.0.0'
    }
  })

  // API versioning
  app.addHook('onRequest', async (request, reply) => {
    const version = request.headers['api-version'] || 'v1'
    request.apiVersion = version
  })

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error('Global error handler:', error)
    
    if (error.validation) {
      reply.status(400).send({
        error: 'Validation Error',
        message: 'Request validation failed',
        details: error.validation
      })
      return
    }

    if (error.statusCode) {
      reply.status(error.statusCode).send({
        error: error.name,
        message: error.message
      })
      return
    }

    // Default error
    reply.status(500).send({
      error: 'Internal Server Error',
      message: config.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    })
  })

          // Initialize core systems
          await initializeCoreSystems(app)

          // Register API routes
          await registerRoutes(app)

  return app
}

        async function initializeCoreSystems(app: FastifyInstance) {
          try {
            // Import Prisma client
            const { PrismaClient } = await import('@prisma/client')
            const prisma = new PrismaClient()

            // Initialize ORM system
            const { ModelRegistry } = await import('@/core/registry/model-registry')
            ModelRegistry.getInstance().initialize(prisma)

            // Import and register models
            await import('@/modules/base/models/user')
            await import('@/modules/base/models/company')
            await import('@/modules/base/models/partner')

            // Initialize Week 3 systems
            await initializeWeek3Systems(prisma, app)

            logger.info('All core systems initialized successfully')
          } catch (error) {
            logger.error('Failed to initialize core systems:', error)
            throw error
          }
        }

        async function initializeWeek3Systems(prisma: PrismaClient, app: FastifyInstance) {
          // Initialize database migrations
          const migrationManager = initializeMigrations(prisma)
          await migrationManager.migrate()

          // Initialize data seeder
          const seeder = initializeSeeder(prisma)
          await seeder.seed({
            environment: config.NODE_ENV as any,
            seedTestData: config.NODE_ENV === 'development'
          })

          // Initialize audit logger
          const auditLogger = AuditLogger.getInstance(prisma)

          // Initialize file manager
          const fileManager = FileManager.getInstance(prisma)

          // Initialize email service
          const emailService = EmailService.getInstance(prisma)
          await emailService.initialize()

          // Initialize WebSocket manager
          const wsManager = WebSocketManager.getInstance(prisma)
          wsManager.initialize(app.server as HTTPServer)

          // Initialize search engine
          const searchEngine = SearchEngine.getInstance(prisma)
          await searchEngine.initialize()

          // Register Week 3 routes
          await registerWeek3Routes(app, {
            migrationManager,
            seeder,
            auditLogger,
            fileManager,
            emailService,
            wsManager,
            searchEngine
          })

          logger.info('Week 3 systems initialized successfully')
        }

        async function registerRoutes(app: FastifyInstance) {
          // Import and register route modules
          const { registerBaseRoutes } = await import('@/modules/base/routes')
          await registerBaseRoutes(app)

          // Root API endpoint
          app.get('/api', async () => {
            return {
              name: 'NexaJS API',
              version: '1.0.0',
              description: 'Modern ERP Framework API',
              documentation: '/documentation',
              health: '/health'
            }
          })
        }

        async function registerWeek3Routes(app: FastifyInstance, services: any) {
          // Database management routes
          app.get('/api/v1/database/migrations', async () => {
            return await services.migrationManager.getMigrationStatus()
          })

          app.post('/api/v1/database/migrate', async () => {
            await services.migrationManager.migrate()
            return { success: true, message: 'Database migrated successfully' }
          })

          app.get('/api/v1/database/seed-status', async () => {
            return await services.seeder.getSeedStatus()
          })

          // Audit log routes
          app.get('/api/v1/audit/logs', async (request) => {
            const query = request.query as any
            return await services.auditLogger.query(query)
          })

          app.get('/api/v1/audit/stats', async (request) => {
            const days = parseInt((request.query as any).days || '30')
            return await services.auditLogger.getAuditStats(days)
          })

          // File management routes
          app.post('/api/v1/files/upload', async (request, reply) => {
            const data = await request.file()
            if (!data) {
              reply.status(400).send({ error: 'No file provided' })
              return
            }

            const fileInfo = await services.fileManager.uploadFile(data, {}, request.user?.id)
            return fileInfo
          })

          app.get('/api/v1/files/:id', async (request) => {
            const { id } = request.params as { id: string }
            return await services.fileManager.getFile(id)
          })

          app.get('/api/v1/files/:id/download', async (request, reply) => {
            const { id } = request.params as { id: string }
            const stream = await services.fileManager.getFileStream(id)
            reply.send(stream)
          })

          app.get('/api/v1/files', async (request) => {
            const query = request.query as any
            return await services.fileManager.queryFiles(query)
          })

          // Email service routes
          app.post('/api/v1/email/send', async (request) => {
            const message = request.body as any
            const messageId = await services.emailService.sendEmail(message)
            return { success: true, messageId }
          })

          app.post('/api/v1/email/welcome', async (request) => {
            const { email, name } = request.body as any
            const messageId = await services.emailService.sendWelcomeEmail(email, name)
            return { success: true, messageId }
          })

          app.get('/api/v1/email/stats', async (request) => {
            const days = parseInt((request.query as any).days || '30')
            return await services.emailService.getEmailStats(days)
          })

          // WebSocket routes
          app.get('/api/v1/websocket/stats', async () => {
            return services.wsManager.getConnectionStats()
          })

          // Search routes
          app.get('/api/v1/search', async (request) => {
            const query = request.query as any
            return await services.searchEngine.search(query)
          })

          app.get('/api/v1/search/suggestions', async (request) => {
            const { q } = request.query as { q: string }
            return await services.searchEngine.searchWithSuggestions(q)
          })

          app.get('/api/v1/search/analytics', async (request) => {
            const days = parseInt((request.query as any).days || '30')
            return await services.searchEngine.getSearchAnalytics(days)
          })
        } 