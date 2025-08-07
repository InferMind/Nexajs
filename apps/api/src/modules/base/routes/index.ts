import { FastifyInstance } from 'fastify'
import { registerCRUDRoutes } from '@/core/api/crud-controller'
import { User } from '../models/user'
import { Company } from '../models/company'
import { Partner } from '../models/partner'
import { logger } from '@/utils/logger'

export async function registerBaseRoutes(app: FastifyInstance): Promise<void> {
  logger.info('Registering base module routes...')

  // User routes
  registerCRUDRoutes(app, '/api/v1/users', {
    model: User,
    resource: 'users',
    permissions: {
      create: 'users:create',
      read: 'users:read',
      update: 'users:update',
      delete: 'users:delete',
      list: 'users:list'
    },
    searchable: true,
    filterable: true,
    sortable: true,
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    },
    transform: (user: any) => {
      // Remove sensitive data
      const { password, ...safeUser } = user
      return safeUser
    }
  })

  // Company routes
  registerCRUDRoutes(app, '/api/v1/companies', {
    model: Company,
    resource: 'companies',
    permissions: {
      create: 'companies:create',
      read: 'companies:read',
      update: 'companies:update',
      delete: 'companies:delete',
      list: 'companies:list'
    },
    searchable: true,
    filterable: true,
    sortable: true,
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    },
    transform: (company: any) => {
      // Remove sensitive data
      const { taxId, registrationNumber, ...safeCompany } = company
      return safeCompany
    }
  })

  // Partner routes
  registerCRUDRoutes(app, '/api/v1/partners', {
    model: Partner,
    resource: 'partners',
    permissions: {
      create: 'partners:create',
      read: 'partners:read',
      update: 'partners:update',
      delete: 'partners:delete',
      list: 'partners:list'
    },
    searchable: true,
    filterable: true,
    sortable: true,
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    },
    transform: (partner: any) => {
      // Remove sensitive data
      const { taxId, registrationNumber, ...safePartner } = partner
      return safePartner
    }
  })

  // Additional custom routes for base module
  registerCustomBaseRoutes(app)

  logger.info('Base module routes registered successfully')
}

