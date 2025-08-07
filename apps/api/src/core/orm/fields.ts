import { ValidationError } from '@/core/validation/errors'

export interface FieldConfig {
  required?: boolean
  unique?: boolean
  default?: any
  validator?: (value: any) => boolean | Promise<boolean>
  transform?: (value: any) => any
}

export abstract class Field<T = any> {
  protected config: FieldConfig

  constructor(config: FieldConfig = {}) {
    this.config = {
      required: false,
      unique: false,
      ...config
    }
  }

  abstract validate(value: T): T | Promise<T>
  abstract serialize(value: T): any
  abstract deserialize(value: any): T

  async validateWithConfig(value: T): Promise<T> {
    // Check if required
    if (this.config.required && (value === null || value === undefined || value === '')) {
      throw new ValidationError('Field is required')
    }

    // Apply default value if not provided
    if (value === null || value === undefined) {
      if (this.config.default !== undefined) {
        value = this.config.default
      } else {
        return value
      }
    }

    // Apply transform if provided
    if (this.config.transform) {
      value = this.config.transform(value)
    }

    // Apply custom validator if provided
    if (this.config.validator) {
      const isValid = await this.config.validator(value)
      if (!isValid) {
        throw new ValidationError('Custom validation failed')
      }
    }

    // Apply field-specific validation
    return this.validate(value)
  }

  get isRequired(): boolean {
    return this.config.required || false
  }

  get isUnique(): boolean {
    return this.config.unique || false
  }

  get defaultValue(): any {
    return this.config.default
  }
}

// String Field
export class CharField extends Field<string> {
  private maxLength?: number
  private minLength?: number
  private pattern?: RegExp

  constructor(
    maxLength?: number,
    minLength?: number,
    pattern?: RegExp,
    config: FieldConfig = {}
  ) {
    super(config)
    this.maxLength = maxLength
    this.minLength = minLength
    this.pattern = pattern
  }

  validate(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Value must be a string')
    }

    if (this.minLength && value.length < this.minLength) {
      throw new ValidationError(`String must be at least ${this.minLength} characters long`)
    }

    if (this.maxLength && value.length > this.maxLength) {
      throw new ValidationError(`String must be no more than ${this.maxLength} characters long`)
    }

    if (this.pattern && !this.pattern.test(value)) {
      throw new ValidationError('String does not match required pattern')
    }

    return value.trim()
  }

  serialize(value: string): string {
    return value
  }

  deserialize(value: any): string {
    return String(value || '')
  }
}

// Text Field (for long text)
export class TextField extends Field<string> {
  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Value must be a string')
    }
    return value
  }

  serialize(value: string): string {
    return value
  }

  deserialize(value: any): string {
    return String(value || '')
  }
}

// Integer Field
export class IntegerField extends Field<number> {
  private min?: number
  private max?: number

  constructor(min?: number, max?: number, config: FieldConfig = {}) {
    super(config)
    this.min = min
    this.max = max
  }

  validate(value: number): number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new ValidationError('Value must be an integer')
    }

    if (this.min !== undefined && value < this.min) {
      throw new ValidationError(`Value must be at least ${this.min}`)
    }

    if (this.max !== undefined && value > this.max) {
      throw new ValidationError(`Value must be no more than ${this.max}`)
    }

    return value
  }

  serialize(value: number): number {
    return value
  }

  deserialize(value: any): number {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
      throw new ValidationError('Value must be a valid integer')
    }
    return parsed
  }
}

// Float Field
export class FloatField extends Field<number> {
  private min?: number
  private max?: number
  private precision?: number

  constructor(min?: number, max?: number, precision?: number, config: FieldConfig = {}) {
    super(config)
    this.min = min
    this.max = max
    this.precision = precision
  }

  validate(value: number): number {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError('Value must be a number')
    }

    if (this.min !== undefined && value < this.min) {
      throw new ValidationError(`Value must be at least ${this.min}`)
    }

    if (this.max !== undefined && value > this.max) {
      throw new ValidationError(`Value must be no more than ${this.max}`)
    }

    if (this.precision !== undefined) {
      value = Number(value.toFixed(this.precision))
    }

    return value
  }

  serialize(value: number): number {
    return value
  }

  deserialize(value: any): number {
    const parsed = parseFloat(value)
    if (isNaN(parsed)) {
      throw new ValidationError('Value must be a valid number')
    }
    return parsed
  }
}

// Boolean Field
export class BooleanField extends Field<boolean> {
  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: boolean): boolean {
    if (typeof value !== 'boolean') {
      throw new ValidationError('Value must be a boolean')
    }
    return value
  }

  serialize(value: boolean): boolean {
    return value
  }

  deserialize(value: any): boolean {
    if (typeof value === 'boolean') {
      return value
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true'
    }
    if (typeof value === 'number') {
      return value !== 0
    }
    return Boolean(value)
  }
}

