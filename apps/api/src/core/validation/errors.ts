export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class FieldValidationError extends ValidationError {
  public field: string

  constructor(field: string, message: string) {
    super(`${field}: ${message}`)
    this.name = 'FieldValidationError'
    this.field = field
  }
}

export class ModelValidationError extends ValidationError {
  public errors: Record<string, string[]>

  constructor(errors: Record<string, string[]>) {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ')
    
    super(`Model validation failed: ${errorMessages}`)
    this.name = 'ModelValidationError'
    this.errors = errors
  }
}

export class RelationshipError extends ValidationError {
  constructor(message: string) {
    super(message)
    this.name = 'RelationshipError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`
    super(message)
    this.name = 'NotFoundError'
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
} 