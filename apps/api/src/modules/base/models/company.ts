import { BaseModel } from '@/core/orm/base-model'
import { Model, Field, PrimaryKey, Required, Unique, Default, Searchable, Filterable, Sortable } from '@/core/orm/decorators'
import { CharField, TextField, BooleanField, DateField, URLField } from '@/core/orm/fields'

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum CompanyType {
  CORPORATION = 'corporation',
  LLC = 'llc',
  PARTNERSHIP = 'partnership',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  NON_PROFIT = 'non_profit',
  GOVERNMENT = 'government',
  OTHER = 'other'
}

@Model({
  tableName: 'companies',
  module: 'base',
  description: 'Company management model',
  displayName: 'Companies',
  icon: 'building',
  category: 'business',
  permissions: {
    create: ['companies:create'],
    read: ['companies:read'],
    update: ['companies:update'],
    delete: ['companies:delete']
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
export class Company extends BaseModel {
  static tableName = 'companies'
  static primaryKey = 'id'

  @PrimaryKey()
  @Field({ type: 'integer', description: 'Unique identifier' })
  id!: number

  @Required()
  @Searchable()
  @Filterable()
  @Sortable()
  @Field({ 
    type: 'string', 
    description: 'Company name',
    validation: { maxLength: 200 }
  })
  name!: string

  @Required()
  @Unique()
  @Searchable()
  @Filterable()
  @Field({ 
    type: 'string', 
    description: 'Company code/identifier',
    validation: { maxLength: 50, pattern: /^[A-Z0-9_-]+$/ }
  })
  code!: string

  @Field({ 
    type: 'text', 
    description: 'Company description'
  })
  description?: string

  @Field({ 
    type: 'url', 
    description: 'Company website URL',
    validation: { maxLength: 500 }
  })
  website?: string

  @Field({ 
    type: 'string', 
    description: 'Company logo URL',
    validation: { maxLength: 500 }
  })
  logo?: string

  @Default(true)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether company is active'
  })
  active!: boolean

  @Default('corporation')
  @Filterable()
  @Field({ 
    type: 'enum', 
    description: 'Company type',
    validation: { enum: ['corporation', 'llc', 'partnership', 'sole_proprietorship', 'non_profit', 'government', 'other'] }
  })
  type!: CompanyType

  @Field({ 
    type: 'string', 
    description: 'Company address',
    validation: { maxLength: 500 }
  })
  address?: string

  @Field({ 
    type: 'string', 
    description: 'Company city',
    validation: { maxLength: 100 }
  })
  city?: string

  @Field({ 
    type: 'string', 
    description: 'Company state/province',
    validation: { maxLength: 100 }
  })
  state?: string

  @Field({ 
    type: 'string', 
    description: 'Company country',
    validation: { maxLength: 100 }
  })
  country?: string

  @Field({ 
    type: 'string', 
    description: 'Company postal code',
    validation: { maxLength: 20 }
  })
  postalCode?: string

  @Field({ 
    type: 'string', 
    description: 'Company phone number',
    validation: { maxLength: 20 }
  })
  phone?: string

  @Field({ 
    type: 'string', 
    description: 'Company email',
    validation: { maxLength: 255, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  })
  email?: string

  @Field({ 
    type: 'string', 
    description: 'Company tax ID',
    validation: { maxLength: 50 }
  })
  taxId?: string

  @Field({ 
    type: 'string', 
    description: 'Company registration number',
    validation: { maxLength: 50 }
  })
  registrationNumber?: string

  @Field({ 
    type: 'datetime', 
    description: 'Company establishment date'
  })
  establishedDate?: Date

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

  // Computed fields
  @Field({ 
    type: 'string', 
    description: 'Company status',
    computed: true
  })
  get status(): CompanyStatus {
    if (!this.active) return CompanyStatus.INACTIVE
    return CompanyStatus.ACTIVE
  }

  @Field({ 
    type: 'string', 
    description: 'Full address',
    computed: true
  })
  get fullAddress(): string {
    const parts = [this.address, this.city, this.state, this.postalCode, this.country]
    return parts.filter(Boolean).join(', ')
  }

  @Field({ 
    type: 'string', 
    description: 'Company display name',
    computed: true
  })
  get displayName(): string {
    return this.name
  }

  // Static methods
  static async findByCode(code: string): Promise<Company | null> {
    return this.findOne({ code })
  }

  static async findActive(): Promise<Company[]> {
    return this.findMany({ where: { active: true } })
  }

  static async findByType(type: CompanyType): Promise<Company[]> {
    return this.findMany({ where: { type } })
  }

  static async findByCountry(country: string): Promise<Company[]> {
    return this.findMany({ where: { country } })
  }

  static async searchCompanies(query: string): Promise<Company[]> {
    return this.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }
    })
  }

  // Instance methods
  async activate(): Promise<void> {
    this.active = true
    await this.save()
  }

  async deactivate(): Promise<void> {
    this.active = false
    await this.save()
  }

  async updateLogo(logoUrl: string): Promise<void> {
    this.logo = logoUrl
    await this.save()
  }

  async updateContactInfo(contactInfo: {
    phone?: string
    email?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }): Promise<void> {
    Object.assign(this, contactInfo)
    await this.save()
  }

  // Business logic methods
  async getEmployeeCount(): Promise<number> {
    // This would typically query related users
    // For now, return a placeholder
    return 0
  }

  async getRevenue(): Promise<number> {
    // This would typically query financial data
    // For now, return a placeholder
    return 0
  }

  async isCompliant(): Promise<boolean> {
    // Check if company has required information
    const requiredFields = [this.name, this.code, this.type]
    return requiredFields.every(field => field && field.toString().trim() !== '')
  }

  async getComplianceStatus(): Promise<{
    isCompliant: boolean
    missingFields: string[]
    warnings: string[]
  }> {
    const missingFields: string[] = []
    const warnings: string[] = []

    if (!this.name) missingFields.push('name')
    if (!this.code) missingFields.push('code')
    if (!this.type) missingFields.push('type')
    if (!this.email) warnings.push('email')
    if (!this.phone) warnings.push('phone')
    if (!this.address) warnings.push('address')

    return {
      isCompliant: missingFields.length === 0,
      missingFields,
      warnings
    }
  }

  // Validation methods
  static async validateCode(code: string): Promise<boolean> {
    const codeRegex = /^[A-Z0-9_-]+$/
    return codeRegex.test(code) && code.length >= 2 && code.length <= 50
  }

  static async validateTaxId(taxId: string): Promise<boolean> {
    // Basic validation - in real implementation, would check format based on country
    return taxId.length >= 5 && taxId.length <= 50
  }

  // Export methods
  toPublicJSON(): Record<string, any> {
    const json = this.toJSON()
    // Remove sensitive fields
    delete json.taxId
    delete json.registrationNumber
    return json
  }

  toBusinessCard(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      website: this.website,
      logo: this.logo,
      phone: this.phone,
      email: this.email,
      address: this.fullAddress
    }
  }
} 