// Date Field
export class DateField extends Field<Date> {
  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: Date): Date {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new ValidationError('Value must be a valid date')
    }
    return value
  }

  serialize(value: Date): string {
    return value.toISOString()
  }

  deserialize(value: any): Date {
    if (value instanceof Date) {
      return value
    }
    if (typeof value === 'string') {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        throw new ValidationError('Value must be a valid date string')
      }
      return date
    }
    throw new ValidationError('Value must be a valid date')
  }
}

// Email Field
export class EmailField extends Field<string> {
  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Value must be a string')
    }

    if (!this.emailPattern.test(value)) {
      throw new ValidationError('Value must be a valid email address')
    }

    return value.toLowerCase().trim()
  }

  serialize(value: string): string {
    return value
  }

  deserialize(value: any): string {
    return String(value || '')
  }
}

// URL Field
export class URLField extends Field<string> {
  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Value must be a string')
    }

    try {
      new URL(value)
    } catch {
      throw new ValidationError('Value must be a valid URL')
    }

    return value.trim()
  }

  serialize(value: string): string {
    return value
  }

  deserialize(value: any): string {
    return String(value || '')
  }
}

// JSON Field
export class JSONField extends Field<any> {
  constructor(config: FieldConfig = {}) {
    super(config)
  }

  validate(value: any): any {
    if (value === null || value === undefined) {
      return value
    }

    // Ensure it's serializable
    try {
      JSON.stringify(value)
    } catch {
      throw new ValidationError('Value must be JSON serializable')
    }

    return value
  }

  serialize(value: any): string {
    return JSON.stringify(value)
  }

  deserialize(value: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch {
        throw new ValidationError('Value must be valid JSON')
      }
    }
    return value
  }
}

// Enum Field
export class EnumField<T extends string> extends Field<T> {
  private allowedValues: T[]

  constructor(allowedValues: T[], config: FieldConfig = {}) {
    super(config)
    this.allowedValues = allowedValues
  }

  validate(value: T): T {
    if (!this.allowedValues.includes(value)) {
      throw new ValidationError(`Value must be one of: ${this.allowedValues.join(', ')}`)
    }
    return value
  }

  serialize(value: T): string {
    return value
  }

  deserialize(value: any): T {
    const strValue = String(value)
    if (!this.allowedValues.includes(strValue as T)) {
      throw new ValidationError(`Value must be one of: ${this.allowedValues.join(', ')}`)
    }
    return strValue as T
  }
}

// Foreign Key Field
export class ForeignKeyField<T extends any> extends Field<number> {
  private relatedModel: new() => T
  private onDelete: 'CASCADE' | 'SET_NULL' | 'RESTRICT'

  constructor(
    relatedModel: new() => T,
    onDelete: 'CASCADE' | 'SET_NULL' | 'RESTRICT' = 'RESTRICT',
    config: FieldConfig = {}
  ) {
    super(config)
    this.relatedModel = relatedModel
    this.onDelete = onDelete
  }

  validate(value: number): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      throw new ValidationError('Value must be a positive integer')
    }
    return value
  }

  serialize(value: number): number {
    return value
  }

  deserialize(value: any): number {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed) || parsed <= 0) {
      throw new ValidationError('Value must be a valid positive integer')
    }
    return parsed
  }

  async loadRelated(id: number): Promise<T | null> {
    return this.relatedModel.find(id)
  }
}

// Many-to-Many Field
export class ManyToManyField<T extends any> extends Field<number[]> {
  private relatedModel: new() => T
  private throughTable: string

  constructor(
    relatedModel: new() => T,
    throughTable: string,
    config: FieldConfig = {}
  ) {
    super(config)
    this.relatedModel = relatedModel
    this.throughTable = throughTable
  }

  validate(value: number[]): number[] {
    if (!Array.isArray(value)) {
      throw new ValidationError('Value must be an array')
    }

    for (const id of value) {
      if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
        throw new ValidationError('All values must be positive integers')
      }
    }

    return value
  }

  serialize(value: number[]): number[] {
    return value
  }

  deserialize(value: any): number[] {
    if (Array.isArray(value)) {
      return value.map(v => {
        const parsed = parseInt(v, 10)
        if (isNaN(parsed) || parsed <= 0) {
          throw new ValidationError('All values must be valid positive integers')
        }
        return parsed
      })
    }
    return []
  }

  async loadRelated(ids: number[]): Promise<T[]> {
    if (ids.length === 0) return []
    
    const results = await this.relatedModel.findMany({
      where: {
        id: { in: ids }
      }
    })
    
    return results
  }
} 