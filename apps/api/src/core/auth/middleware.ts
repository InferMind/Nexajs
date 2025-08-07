import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthenticationError, AuthorizationError } from '@/core/validation/errors'
import { RBACManager } from './rbac'
import { logger } from '@/utils/logger'

export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  role: string
  companyId?: number
  permissions: string[]
  metadata?: Record<string, any>
}

export interface AuthContext {
  user: AuthenticatedUser
  permissions: string[]
  roles: string[]
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser
    authContext?: AuthContext
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and extracts user information
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
      throw new AuthenticationError('No authorization header provided')
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      throw new AuthenticationError('No token provided')
    }

    // Verify JWT token
    const decoded = request.server.jwt.verify(token) as any
    
    if (!decoded || !decoded.userId) {
      throw new AuthenticationError('Invalid token')
    }

    // Extract user information from token
    const user: AuthenticatedUser = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      companyId: decoded.companyId,
      permissions: decoded.permissions || [],
      metadata: decoded.metadata
    }

    // Get RBAC permissions
    const rbac = RBACManager.getInstance()
    const permissions = rbac.getUserPermissions(user.id)
    const userRoles = rbac.getActiveUserRoles(user.id)

    // Create auth context
    const authContext: AuthContext = {
      user,
      permissions: permissions.map(p => `${p.resource}:${p.action}`),
      roles: userRoles.map(ur => ur.roleName)
    }

    // Attach to request
    request.user = user
    request.authContext = authContext

    logger.debug(`Authenticated user: ${user.email} (${user.id})`)

  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`)
    
    if (error instanceof AuthenticationError) {
      reply.status(401).send({
        error: 'Authentication Error',
        message: error.message
      })
    } else {
      reply.status(401).send({
        error: 'Authentication Error',
        message: 'Invalid or expired token'
      })
    }
  }
}

/**
 * Optional authentication middleware
 * Similar to authMiddleware but doesn't fail if no token is provided
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
      return // Continue without authentication
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return // Continue without authentication
    }

    // Verify JWT token
    const decoded = request.server.jwt.verify(token) as any
    
    if (!decoded || !decoded.userId) {
      return // Continue without authentication
    }

    // Extract user information from token
    const user: AuthenticatedUser = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      companyId: decoded.companyId,
      permissions: decoded.permissions || [],
      metadata: decoded.metadata
    }

    // Get RBAC permissions
    const rbac = RBACManager.getInstance()
    const permissions = rbac.getUserPermissions(user.id)
    const userRoles = rbac.getActiveUserRoles(user.id)

    // Create auth context
    const authContext: AuthContext = {
      user,
      permissions: permissions.map(p => `${p.resource}:${p.action}`),
      roles: userRoles.map(ur => ur.roleName)
    }

    // Attach to request
    request.user = user
    request.authContext = authContext

    logger.debug(`Optional authentication successful: ${user.email} (${user.id})`)

  } catch (error) {
    logger.debug(`Optional authentication failed: ${error.message}`)
    // Continue without authentication
  }
}

/**
 * Authorization middleware factory
 * Creates middleware that checks for specific permissions
 */
export function requirePermission(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const rbac = RBACManager.getInstance()
    const hasPermission = rbac.hasPermission(request.user.id, resource, action)

    if (!hasPermission) {
      logger.warn(`Permission denied: ${request.user.email} (${request.user.id}) - ${resource}:${action}`)
      
      reply.status(403).send({
        error: 'Permission Denied',
        message: `Insufficient permissions for ${resource}:${action}`
      })
      return
    }

    logger.debug(`Permission granted: ${request.user.email} (${request.user.id}) - ${resource}:${action}`)
  }
}

/**
 * Authorization middleware factory for multiple permissions
 * User must have ALL specified permissions
 */
export function requireAllPermissions(permissions: Array<{ resource: string; action: string }>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const rbac = RBACManager.getInstance()
    const hasAllPermissions = rbac.hasAllPermissions(request.user.id, permissions)

    if (!hasAllPermissions) {
      const permissionStrings = permissions.map(p => `${p.resource}:${p.action}`).join(', ')
      logger.warn(`Permission denied: ${request.user.email} (${request.user.id}) - ${permissionStrings}`)
      
      reply.status(403).send({
        error: 'Permission Denied',
        message: `Insufficient permissions for: ${permissionStrings}`
      })
      return
    }

    logger.debug(`All permissions granted: ${request.user.email} (${request.user.id})`)
  }
}

/**
 * Authorization middleware factory for multiple permissions
 * User must have ANY of the specified permissions
 */
export function requireAnyPermission(permissions: Array<{ resource: string; action: string }>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const rbac = RBACManager.getInstance()
    const hasAnyPermission = rbac.hasAnyPermission(request.user.id, permissions)

    if (!hasAnyPermission) {
      const permissionStrings = permissions.map(p => `${p.resource}:${p.action}`).join(', ')
      logger.warn(`Permission denied: ${request.user.email} (${request.user.id}) - ${permissionStrings}`)
      
      reply.status(403).send({
        error: 'Permission Denied',
        message: `Insufficient permissions for any of: ${permissionStrings}`
      })
      return
    }

    logger.debug(`Any permission granted: ${request.user.email} (${request.user.id})`)
  }
}

/**
 * Role-based authorization middleware
 * User must have the specified role
 */
export function requireRole(roleName: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const rbac = RBACManager.getInstance()
    const userRoles = rbac.getActiveUserRoles(request.user.id)
    const hasRole = userRoles.some(ur => ur.roleName === roleName)

    if (!hasRole) {
      logger.warn(`Role denied: ${request.user.email} (${request.user.id}) - ${roleName}`)
      
      reply.status(403).send({
        error: 'Role Required',
        message: `User must have role: ${roleName}`
      })
      return
    }

    logger.debug(`Role granted: ${request.user.email} (${request.user.id}) - ${roleName}`)
  }
}

/**
 * Role-based authorization middleware
 * User must have ANY of the specified roles
 */
export function requireAnyRole(roleNames: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const rbac = RBACManager.getInstance()
    const userRoles = rbac.getActiveUserRoles(request.user.id)
    const hasAnyRole = userRoles.some(ur => roleNames.includes(ur.roleName))

    if (!hasAnyRole) {
      logger.warn(`Role denied: ${request.user.email} (${request.user.id}) - ${roleNames.join(', ')}`)
      
      reply.status(403).send({
        error: 'Role Required',
        message: `User must have one of the roles: ${roleNames.join(', ')}`
      })
      return
    }

    logger.debug(`Any role granted: ${request.user.email} (${request.user.id})`)
  }
}

/**
 * Company-based authorization middleware
 * User must belong to the specified company
 */
export function requireCompany(companyId: number) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    if (request.user.companyId !== companyId) {
      logger.warn(`Company access denied: ${request.user.email} (${request.user.id}) - company ${companyId}`)
      
      reply.status(403).send({
        error: 'Company Access Denied',
        message: 'User does not have access to this company'
      })
      return
    }

    logger.debug(`Company access granted: ${request.user.email} (${request.user.id}) - company ${companyId}`)
  }
}

/**
 * Self-access authorization middleware
 * User can only access their own resources
 */
export function requireSelfAccess() {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        error: 'Authentication Required',
        message: 'User must be authenticated'
      })
      return
    }

    const userId = parseInt(request.params?.id || '0')
    
    if (request.user.id !== userId) {
      logger.warn(`Self-access denied: ${request.user.email} (${request.user.id}) - accessing user ${userId}`)
      
      reply.status(403).send({
        error: 'Access Denied',
        message: 'Users can only access their own resources'
      })
      return
    }

    logger.debug(`Self-access granted: ${request.user.email} (${request.user.id})`)
  }
}

/**
 * Rate limiting middleware
 * Limits requests per user/IP
 */
export function rateLimit(options: {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: FastifyRequest) => string
}) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const key = options.keyGenerator ? 
      options.keyGenerator(request) : 
      request.user?.id?.toString() || request.ip

    const now = Date.now()
    const windowStart = now - options.windowMs

    // Clean up old entries
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < windowStart) {
        requests.delete(k)
      }
    }

    const current = requests.get(key)
    
    if (!current || current.resetTime < windowStart) {
      requests.set(key, { count: 1, resetTime: now })
    } else if (current.count >= options.maxRequests) {
      logger.warn(`Rate limit exceeded: ${key}`)
      
      reply.status(429).send({
        error: 'Rate Limit Exceeded',
        message: `Too many requests. Try again in ${Math.ceil((current.resetTime + options.windowMs - now) / 1000)} seconds`
      })
      return
    } else {
      current.count++
    }
  }
} 