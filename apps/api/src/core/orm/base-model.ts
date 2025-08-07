import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { ValidationError } from '@/core/validation/errors'

export interface ModelMetadata {
  tableName: string
  primaryKey: string
  fields: Record<string, any>
  relationships: Record<string, any>
  indexes: string[]
  constraints: any[]
}

export abstract class BaseModel {
  abstract tableName: string
  abstract primaryKey: string
  abstract fields: Record<string, any>
  abstract relationships: Record<string, any>

  protected static prisma: PrismaClient
  protected static metadata: ModelMetadata

  // Instance properties
  [key: string]: any

  constructor(data?: Partial<this>) {
    if (data) {
      Object.assign(this, data)
    }
  }

  // Static methods for querying
  static async find<T extends BaseModel>(this: new() => T, id: number): Promise<T | null> {
    try {
      const result = await this.prisma[this.tableName].findUnique({
        where: { [this.primaryKey]: id }
      })
      return result ? new this(result) : null
    } catch (error) {
      logger.error(`Error finding ${this.tableName} with id ${id}:`, error)
      throw error
    }
  }

  static async findMany<T extends BaseModel>(
    this: new() => T, 
    options: {
      where?: any
      orderBy?: any
      skip?: number
      take?: number
      include?: any
    } = {}
  ): Promise<T[]> {
    try {
      const results = await this.prisma[this.tableName].findMany(options)
      return results.map(result => new this(result))
    } catch (error) {
      logger.error(`Error finding many ${this.tableName}:`, error)
      throw error
    }
  }

  static async findOne<T extends BaseModel>(
    this: new() => T, 
    where: any
  ): Promise<T | null> {
    try {
      const result = await this.prisma[this.tableName].findFirst({ where })
      return result ? new this(result) : null
    } catch (error) {
      logger.error(`Error finding one ${this.tableName}:`, error)
      throw error
    }
  }

  static async count<T extends BaseModel>(
    this: new() => T, 
    where?: any
  ): Promise<number> {
    try {
      return await this.prisma[this.tableName].count({ where })
    } catch (error) {
      logger.error(`Error counting ${this.tableName}:`, error)
      throw error
    }
  }

  static async create<T extends BaseModel>(
    this: new() => T, 
    data: Partial<T>
  ): Promise<T> {
    try {
      const validatedData = await this.validateData(data)
      const result = await this.prisma[this.tableName].create({
        data: validatedData
      })
      return new this(result)
    } catch (error) {
      logger.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
  }

  static async update<T extends BaseModel>(
    this: new() => T, 
    id: number, 
    data: Partial<T>
  ): Promise<T> {
    try {
      const validatedData = await this.validateData(data)
      const result = await this.prisma[this.tableName].update({
        where: { [this.primaryKey]: id },
        data: validatedData
      })
      return new this(result)
    } catch (error) {
      logger.error(`Error updating ${this.tableName} with id ${id}:`, error)
      throw error
    }
  }

  static async delete<T extends BaseModel>(
    this: new() => T, 
    id: number
  ): Promise<void> {
    try {
      await this.prisma[this.tableName].delete({
        where: { [this.primaryKey]: id }
      })
    } catch (error) {
      logger.error(`Error deleting ${this.tableName} with id ${id}:`, error)
      throw error
    }
  }

  // Instance methods
  async save(): Promise<this> {
    try {
      const validatedData = await this.constructor.validateData(this)
      
      if (this[this.constructor.primaryKey]) {
        // Update existing record
        const result = await this.constructor.prisma[this.constructor.tableName].update({
          where: { [this.constructor.primaryKey]: this[this.constructor.primaryKey] },
          data: validatedData
        })
        Object.assign(this, result)
      } else {
        // Create new record
        const result = await this.constructor.prisma[this.constructor.tableName].create({
          data: validatedData
        })
        Object.assign(this, result)
      }
      
      return this
    } catch (error) {
      logger.error(`Error saving ${this.constructor.tableName}:`, error)
      throw error
    }
  }

  async delete(): Promise<void> {
    if (!this[this.constructor.primaryKey]) {
      throw new Error('Cannot delete unsaved record')
    }
    
    await this.constructor.delete(this[this.constructor.primaryKey])
  }

  async refresh(): Promise<this> {
    if (!this[this.constructor.primaryKey]) {
      throw new Error('Cannot refresh unsaved record')
    }
    
    const fresh = await this.constructor.find(this[this.constructor.primaryKey])
    if (!fresh) {
      throw new Error('Record no longer exists')
    }
    
    Object.assign(this, fresh)
    return this
  }

  // Validation methods
  static async validateData<T extends BaseModel>(
    this: new() => T, 
    data: Partial<T>
  ): Promise<Partial<T>> {
    const errors: string[] = []
    const validatedData: any = {}

    for (const [fieldName, fieldConfig] of Object.entries(this.fields)) {
      const value = data[fieldName]
      
      if (value !== undefined) {
        try {
          validatedData[fieldName] = await fieldConfig.validate(value)
        } catch (error) {
          errors.push(`${fieldName}: ${error.message}`)
        }
      } else if (fieldConfig.required) {
        errors.push(`${fieldName}: Field is required`)
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(`Validation failed: ${errors.join(', ')}`)
    }

    return validatedData
  }

  async validate(): Promise<boolean> {
    try {
      await this.constructor.validateData(this)
      return true
    } catch (error) {
      return false
    }
  }

  // Relationship methods
  async loadRelationship<T extends BaseModel>(
    relationshipName: string
  ): Promise<T | T[] | null> {
    const relationship = this.constructor.relationships[relationshipName]
    if (!relationship) {
      throw new Error(`Relationship '${relationshipName}' not found`)
    }

    return relationship.load(this)
  }

  // Utility methods
  toJSON(): Record<string, any> {
    const json: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(this)) {
      if (key !== 'constructor' && typeof value !== 'function') {
        json[key] = value
      }
    }
    
    return json
  }

  static setPrismaClient(prisma: PrismaClient): void {
    this.prisma = prisma
  }

  static getMetadata(): ModelMetadata {
    return {
      tableName: this.tableName,
      primaryKey: this.primaryKey,
      fields: this.fields,
      relationships: this.relationships,
      indexes: [],
      constraints: []
    }
  }
} 