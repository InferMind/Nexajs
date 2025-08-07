import { BaseModel } from '@/core/orm/base-model'
import { Model, Field, PrimaryKey, Required, Unique, Default, Searchable, Filterable, Sortable } from '@/core/orm/decorators'
import { CharField, TextField, BooleanField, DateField, EmailField, URLField } from '@/core/orm/fields'

export enum PartnerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum PartnerType {
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
  EMPLOYEE = 'employee',
  VENDOR = 'vendor',
  CONTRACTOR = 'contractor',
  PARTNER = 'partner',
  OTHER = 'other'
}

@Model({
  tableName: 'partners',
  module: 'base',
  description: 'Partner management model',
  displayName: 'Partners',
  icon: 'users',
  category: 'business',
  permissions: {
    create: ['partners:create'],
    read: ['partners:read'],
    update: ['partners:update'],
    delete: ['partners:delete']
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
export class Partner extends BaseModel {
  static tableName = 'partners'
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
    description: 'Partner name',
    validation: { maxLength: 200 }
  })
  name!: string

  @Required()
  @Unique()
  @Searchable()
  @Filterable()
  @Field({ 
    type: 'string', 
    description: 'Partner code/identifier',
    validation: { maxLength: 50, pattern: /^[A-Z0-9_-]+$/ }
  })
  code!: string

  @Field({ 
    type: 'email', 
    description: 'Partner email address',
    validation: { maxLength: 255 }
  })
  email?: string

  @Field({ 
    type: 'string', 
    description: 'Partner phone number',
    validation: { maxLength: 20 }
  })
  phone?: string

  @Field({ 
    type: 'string', 
    description: 'Partner address',
    validation: { maxLength: 500 }
  })
  address?: string

  @Field({ 
    type: 'string', 
    description: 'Partner city',
    validation: { maxLength: 100 }
  })
  city?: string

  @Field({ 
    type: 'string', 
    description: 'Partner state/province',
    validation: { maxLength: 100 }
  })
  state?: string

  @Field({ 
    type: 'string', 
    description: 'Partner country',
    validation: { maxLength: 100 }
  })
  country?: string

  @Field({ 
    type: 'string', 
    description: 'Partner postal code',
    validation: { maxLength: 20 }
  })
  postalCode?: string

  @Field({ 
    type: 'url', 
    description: 'Partner website URL',
    validation: { maxLength: 500 }
  })
  website?: string

  @Default(false)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether partner is a customer'
  })
  isCustomer!: boolean

  @Default(false)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether partner is a supplier'
  })
  isSupplier!: boolean

  @Default(false)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether partner is an employee'
  })
  isEmployee!: boolean

  @Default('other')
  @Filterable()
  @Field({ 
    type: 'enum', 
    description: 'Partner type',
    validation: { enum: ['customer', 'supplier', 'employee', 'vendor', 'contractor', 'partner', 'other'] }
  })
  type!: PartnerType

  @Default(true)
  @Filterable()
  @Field({ 
    type: 'boolean', 
    description: 'Whether partner is active'
  })
  active!: boolean

  @Field({ 
    type: 'text', 
    description: 'Partner description'
  })
  description?: string

  @Field({ 
    type: 'string', 
    description: 'Partner tax ID',
    validation: { maxLength: 50 }
  })
  taxId?: string

  @Field({ 
    type: 'string', 
    description: 'Partner registration number',
    validation: { maxLength: 50 }
  })
  registrationNumber?: string

  @Field({ 
    type: 'string', 
    description: 'Partner contact person',
    validation: { maxLength: 100 }
  })
  contactPerson?: string

  @Field({ 
    type: 'string', 
    description: 'Partner contact phone',
    validation: { maxLength: 20 }
  })
  contactPhone?: string

  @Field({ 
    type: 'email', 
    description: 'Partner contact email',
    validation: { maxLength: 255 }
  })
  contactEmail?: string

  @Field({ 
    type: 'datetime', 
    description: 'Partner registration date'
  })
  registrationDate?: Date

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
    description: 'Partner status',
    computed: true
  })
  get status(): PartnerStatus {
    if (!this.active) return PartnerStatus.INACTIVE
    return PartnerStatus.ACTIVE
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
    description: 'Partner display name',
    computed: true
  })
  get displayName(): string {
    return this.name
  }

  @Field({ 
    type: 'array', 
    description: 'Partner categories',
    computed: true
  })
  get categories(): string[] {
    const categories: string[] = []
    if (this.isCustomer) categories.push('customer')
    if (this.isSupplier) categories.push('supplier')
    if (this.isEmployee) categories.push('employee')
    if (this.type !== 'other') categories.push(this.type)
    return categories
  }

  // Static methods
  static async findByCode(code: string): Promise<Partner | null> {
    return this.findOne({ code })
  }

  static async findByEmail(email: string): Promise<Partner | null> {
    return this.findOne({ email })
  }

  static async findActive(): Promise<Partner[]> {
    return this.findMany({ where: { active: true } })
  }

  static async findCustomers(): Promise<Partner[]> {
    return this.findMany({ where: { isCustomer: true } })
  }

  static async findSuppliers(): Promise<Partner[]> {
    return this.findMany({ where: { isSupplier: true } })
  }

  static async findEmployees(): Promise<Partner[]> {
    return this.findMany({ where: { isEmployee: true } })
  }

  static async findByType(type: PartnerType): Promise<Partner[]> {
    return this.findMany({ where: { type } })
  }

  static async findByCountry(country: string): Promise<Partner[]> {
    return this.findMany({ where: { country } })
  }

  static async searchPartners(query: string): Promise<Partner[]> {
    return this.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
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

  async addCategory(category: 'customer' | 'supplier' | 'employee'): Promise<void> {
    switch (category) {
      case 'customer':
        this.isCustomer = true
        break
      case 'supplier':
        this.isSupplier = true
        break
      case 'employee':
        this.isEmployee = true
        break
    }
    await this.save()
  }

  async removeCategory(category: 'customer' | 'supplier' | 'employee'): Promise<void> {
    switch (category) {
      case 'customer':
        this.isCustomer = false
        break
      case 'supplier':
        this.isSupplier = false
        break
      case 'employee':
        this.isEmployee = false
        break
    }
    await this.save()
  }

  async updateContactInfo(contactInfo: {
    contactPerson?: string
    contactPhone?: string
    contactEmail?: string
    phone?: string
    email?: string
  }): Promise<void> {
    Object.assign(this, contactInfo)
    await this.save()
  }

  async updateAddress(addressInfo: {
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }): Promise<void> {
    Object.assign(this, addressInfo)
    await this.save()
  }

  // Business logic methods
  async getTransactionHistory(): Promise<any[]> {
    // This would typically query transaction data
    // For now, return empty array
    return []
  }

  async getTotalRevenue(): Promise<number> {
    // This would typically calculate from transaction history
    // For now, return 0
    return 0
  }

  async getOutstandingBalance(): Promise<number> {
    // This would typically calculate from invoices/payments
    // For now, return 0
    return 0
  }

  async isCompliant(): Promise<boolean> {
    // Check if partner has required information
    const requiredFields = [this.name, this.code]
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

  static async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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
      phone: this.phone,
      email: this.email,
      address: this.fullAddress,
      contactPerson: this.contactPerson,
      categories: this.categories
    }
  }

  toVCard(): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${this.name}`,
      `ORG:${this.name}`,
      this.email ? `EMAIL:${this.email}` : '',
      this.phone ? `TEL:${this.phone}` : '',
      this.address ? `ADR:;;${this.address};${this.city};${this.state};${this.postalCode};${this.country}` : '',
      this.website ? `URL:${this.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')
    
    return vcard
  }
} 