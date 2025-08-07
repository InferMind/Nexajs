import { BaseModel, ModelMetadata } from '@/core/orm/base-model'
import { logger } from '@/utils/logger'

export interface RegistryEntry {
  name: string
  model: typeof BaseModel
  metadata: ModelMetadata
  module: string
  version: string
  dependencies: string[]
}

export class ModelRegistry {
  private static instance: ModelRegistry
  private models = new Map<string, RegistryEntry>()
  private modules = new Map<string, Set<string>>()
  private initialized = false

  private constructor() {}

  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry()
    }
    return ModelRegistry.instance
  }

  /**
   * Register a model in the registry
   */
  register(
    name: string,
    model: typeof BaseModel,
    options: {
      module?: string
      version?: string
      dependencies?: string[]
    } = {}
  ): void {
    if (this.models.has(name)) {
      logger.warn(`Model '${name}' is already registered. Overwriting...`)
    }

    const entry: RegistryEntry = {
      name,
      model,
      metadata: model.getMetadata(),
      module: options.module || 'unknown',
      version: options.version || '1.0.0',
      dependencies: options.dependencies || []
    }

    this.models.set(name, entry)

    // Track module dependencies
    if (entry.module) {
      if (!this.modules.has(entry.module)) {
        this.modules.set(entry.module, new Set())
      }
      this.modules.get(entry.module)!.add(name)
    }

    logger.info(`Registered model: ${name} (${entry.module})`)
  }

  /**
   * Get a model by name
   */
  get(name: string): typeof BaseModel | null {
    const entry = this.models.get(name)
    return entry ? entry.model : null
  }

  /**
   * Get model metadata by name
   */
  getMetadata(name: string): ModelMetadata | null {
    const entry = this.models.get(name)
    return entry ? entry.metadata : null
  }

  /**
   * Get all registered models
   */
  getAll(): RegistryEntry[] {
    return Array.from(this.models.values())
  }

  /**
   * Get all model names
   */
  getNames(): string[] {
    return Array.from(this.models.keys())
  }

  /**
   * Get models by module
   */
  getByModule(module: string): RegistryEntry[] {
    return Array.from(this.models.values()).filter(entry => entry.module === module)
  }

  /**
   * Get all modules
   */
  getModules(): string[] {
    return Array.from(this.modules.keys())
  }

  /**
   * Check if a model is registered
   */
  has(name: string): boolean {
    return this.models.has(name)
  }

  /**
   * Unregister a model
   */
  unregister(name: string): boolean {
    const entry = this.models.get(name)
    if (!entry) {
      return false
    }

    // Remove from module tracking
    if (entry.module && this.modules.has(entry.module)) {
      this.modules.get(entry.module)!.delete(name)
      if (this.modules.get(entry.module)!.size === 0) {
        this.modules.delete(entry.module)
      }
    }

    this.models.delete(name)
    logger.info(`Unregistered model: ${name}`)
    return true
  }

  /**
   * Clear all registered models
   */
  clear(): void {
    this.models.clear()
    this.modules.clear()
    this.initialized = false
    logger.info('Model registry cleared')
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalModels: number
    totalModules: number
    modelsByModule: Record<string, number>
  } {
    const modelsByModule: Record<string, number> = {}
    
    for (const [module, modelNames] of this.modules.entries()) {
      modelsByModule[module] = modelNames.size
    }

    return {
      totalModels: this.models.size,
      totalModules: this.modules.size,
      modelsByModule
    }
  }

  /**
   * Validate model dependencies
   */
  validateDependencies(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const modelNames = this.getNames()

    for (const entry of this.models.values()) {
      for (const dependency of entry.dependencies) {
        if (!modelNames.includes(dependency)) {
          errors.push(`Model '${entry.name}' depends on '${dependency}' which is not registered`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get models with their dependencies
   */
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {}
    
    for (const entry of this.models.values()) {
      graph[entry.name] = entry.dependencies
    }

    return graph
  }

  /**
   * Initialize all models with Prisma client
   */
  initialize(prismaClient: any): void {
    if (this.initialized) {
      logger.warn('Model registry already initialized')
      return
    }

    for (const entry of this.models.values()) {
      entry.model.setPrismaClient(prismaClient)
    }

    this.initialized = true
    logger.info(`Initialized ${this.models.size} models with Prisma client`)
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Get models that extend a specific base class
   */
  getByBaseClass(baseClass: typeof BaseModel): RegistryEntry[] {
    return Array.from(this.models.values()).filter(entry => 
      entry.model.prototype instanceof baseClass
    )
  }

  /**
   * Search models by name pattern
   */
  search(pattern: string | RegExp): RegistryEntry[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern
    
    return Array.from(this.models.values()).filter(entry => 
      regex.test(entry.name)
    )
  }

  /**
   * Export registry state for debugging
   */
  export(): {
    models: Record<string, Omit<RegistryEntry, 'model'>>
    modules: Record<string, string[]>
    stats: ReturnType<ModelRegistry['getStats']>
  } {
    const exportedModels: Record<string, Omit<RegistryEntry, 'model'>> = {}
    
    for (const [name, entry] of this.models.entries()) {
      const { model, ...exportedEntry } = entry
      exportedModels[name] = exportedEntry
    }

    const exportedModules: Record<string, string[]> = {}
    for (const [module, modelNames] of this.modules.entries()) {
      exportedModules[module] = Array.from(modelNames)
    }

    return {
      models: exportedModels,
      modules: exportedModules,
      stats: this.getStats()
    }
  }
}

// Convenience function for registering models
export function registerModel(
  name: string,
  model: typeof BaseModel,
  options?: {
    module?: string
    version?: string
    dependencies?: string[]
  }
): void {
  ModelRegistry.getInstance().register(name, model, options)
}

// Convenience function for getting models
export function getModel(name: string): typeof BaseModel | null {
  return ModelRegistry.getInstance().get(name)
}

// Convenience function for getting all models
export function getAllModels(): RegistryEntry[] {
  return ModelRegistry.getInstance().getAll()
} 