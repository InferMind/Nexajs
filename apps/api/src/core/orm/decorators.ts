import { BaseModel } from './base-model'
import { registerModel } from '@/core/registry/model-registry'

export interface ModelOptions {
  tableName?: string
  module?: string
  version?: string
  dependencies?: string[]
  description?: string
  displayName?: string
  icon?: string
  color?: string
  category?: string
  tags?: string[]
  permissions?: {
    create?: string[]
    read?: string[]
    update?: string[]
    delete?: string[]
  }
  features?: {
    searchable?: boolean
    filterable?: boolean
    sortable?: boolean
    exportable?: boolean
    importable?: boolean
    auditable?: boolean
    versioned?: boolean
  }
}

/**
 * Model decorator for automatic registration
 */
export function Model(options: ModelOptions = {}) {
  return function <T extends { new(...args: any[]): BaseModel }>(constructor: T) {
    const tableName = options.tableName || constructor.name.toLowerCase()
    const module = options.module || 'base'
    
    // Register the model in the registry
    registerModel(tableName, constructor, {
      module,
      version: options.version || '1.0.0',
      dependencies: options.dependencies || []
    })

    // Add metadata to the constructor
    constructor.prototype._modelOptions = options
    constructor.prototype._tableName = tableName
    constructor.prototype._module = module

    return constructor
  }
}

/**
 * Field decorator for automatic field registration
 */
export function Field(options: {
  required?: boolean
  unique?: boolean
  default?: any
  description?: string
  displayName?: string
  type?: string
  validation?: any
  transform?: (value: any) => any
  computed?: boolean
  hidden?: boolean
  readonly?: boolean
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
} = {}) {
  return function (target: any, propertyKey: string) {
    // Initialize fields if not exists
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }

    // Register the field
    target.constructor.fields[propertyKey] = {
      ...options,
      name: propertyKey
    }

    // Add getter/setter for computed fields
    if (options.computed) {
      Object.defineProperty(target, propertyKey, {
        get() {
          return this[`_${propertyKey}`]
        },
        set(value) {
          this[`_${propertyKey}`] = value
        },
        enumerable: true,
        configurable: true
      })
    }
  }
}

/**
 * Primary key decorator
 */
export function PrimaryKey() {
  return function (target: any, propertyKey: string) {
    target.constructor.primaryKey = propertyKey
    
    // Mark as required and unique
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      required: true,
      unique: true,
      primary: true
    }
  }
}

/**
 * Required field decorator
 */
export function Required() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      required: true
    }
  }
}

/**
 * Unique field decorator
 */
export function Unique() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      unique: true
    }
  }
}

/**
 * Default value decorator
 */
export function Default(value: any) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      default: value
    }
  }
}

/**
 * Computed field decorator
 */
export function Computed() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      computed: true
    }
  }
}

/**
 * Hidden field decorator (not exposed in API)
 */
export function Hidden() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      hidden: true
    }
  }
}

/**
 * Readonly field decorator
 */
export function Readonly() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      readonly: true
    }
  }
}

/**
 * Searchable field decorator
 */
export function Searchable() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      searchable: true
    }
  }
}

/**
 * Filterable field decorator
 */
export function Filterable() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      filterable: true
    }
  }
}

/**
 * Sortable field decorator
 */
export function Sortable() {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    target.constructor.fields[propertyKey] = {
      ...target.constructor.fields[propertyKey],
      sortable: true
    }
  }
}

/**
 * Relationship decorator
 */
export function Relationship(options: {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'
  model: typeof BaseModel
  foreignKey?: string
  through?: string
  onDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT'
  onUpdate?: 'CASCADE' | 'SET_NULL' | 'RESTRICT'
}) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.relationships) {
      target.constructor.relationships = {}
    }
    
    target.constructor.relationships[propertyKey] = {
      ...options,
      name: propertyKey
    }
  }
}

/**
 * Index decorator
 */
export function Index(fields: string[], options: {
  unique?: boolean
  name?: string
} = {}) {
  return function (target: any) {
    if (!target.indexes) {
      target.indexes = []
    }
    
    target.indexes.push({
      fields,
      unique: options.unique || false,
      name: options.name || `${target.name}_${fields.join('_')}_idx`
    })
  }
}

/**
 * Constraint decorator
 */
export function Constraint(name: string, condition: string) {
  return function (target: any) {
    if (!target.constraints) {
      target.constraints = []
    }
    
    target.constraints.push({
      name,
      condition
    })
  }
}

/**
 * Hook decorator for model lifecycle events
 */
export function Hook(event: 'beforeCreate' | 'afterCreate' | 'beforeUpdate' | 'afterUpdate' | 'beforeDelete' | 'afterDelete') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.constructor.hooks) {
      target.constructor.hooks = {}
    }
    
    if (!target.constructor.hooks[event]) {
      target.constructor.hooks[event] = []
    }
    
    target.constructor.hooks[event].push(descriptor.value)
  }
}

/**
 * Validation decorator
 */
export function Validation(validator: (value: any) => boolean | Promise<boolean>, message?: string) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor.fields) {
      target.constructor.fields = {}
    }
    
    if (!target.constructor.fields[propertyKey]) {
      target.constructor.fields[propertyKey] = {}
    }
    
    if (!target.constructor.fields[propertyKey].validators) {
      target.constructor.fields[propertyKey].validators = []
    }
    
    target.constructor.fields[propertyKey].validators.push({
      validator,
      message: message || 'Validation failed'
    })
  }
} 