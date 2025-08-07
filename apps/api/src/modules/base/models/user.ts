import { BaseModel } from '@/core/orm/base-model'
import { Model, Field, PrimaryKey, Required, Unique, Default, Hidden, Searchable, Filterable, Sortable } from '@/core/orm/decorators'
import { CharField, EmailField, BooleanField, DateField, EnumField, IntegerField } from '@/core/orm/fields'
import { Role } from '@prisma/client'

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

@Model({
  tableName: 'users',
  module: 'base',
  description: 'User management model',
  displayName: 'Users',
  icon: 'user',
  category: 'system',
  permissions: {
    create: ['users:create'],
    read: ['users:read'],
    update: ['users:update'],
    delete: ['users:delete']
  },
  features: {
    searchable: true,
    filterable: true,
    sortable: true,
    exportable: true,
    importable: true,
    auditable: true
  }
})
export class User extends BaseModel {
  static tableName = 'users'
  static primaryKey = 'id'

  @PrimaryKey()
  @Field({ type: 'integer', description: 'Unique identifier' })
  id!: number

  @Required()
  @Unique()
  @Searchable()
  @Filterable()
  @Field({ 
    type: 'string', 
    description: 'User email address',
    validation: { maxLength: 255, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  })
  email!: string

  @Required()
  @Searchable()
  @Filterable()
  @Sortable()
  @Field({ 
    type: 'string', 
    description: 'User full name',
    validation: { maxLength: 100 }
  })
  name!: string

  @Hidden()
  @Field({ 
    type: 'string', 
    description: 'Hashed password',
    validation: { minLength: 6 }
  })
  password!: string

  @Default('USER')
  @Filterable()
  @Sortable()
  @Field({ 
    type: 'enum', 
    description: 'User role',
    validation: { enum: ['USER', 'ADMIN', 'MANAGER', 'SUPER_ADMIN'] }
  })
  role!: Role

  @Default(true)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether user is active'
  })
  active!: boolean

  @Field({ 
    type: 'string', 
    description: 'User avatar URL',
    validation: { maxLength: 500 }
  })
  avatar?: string

  @Field({ 
    type: 'string', 
    description: 'User phone number',
    validation: { maxLength: 20 }
  })
  phone?: string

  @Default('UTC')
  @Field({ 
    type: 'string', 
    description: 'User timezone',
    validation: { maxLength: 50 }
  })
  timezone!: string

  @Default('en')
  @Field({ 
    type: 'string', 
    description: 'User locale',
    validation: { maxLength: 10 }
  })
  locale!: string

  @Field({ 
    type: 'datetime', 
    description: 'Last login timestamp'
  })
  lastLogin?: Date

  @Field({ 
    type: 'datetime', 
    description: 'Account creation timestamp'
  })
  createdAt!: Date

  @Field({ 
    type: 'datetime', 
    description: 'Last update timestamp'
  })
  updatedAt!: Date

  @Field({ 
    type: 'integer', 
    description: 'Associated company ID'
  })
  companyId?: number

  // Computed fields
  @Field({ 
    type: 'string', 
    description: 'User display name',
    computed: true
  })
  get displayName(): string {
    return this.name || this.email
  }

  @Field({ 
    type: 'string', 
    description: 'User status',
    computed: true
  })
  get status(): UserStatus {
    if (!this.active) return UserStatus.INACTIVE
    if (this.lastLogin && Date.now() - this.lastLogin.getTime() > 30 * 24 * 60 * 60 * 1000) {
      return UserStatus.SUSPENDED
    }
    return UserStatus.ACTIVE
  }

  // Static methods
  static async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email })
  }

  static async findActive(): Promise<User[]> {
    return this.findMany({ where: { active: true } })
  }

  static async findByCompany(companyId: number): Promise<User[]> {
    return this.findMany({ where: { companyId } })
  }

  static async findByRole(role: Role): Promise<User[]> {
    return this.findMany({ where: { role } })
  }

  // Instance methods
  async updateLastLogin(): Promise<void> {
    this.lastLogin = new Date()
    await this.save()
  }

  async activate(): Promise<void> {
    this.active = true
    await this.save()
  }

  async deactivate(): Promise<void> {
    this.active = false
    await this.save()
  }

  async changePassword(newPassword: string): Promise<void> {
    // In a real implementation, hash the password
    this.password = newPassword
    await this.save()
  }

  toPublicJSON(): Record<string, any> {
    const json = this.toJSON()
    delete json.password
    return json
  }

  // Validation methods
  static async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static async validatePassword(password: string): Promise<boolean> {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  // Business logic methods
  async canAccessResource(resource: string, action: string): Promise<boolean> {
    // Super admin can access everything
    if (this.role === 'SUPER_ADMIN') return true

    // Admin can access most things except system-level operations
    if (this.role === 'ADMIN' && resource !== 'system') return true

    // Manager can access user and partner management
    if (this.role === 'MANAGER' && ['users', 'partners'].includes(resource)) return true

    // Regular users have limited access
    if (this.role === 'USER' && resource === 'partners' && action === 'read') return true

    return false
  }

  async getPermissions(): Promise<string[]> {
    const permissions: string[] = []

    switch (this.role) {
      case 'SUPER_ADMIN':
        permissions.push('*:*')
        break
      case 'ADMIN':
        permissions.push('users:*', 'partners:*', 'companies:*', 'reports:*')
        break
      case 'MANAGER':
        permissions.push('users:read', 'users:update', 'partners:*', 'reports:read')
        break
      case 'USER':
        permissions.push('partners:read', 'partners:list')
        break
    }

    return permissions
  }
} 