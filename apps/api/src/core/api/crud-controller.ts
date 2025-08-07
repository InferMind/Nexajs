import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { BaseModel } from '@/core/orm/base-model'
import { logger } from '@/utils/logger'
import { ValidationError, NotFoundError } from '@/core/validation/errors'
import { authMiddleware, requirePermission } from '@/core/auth/middleware'

export interface CRUDOptions {
  model: typeof BaseModel
  resource: string
  permissions?: {
    create?: string
    read?: string
    update?: string
    delete?: string
    list?: string
  }
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  pagination?: {
    defaultLimit?: number
    maxLimit?: number
  }
  includes?: string[]
  excludes?: string[]
  transform?: (data: any) => any
  validate?: (data: any) => Promise<boolean>
}

export class CRUDController<T extends BaseModel> {
  private model: typeof BaseModel
  private resource: string
  private options: CRUDOptions

  constructor(options: CRUDOptions) {
    this.model = options.model
    this.resource = options.resource
    this.options = {
      searchable: true,
      filterable: true,
      sortable: true,
      pagination: {
        defaultLimit: 20,
        maxLimit: 100
      },
      ...options
    }
  }

  /**
   * List records with pagination, filtering, and searching
   */
  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const {
        page = 1,
        limit = this.options.pagination?.defaultLimit || 20,
        search,
        filters,
        sort,
        include
      } = request.query as any

      // Validate pagination
      const validatedLimit = Math.min(
        Math.max(1, parseInt(limit) || 20),
        this.options.pagination?.maxLimit || 100
      )
      const validatedPage = Math.max(1, parseInt(page) || 1)
      const skip = (validatedPage - 1) * validatedLimit

      // Build where clause
      const where = this.buildWhereClause(filters, search)

      // Build order by
      const orderBy = this.buildOrderByClause(sort)

      // Build include
      const includeClause = this.buildIncludeClause(include)

      // Execute query
      const [results, total] = await Promise.all([
        this.model.findMany({
          where,
          orderBy,
          skip,
          take: validatedLimit,
          include: includeClause
        }),
        this.model.count({ where })
      ])

      // Transform results if needed
      const transformedResults = this.options.transform ? 
        results.map(this.options.transform) : 
        results

      // Calculate pagination info
      const totalPages = Math.ceil(total / validatedLimit)
      const hasNext = validatedPage < totalPages
      const hasPrev = validatedPage > 1

