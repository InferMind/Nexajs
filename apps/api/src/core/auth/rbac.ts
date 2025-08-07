import { logger } from '@/utils/logger'

export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'list' | 'export' | 'import'
  conditions?: Record<string, any>
  description?: string
}

export interface Role {
  name: string
  description?: string
  permissions: Permission[]
  inherits?: string[]
  metadata?: Record<string, any>
}

export interface UserRole {
  userId: number
  roleName: string
  grantedBy?: number
  grantedAt: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export class RBACManager {
  private static instance: RBACManager
  private roles = new Map<string, Role>()
  private userRoles = new Map<number, UserRole[]>()
  private permissions = new Map<string, Permission>()

  private constructor() {
    this.initializeDefaultRoles()
  }

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager()
    }
    return RBACManager.instance
  }

  /**
   * Initialize default roles and permissions
   */
  private initializeDefaultRoles(): void {
    // Define default permissions
    const defaultPermissions: Permission[] = [
      // User management
      { resource: 'users', action: 'create', description: 'Create new users' },
      { resource: 'users', action: 'read', description: 'View user details' },
      { resource: 'users', action: 'update', description: 'Update user information' },
      { resource: 'users', action: 'delete', description: 'Delete users' },
      { resource: 'users', action: 'list', description: 'List all users' },

      // Company management
      { resource: 'companies', action: 'create', description: 'Create new companies' },
      { resource: 'companies', action: 'read', description: 'View company details' },
      { resource: 'companies', action: 'update', description: 'Update company information' },
      { resource: 'companies', action: 'delete', description: 'Delete companies' },
      { resource: 'companies', action: 'list', description: 'List all companies' },

      // Partner management
      { resource: 'partners', action: 'create', description: 'Create new partners' },
      { resource: 'partners', action: 'read', description: 'View partner details' },
      { resource: 'partners', action: 'update', description: 'Update partner information' },
      { resource: 'partners', action: 'delete', description: 'Delete partners' },
      { resource: 'partners', action: 'list', description: 'List all partners' },

      // System management
      { resource: 'system', action: 'read', description: 'View system information' },
      { resource: 'system', action: 'update', description: 'Update system settings' },

      // Reports
      { resource: 'reports', action: 'read', description: 'View reports' },
      { resource: 'reports', action: 'create', description: 'Create reports' },
      { resource: 'reports', action: 'export', description: 'Export reports' },

      // Audit logs
      { resource: 'audit', action: 'read', description: 'View audit logs' },
      { resource: 'audit', action: 'list', description: 'List audit logs' }
    ]

    // Register default permissions
    for (const permission of defaultPermissions) {
      this.registerPermission(permission)
    }

    // Define default roles
    const defaultRoles: Role[] = [
      {
        name: 'super_admin',
        description: 'Super Administrator with full system access',
        permissions: defaultPermissions,
        metadata: { level: 100 }
      },
      {
        name: 'admin',
        description: 'Administrator with management access',
        permissions: defaultPermissions.filter(p => 
          !['system', 'audit'].includes(p.resource) || p.action === 'read'
        ),
        metadata: { level: 80 }
      },
      {
        name: 'manager',
        description: 'Manager with department-level access',
        permissions: defaultPermissions.filter(p => 
          ['users', 'partners', 'reports'].includes(p.resource) && p.action !== 'delete'
        ),
        metadata: { level: 60 }
      },
      {
        name: 'user',
        description: 'Regular user with basic access',
        permissions: defaultPermissions.filter(p => 
          p.resource === 'partners' && ['read', 'list'].includes(p.action)
        ),
        metadata: { level: 20 }
      },
      {
        name: 'guest',
        description: 'Guest user with read-only access',
        permissions: defaultPermissions.filter(p => 
          p.action === 'read' && ['partners'].includes(p.resource)
        ),
        metadata: { level: 10 }
      }
    ]

    // Register default roles
    for (const role of defaultRoles) {
      this.defineRole(role)
    }
  }

  /**
   * Register a permission
   */
  registerPermission(permission: Permission): void {
    const key = `${permission.resource}:${permission.action}`
    this.permissions.set(key, permission)
    logger.debug(`Registered permission: ${key}`)
  }

  /**
   * Define a role with permissions
   */
  defineRole(role: Role): void {
    this.roles.set(role.name, role)
    logger.info(`Defined role: ${role.name} with ${role.permissions.length} permissions`)
  }

  /**
   * Get a role by name
   */
  getRole(roleName: string): Role | null {
    return this.roles.get(roleName) || null
  }

  /**
   * Get all roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values())
  }

  /**
   * Assign a role to a user
   */
  assignRole(
    userId: number, 
    roleName: string, 
    options: {
      grantedBy?: number
      expiresAt?: Date
      metadata?: Record<string, any>
    } = {}
  ): void {
    const role = this.getRole(roleName)
    if (!role) {
      throw new Error(`Role '${roleName}' does not exist`)
    }

    const userRole: UserRole = {
      userId,
      roleName,
      grantedBy: options.grantedBy,
      grantedAt: new Date(),
      expiresAt: options.expiresAt,
      metadata: options.metadata
    }

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, [])
    }

    this.userRoles.get(userId)!.push(userRole)
    logger.info(`Assigned role '${roleName}' to user ${userId}`)
  }

  /**
   * Remove a role from a user
   */
  removeRole(userId: number, roleName: string): boolean {
    const userRoles = this.userRoles.get(userId)
    if (!userRoles) {
      return false
    }

    const initialLength = userRoles.length
    const filteredRoles = userRoles.filter(ur => ur.roleName !== roleName)
    
    if (filteredRoles.length === initialLength) {
      return false
    }

    this.userRoles.set(userId, filteredRoles)
    logger.info(`Removed role '${roleName}' from user ${userId}`)
    return true
  }

  /**
   * Get all roles for a user
   */
  getUserRoles(userId: number): UserRole[] {
    return this.userRoles.get(userId) || []
  }

  /**
   * Get active roles for a user (not expired)
   */
  getActiveUserRoles(userId: number): UserRole[] {
    const now = new Date()
    return this.getUserRoles(userId).filter(ur => 
      !ur.expiresAt || ur.expiresAt > now
    )
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(
    userId: number, 
    resource: string, 
    action: string,
    context?: Record<string, any>
  ): boolean {
    const activeRoles = this.getActiveUserRoles(userId)
    
    for (const userRole of activeRoles) {
      const role = this.getRole(userRole.roleName)
      if (!role) continue

      // Check direct permissions
      const hasDirectPermission = role.permissions.some(permission => 
        permission.resource === resource && 
        permission.action === action &&
        this.evaluateConditions(permission.conditions, context)
      )

      if (hasDirectPermission) {
        return true
      }

      // Check inherited roles
      if (role.inherits) {
        for (const inheritedRoleName of role.inherits) {
          const inheritedRole = this.getRole(inheritedRoleName)
          if (inheritedRole) {
            const hasInheritedPermission = inheritedRole.permissions.some(permission => 
              permission.resource === resource && 
              permission.action === action &&
              this.evaluateConditions(permission.conditions, context)
            )
            if (hasInheritedPermission) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(
    userId: number, 
    permissions: Array<{ resource: string; action: string }>,
    context?: Record<string, any>
  ): boolean {
    return permissions.some(permission => 
      this.hasPermission(userId, permission.resource, permission.action, context)
    )
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(
    userId: number, 
    permissions: Array<{ resource: string; action: string }>,
    context?: Record<string, any>
  ): boolean {
    return permissions.every(permission => 
      this.hasPermission(userId, permission.resource, permission.action, context)
    )
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(userId: number): Permission[] {
    const permissions = new Set<Permission>()
    const activeRoles = this.getActiveUserRoles(userId)

    for (const userRole of activeRoles) {
      const role = this.getRole(userRole.roleName)
      if (!role) continue

      // Add direct permissions
      role.permissions.forEach(permission => permissions.add(permission))

      // Add inherited permissions
      if (role.inherits) {
        for (const inheritedRoleName of role.inherits) {
          const inheritedRole = this.getRole(inheritedRoleName)
          if (inheritedRole) {
            inheritedRole.permissions.forEach(permission => permissions.add(permission))
          }
        }
      }
    }

    return Array.from(permissions)
  }

  /**
   * Evaluate permission conditions
   */
  private evaluateConditions(
    conditions: Record<string, any> | undefined, 
    context: Record<string, any> | undefined
  ): boolean {
    if (!conditions || !context) {
      return true
    }

    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false
      }
    }

    return true
  }

  /**
   * Create a new role
   */
  createRole(
    name: string,
    description: string,
    permissions: Permission[],
    options: {
      inherits?: string[]
      metadata?: Record<string, any>
    } = {}
  ): Role {
    const role: Role = {
      name,
      description,
      permissions,
      inherits: options.inherits,
      metadata: options.metadata
    }

    this.defineRole(role)
    return role
  }

  /**
   * Update an existing role
   */
  updateRole(name: string, updates: Partial<Role>): boolean {
    const role = this.getRole(name)
    if (!role) {
      return false
    }

    const updatedRole: Role = { ...role, ...updates }
    this.roles.set(name, updatedRole)
    logger.info(`Updated role: ${name}`)
    return true
  }

  /**
   * Delete a role
   */
  deleteRole(name: string): boolean {
    if (name === 'super_admin') {
      throw new Error('Cannot delete super_admin role')
    }

    const deleted = this.roles.delete(name)
    if (deleted) {
      // Remove role from all users
      for (const [userId, userRoles] of this.userRoles.entries()) {
        this.userRoles.set(userId, userRoles.filter(ur => ur.roleName !== name))
      }
      logger.info(`Deleted role: ${name}`)
    }
    return deleted
  }

  /**
   * Get role statistics
   */
  getStats(): {
    totalRoles: number
    totalPermissions: number
    totalUserAssignments: number
    rolesByLevel: Record<string, number>
  } {
    const rolesByLevel: Record<string, number> = {}
    
    for (const role of this.roles.values()) {
      const level = role.metadata?.level || 0
      const levelKey = `level_${level}`
      rolesByLevel[levelKey] = (rolesByLevel[levelKey] || 0) + 1
    }

    const totalUserAssignments = Array.from(this.userRoles.values())
      .reduce((total, userRoles) => total + userRoles.length, 0)

    return {
      totalRoles: this.roles.size,
      totalPermissions: this.permissions.size,
      totalUserAssignments,
      rolesByLevel
    }
  }

  /**
   * Export RBAC configuration
   */
  export(): {
    roles: Role[]
    permissions: Permission[]
    userRoles: Record<number, UserRole[]>
  } {
    return {
      roles: Array.from(this.roles.values()),
      permissions: Array.from(this.permissions.values()),
      userRoles: Object.fromEntries(this.userRoles)
    }
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.roles.clear()
    this.userRoles.clear()
    this.permissions.clear()
    this.initializeDefaultRoles()
  }
} 