async function registerCustomBaseRoutes(app: FastifyInstance): Promise<void> {
  // User-specific routes
  app.get('/api/v1/users/me', async (request, reply) => {
    try {
      if (!request.user) {
        reply.status(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated'
        })
        return
      }

      const user = await User.find(request.user.id)
      if (!user) {
        reply.status(404).send({
          success: false,
          error: 'Not Found',
          message: 'User not found'
        })
        return
      }

      reply.send({
        success: true,
        data: user.toPublicJSON()
      })
    } catch (error) {
      logger.error('Error getting current user:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get current user'
      })
    }
  })

  app.put('/api/v1/users/me', async (request, reply) => {
    try {
      if (!request.user) {
        reply.status(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated'
        })
        return
      }

      const data = request.body as any
      const user = await User.update(request.user.id, data)

      reply.send({
        success: true,
        data: user.toPublicJSON(),
        message: 'Profile updated successfully'
      })
    } catch (error) {
      logger.error('Error updating current user:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update profile'
      })
    }
  })

  // Company-specific routes
  app.get('/api/v1/companies/:id/employees', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const companyId = parseInt(id)

      if (isNaN(companyId)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid ID',
          message: 'Company ID must be a valid number'
        })
        return
      }

      const employees = await User.findByCompany(companyId)

      reply.send({
        success: true,
        data: employees.map(user => user.toPublicJSON()),
        meta: {
          companyId,
          count: employees.length
        }
      })
    } catch (error) {
      logger.error('Error getting company employees:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get employees'
      })
    }
  })

  app.get('/api/v1/companies/:id/partners', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const companyId = parseInt(id)

      if (isNaN(companyId)) {
        reply.status(400).send({
          success: false,
          error: 'Invalid ID',
          message: 'Company ID must be a valid number'
        })
        return
      }

      const partners = await Partner.findMany({ where: { companyId } })

      reply.send({
        success: true,
        data: partners.map(partner => partner.toPublicJSON()),
        meta: {
          companyId,
          count: partners.length
        }
      })
    } catch (error) {
      logger.error('Error getting company partners:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get partners'
      })
    }
  })

  // Partner-specific routes
  app.get('/api/v1/partners/customers', async (request, reply) => {
    try {
      const customers = await Partner.findCustomers()

      reply.send({
        success: true,
        data: customers.map(partner => partner.toPublicJSON()),
        meta: {
          count: customers.length
        }
      })
    } catch (error) {
      logger.error('Error getting customers:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get customers'
      })
    }
  })

  app.get('/api/v1/partners/suppliers', async (request, reply) => {
    try {
      const suppliers = await Partner.findSuppliers()

      reply.send({
        success: true,
        data: suppliers.map(partner => partner.toPublicJSON()),
        meta: {
          count: suppliers.length
        }
      })
    } catch (error) {
      logger.error('Error getting suppliers:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get suppliers'
      })
    }
  })

  app.get('/api/v1/partners/employees', async (request, reply) => {
    try {
      const employees = await Partner.findEmployees()

      reply.send({
        success: true,
        data: employees.map(partner => partner.toPublicJSON()),
        meta: {
          count: employees.length
        }
      })
    } catch (error) {
      logger.error('Error getting employees:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get employees'
      })
    }
  })

  // Search routes
  app.get('/api/v1/search/users', async (request, reply) => {
    try {
      const { q } = request.query as { q: string }

      if (!q) {
        reply.status(400).send({
          success: false,
          error: 'Missing Query',
          message: 'Search query is required'
        })
        return
      }

      const users = await User.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } }
          ]
        }
      })

      reply.send({
        success: true,
        data: users.map(user => user.toPublicJSON()),
        meta: {
          query: q,
          count: users.length
        }
      })
    } catch (error) {
      logger.error('Error searching users:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to search users'
      })
    }
  })

  app.get('/api/v1/search/partners', async (request, reply) => {
    try {
      const { q } = request.query as { q: string }

      if (!q) {
        reply.status(400).send({
          success: false,
          error: 'Missing Query',
          message: 'Search query is required'
        })
        return
      }

      const partners = await Partner.searchPartners(q)

      reply.send({
        success: true,
        data: partners.map(partner => partner.toPublicJSON()),
        meta: {
          query: q,
          count: partners.length
        }
      })
    } catch (error) {
      logger.error('Error searching partners:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to search partners'
      })
    }
  })

  // Statistics routes
  app.get('/api/v1/stats/users', async (request, reply) => {
    try {
      const [total, active, inactive] = await Promise.all([
        User.count(),
        User.count({ where: { active: true } }),
        User.count({ where: { active: false } })
      ])

      reply.send({
        success: true,
        data: {
          total,
          active,
          inactive,
          activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
        }
      })
    } catch (error) {
      logger.error('Error getting user statistics:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get user statistics'
      })
    }
  })

  app.get('/api/v1/stats/partners', async (request, reply) => {
    try {
      const [total, customers, suppliers, employees] = await Promise.all([
        Partner.count(),
        Partner.count({ where: { isCustomer: true } }),
        Partner.count({ where: { isSupplier: true } }),
        Partner.count({ where: { isEmployee: true } })
      ])

      reply.send({
        success: true,
        data: {
          total,
          customers,
          suppliers,
          employees,
          customersPercentage: total > 0 ? Math.round((customers / total) * 100) : 0,
          suppliersPercentage: total > 0 ? Math.round((suppliers / total) * 100) : 0,
          employeesPercentage: total > 0 ? Math.round((employees / total) * 100) : 0
        }
      })
    } catch (error) {
      logger.error('Error getting partner statistics:', error)
      reply.status(500).send({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to get partner statistics'
      })
    }
  })

  logger.info('Custom base module routes registered successfully')
} 