      reply.send({
        success: true,
        data: transformedResults,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          pages: totalPages,
          hasNext,
          hasPrev
        },
        meta: {
          resource: this.resource,
          filters: filters || {},
          search: search || '',
          sort: sort || {}
        }
      })

    } catch (error) {
      logger.error(`Error listing ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve records'
      })
    }
  }

  /**
   * Get a single record by ID
   */
  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      const { include } = request.query as any

      const recordId = parseInt(id)
      if (isNaN(recordId)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        })
        return
      }

      const includeClause = this.buildIncludeClause(include)
      const record = await this.model.find(recordId)

      if (!record) {
        reply.status(404).send({
          success: false,
          error: 'Not Found',
          message: `${this.resource} with ID ${id} not found`
        })
        return
      }

      const transformedRecord = this.options.transform ? 
        this.options.transform(record) : 
        record

      reply.send({
        success: true,
        data: transformedRecord
      })

    } catch (error) {
      logger.error(`Error getting ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve record'
      })
    }
  }

  /**
   * Create a new record
   */
  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const data = request.body as any

      // Validate data if custom validator is provided
      if (this.options.validate) {
        const isValid = await this.options.validate(data)
        if (!isValid) {
          reply.status(400).send({
            success: false,
            error: 'Validation Error',
            message: 'Data validation failed'
          })
          return
        }
      }

      // Create record
      const record = await this.model.create(data)

      const transformedRecord = this.options.transform ? 
        this.options.transform(record) : 
        record

      reply.status(201).send({
        success: true,
        data: transformedRecord,
        message: `${this.resource} created successfully`
      })

    } catch (error) {
      logger.error(`Error creating ${this.resource}:`, error)
      
      if (error instanceof ValidationError) {
        reply.status(400).send({
          success: false,
          error: 'Validation Error',
          message: error.message
        })
      } else {
        reply.status(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to create record'
        })
      }
    }
  }

  /**
   * Update an existing record
   */
  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      const data = request.body as any

      const recordId = parseInt(id)
      if (isNaN(recordId)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        })
        return
      }

      // Check if record exists
      const existingRecord = await this.model.find(recordId)
      if (!existingRecord) {
        reply.status(404).send({
          success: false,
          error: 'Not Found',
          message: `${this.resource} with ID ${id} not found`
        })
        return
      }

      // Validate data if custom validator is provided
      if (this.options.validate) {
        const isValid = await this.options.validate(data)
        if (!isValid) {
          reply.status(400).send({
            success: false,
            error: 'Validation Error',
            message: 'Data validation failed'
          })
          return
        }
      }

      // Update record
      const updatedRecord = await this.model.update(recordId, data)

      const transformedRecord = this.options.transform ? 
        this.options.transform(updatedRecord) : 
        updatedRecord

      reply.send({
        success: true,
        data: transformedRecord,
        message: `${this.resource} updated successfully`
      })

    } catch (error) {
      logger.error(`Error updating ${this.resource}:`, error)
      
      if (error instanceof ValidationError) {
        reply.status(400).send({
          success: false,
          error: 'Validation Error',
          message: error.message
        })
      } else {
        reply.status(500).send({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to update record'
        })
      }
    }
  }

  /**
   * Delete a record
   */
  async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string }

      const recordId = parseInt(id)
      if (isNaN(recordId)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        })
        return
      }

      // Check if record exists
      const existingRecord = await this.model.find(recordId)
      if (!existingRecord) {
        reply.status(404).send({
          success: false,
          error: 'Not Found',
          message: `${this.resource} with ID ${id} not found`
        })
        return
      }

      // Delete record
      await this.model.delete(recordId)

      reply.send({
        success: true,
        message: `${this.resource} deleted successfully`
      })

    } catch (error) {
      logger.error(`Error deleting ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to delete record'
      })
    }
  }

  /**
   * Bulk operations
   */
  async bulkCreate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { records } = request.body as { records: any[] }

      if (!Array.isArray(records)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid Data',
          message: 'Records must be an array'
        })
        return
      }

      const createdRecords = []
      const errors = []

      for (let i = 0; i < records.length; i++) {
        try {
          const record = await this.model.create(records[i])
          createdRecords.push(record)
        } catch (error) {
          errors.push({
            index: i,
            error: error.message
          })
        }
      }

      reply.status(201).send({
        success: true,
        data: {
          created: createdRecords.length,
          failed: errors.length,
          errors
        },
        message: `Created ${createdRecords.length} records, ${errors.length} failed`
      })

    } catch (error) {
      logger.error(`Error bulk creating ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to create records'
      })
    }
  }

  async bulkUpdate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { updates } = request.body as { updates: Array<{ id: number; data: any }> }

      if (!Array.isArray(updates)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid Data',
          message: 'Updates must be an array'
        })
        return
      }

      const updatedRecords = []
      const errors = []

      for (const update of updates) {
        try {
          const record = await this.model.update(update.id, update.data)
          updatedRecords.push(record)
        } catch (error) {
          errors.push({
            id: update.id,
            error: error.message
          })
        }
      }

      reply.send({
        success: true,
        data: {
          updated: updatedRecords.length,
          failed: errors.length,
          errors
        },
        message: `Updated ${updatedRecords.length} records, ${errors.length} failed`
      })

    } catch (error) {
      logger.error(`Error bulk updating ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update records'
      })
    }
  }

  async bulkDelete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { ids } = request.body as { ids: number[] }

      if (!Array.isArray(ids)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid Data',
          message: 'IDs must be an array'
        })
        return
      }

      const deletedCount = 0
      const errors = []

      for (const id of ids) {
        try {
          await this.model.delete(id)
          deletedCount++
        } catch (error) {
          errors.push({
            id,
            error: error.message
          })
        }
      }

      reply.send({
        success: true,
        data: {
          deleted: deletedCount,
          failed: errors.length,
          errors
        },
        message: `Deleted ${deletedCount} records, ${errors.length} failed`
      })

    } catch (error) {
      logger.error(`Error bulk deleting ${this.resource}:`, error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to delete records'
      })
    }
  }

  /**
   * Helper methods
   */
  private buildWhereClause(filters: any, search: string): any {
    const where: any = {}

    // Apply filters
    if (filters && typeof filters === 'object') {
      Object.assign(where, filters)
    }

    // Apply search if searchable
    if (search && this.options.searchable) {
      const searchFields = this.getSearchableFields()
      if (searchFields.length > 0) {
        where.OR = searchFields.map(field => ({
          [field]: { contains: search, mode: 'insensitive' }
        }))
      }
    }

    return where
  }

  private buildOrderByClause(sort: any): any {
    if (!sort || !this.options.sortable) {
      return { createdAt: 'desc' }
    }

    if (typeof sort === 'string') {
      const [field, order] = sort.split(':')
      return { [field]: order || 'asc' }
    }

    if (typeof sort === 'object') {
      return sort
    }

    return { createdAt: 'desc' }
  }

  private buildIncludeClause(include: any): any {
    if (!include) return undefined

    if (typeof include === 'string') {
      return { [include]: true }
    }

    if (Array.isArray(include)) {
      const includeClause: any = {}
      include.forEach(field => {
        includeClause[field] = true
      })
      return includeClause
    }

    return include
  }

  private getSearchableFields(): string[] {
    // This would typically come from model metadata
    // For now, return common searchable fields
    return ['name', 'code', 'email', 'description']
  }
}

/**
 * Register CRUD routes for a model
 */
export function registerCRUDRoutes(
  app: FastifyInstance,
  path: string,
  options: CRUDOptions
): void {
  const controller = new CRUDController(options)
  const resource = options.resource

  // Apply authentication middleware
  app.addHook('preHandler', authMiddleware)

  // List records
  app.get(path, {
    preHandler: options.permissions?.list ? 
      requirePermission(resource, 'list') : 
      undefined
  }, controller.list.bind(controller))

  // Get single record
  app.get(`${path}/:id`, {
    preHandler: options.permissions?.read ? 
      requirePermission(resource, 'read') : 
      undefined
  }, controller.get.bind(controller))

  // Create record
  app.post(path, {
    preHandler: options.permissions?.create ? 
      requirePermission(resource, 'create') : 
      undefined
  }, controller.create.bind(controller))

  // Update record
  app.put(`${path}/:id`, {
    preHandler: options.permissions?.update ? 
      requirePermission(resource, 'update') : 
      undefined
  }, controller.update.bind(controller))

  // Delete record
  app.delete(`${path}/:id`, {
    preHandler: options.permissions?.delete ? 
      requirePermission(resource, 'delete') : 
      undefined
  }, controller.delete.bind(controller))

  // Bulk operations
  app.post(`${path}/bulk`, {
    preHandler: options.permissions?.create ? 
      requirePermission(resource, 'create') : 
      undefined
  }, controller.bulkCreate.bind(controller))

  app.put(`${path}/bulk`, {
    preHandler: options.permissions?.update ? 
      requirePermission(resource, 'update') : 
      undefined
  }, controller.bulkUpdate.bind(controller))

  app.delete(`${path}/bulk`, {
    preHandler: options.permissions?.delete ? 
      requirePermission(resource, 'delete') : 
      undefined
  }, controller.bulkDelete.bind(controller))

  logger.info(`Registered CRUD routes for ${resource} at ${path}`)
} 