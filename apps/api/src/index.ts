import { buildApp } from './app'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'

async function startServer() {
  try {
    const app = await buildApp()
    
    const port = config.PORT || 3001
    const host = config.HOST || '0.0.0.0'
    
    await app.listen({ port, host })
    
    logger.info(`🚀 NexaJS API Server running on http://${host}:${port}`)
    logger.info(`📚 API Documentation available at http://${host}:${port}/documentation`)
    logger.info(`🔍 Health check available at http://${host}:${port}/health`)
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully')
      await app.close()
      process.exit(0)
    })
    
    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully')
      await app.close()
      process.exit(0)
    })
    
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer() 