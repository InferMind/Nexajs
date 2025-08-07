import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { AuthenticatedUser } from '@/core/auth/middleware'

export interface AuditLogEntry {
  tableName: string
  recordId: number
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PERMISSION_DENIED' | 'SYSTEM_EVENT'
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  userId?: number
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export interface AuditLogQuery {
  tableName?: string
  recordId?: number
  action?: string
  userId?: number
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export class AuditLogger {
  private static instance: AuditLogger
  private prisma: PrismaClient
  private enabled: boolean = true

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): AuditLogger {
    if (!AuditLogger.instance && prisma) {
      AuditLogger.instance = new AuditLogger(prisma)
    }
    return AuditLogger.instance
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  async log(entry: AuditLogEntry): Promise<void> {
    if (!this.enabled) {
      return
    }

    try {
      await this.prisma.auditLog.create({
        data: {
          tableName: entry.tableName,
          recordId: entry.recordId,
          action: entry.action,
          oldValues: entry.oldValues,
          newValues: entry.newValues,
          userId: entry.userId,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          metadata: entry.metadata
        }
      })
    } catch (error) {
      logger.error('Failed to create audit log entry:', error)
    }
  }

  async logDataChange(
    tableName: string,
    recordId: number,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    user?: AuthenticatedUser,
    request?: any
  ): Promise<void> {
    await this.log({
      tableName,
      recordId,
      action,
      oldValues,
      newValues,
      userId: user?.id,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      metadata: {
        userEmail: user?.email,
        userRole: user?.role
      }
    })
  }

  async logUserAction(
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PERMISSION_DENIED',
    userId?: number,
    email?: string,
    request?: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      tableName: 'users',
      recordId: userId || 0,
      action,
      userId,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      metadata: {
        email,
        ...metadata
      }
    })
  }

  async logSystemEvent(
    event: string,
    details?: Record<string, any>,
    userId?: number,
    request?: any
  ): Promise<void> {
    await this.log({
      tableName: 'system',
      recordId: 0,
      action: 'SYSTEM_EVENT',
      userId,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      metadata: {
        event,
        ...details
      }
    })
  }

  async query(query: AuditLogQuery): Promise<any[]> {
    const where: any = {}

    if (query.tableName) {
      where.tableName = query.tableName
    }

    if (query.recordId) {
      where.recordId = query.recordId
    }

    if (query.action) {
      where.action = query.action
    }

    if (query.userId) {
      where.userId = query.userId
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {}
      if (query.startDate) {
        where.createdAt.gte = query.startDate
      }
      if (query.endDate) {
        where.createdAt.lte = query.endDate
      }
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: query.limit || 100,
      skip: query.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return logs
  }

  async getAuditStats(days: number = 30): Promise<any> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await this.prisma.auditLog.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        action: true
      }
    })

    const totalLogs = await this.prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    const uniqueUsers = await this.prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startDate
        },
        userId: {
          not: null
        }
      }
    })

    return {
      period: `${days} days`,
      totalLogs,
      uniqueUsers: uniqueUsers.length,
      actions: stats.reduce((acc, stat) => {
        acc[stat.action] = stat._count.action
        return acc
      }, {} as Record<string, number>)
    }
  }

  async cleanupOldLogs(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    logger.info(`Cleaned up ${result.count} old audit log entries`)
    return result.count
  }

  async exportAuditLogs(
    startDate: Date,
    endDate: Date,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    if (format === 'csv') {
      return this.convertToCSV(logs)
    }

    return JSON.stringify(logs, null, 2)
  }

  private convertToCSV(logs: any[]): string {
    if (logs.length === 0) {
      return ''
    }

    const headers = [
      'ID',
      'Table Name',
      'Record ID',
      'Action',
      'User ID',
      'User Email',
      'User Name',
      'IP Address',
      'User Agent',
      'Created At',
      'Old Values',
      'New Values',
      'Metadata'
    ]

    const csvRows = [headers.join(',')]

    for (const log of logs) {
      const row = [
        log.id,
        `"${log.tableName}"`,
        log.recordId,
        `"${log.action}"`,
        log.userId || '',
        `"${log.user?.email || ''}"`,
        `"${log.user?.name || ''}"`,
        `"${log.ipAddress || ''}"`,
        `"${log.userAgent || ''}"`,
        log.createdAt.toISOString(),
        `"${JSON.stringify(log.oldValues || {}).replace(/"/g, '""')}"`,
        `"${JSON.stringify(log.newValues || {}).replace(/"/g, '""')}"`,
        `"${JSON.stringify(log.metadata || {}).replace(/"/g, '""')}"`
      ]
      csvRows.push(row.join(','))
    }

    return csvRows.join('\n')
  }
}

// Audit decorator for automatic logging
export function Audited(options: {
  tableName: string
  logCreate?: boolean
  logUpdate?: boolean
  logDelete?: boolean
  excludeFields?: string[]
} = { tableName: '', logCreate: true, logUpdate: true, logDelete: true, excludeFields: [] }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const auditLogger = AuditLogger.getInstance()
      
      if (!auditLogger.isEnabled()) {
        return originalMethod.apply(this, args)
      }

      const request = args[0] // Assuming first argument is the request
      const user = request?.user
      const recordId = args[1]?.id || args[1]?.params?.id

      try {
        const result = await originalMethod.apply(this, args)

        // Log the action based on the method name
        const methodName = propertyKey.toLowerCase()
        let action: 'CREATE' | 'UPDATE' | 'DELETE' | undefined

        if (methodName.includes('create') && options.logCreate) {
          action = 'CREATE'
        } else if (methodName.includes('update') && options.logUpdate) {
          action = 'UPDATE'
        } else if (methodName.includes('delete') && options.logDelete) {
          action = 'DELETE'
        }

        if (action && options.tableName) {
          await auditLogger.logDataChange(
            options.tableName,
            parseInt(recordId) || 0,
            action,
            undefined, // oldValues - would need to be captured before the operation
            result, // newValues
            user,
            request
          )
        }

        return result
      } catch (error) {
        // Log failed operations
        if (options.tableName) {
          await auditLogger.logDataChange(
            options.tableName,
            parseInt(recordId) || 0,
            'UPDATE', // or appropriate action
            undefined,
            { error: error.message },
            user,
            request
          )
        }
        throw error
      }
    }

    return descriptor
  }
} 