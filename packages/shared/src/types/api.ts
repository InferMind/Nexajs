// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// API Request Types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  search?: string
  filters?: Record<string, any>
}

export interface CreateRequest<T = any> {
  data: T
}

export interface UpdateRequest<T = any> {
  id: number | string
  data: Partial<T>
}

export interface DeleteRequest {
  id: number | string
}

// API Endpoints
export interface ApiEndpoints {
  auth: {
    login: string
    logout: string
    refresh: string
    register: string
    forgotPassword: string
    resetPassword: string
  }
  users: {
    list: string
    create: string
    get: string
    update: string
    delete: string
    profile: string
  }
  partners: {
    list: string
    create: string
    get: string
    update: string
    delete: string
  }
  companies: {
    list: string
    create: string
    get: string
    update: string
    delete: string
  }
  files: {
    upload: string
    download: string
    delete: string
  }
  reports: {
    list: string
    create: string
    generate: string
    download: string
  }
  workflows: {
    list: string
    create: string
    execute: string
    history: string
  }
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

// API Configuration
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
  withCredentials: boolean
}

// Request/Response Interceptors
export interface RequestInterceptor {
  onRequest?: (config: any) => any
  onRequestError?: (error: any) => any
}

export interface ResponseInterceptor {
  onResponse?: (response: any) => any
  onResponseError?: (error: any) => any
}

// API Client Interface
export interface ApiClient {
  get<T>(url: string, config?: any): Promise<ApiResponse<T>>
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
  patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>
  upload<T>(url: string, file: File, config?: any): Promise<ApiResponse<T>>
  download(url: string, config?: any): Promise<Blob>
}

// WebSocket Types
export interface WebSocketMessage<T = any> {
  type: string
  data: T
  timestamp: string
  id?: string
}

export interface WebSocketConfig {
  url: string
  protocols?: string | string[]
  options?: {
    reconnect?: boolean
    reconnectInterval?: number
    maxReconnectAttempts?: number
  }
}

// Real-time Events
export interface RealTimeEvent {
  type: string
  payload: any
  timestamp: string
  userId?: string
  sessionId?: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
  readAt?: string
}

// File Upload Types
export interface FileUpload {
  file: File
  progress?: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}

export interface FileUploadConfig {
  maxSize: number
  allowedTypes: string[]
  multiple: boolean
  autoUpload: boolean
}

// Export all types
export type {
  ApiResponse,
  PaginationInfo,
  ApiError,
  PaginationParams,
  SearchParams,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  ApiEndpoints,
  HttpMethod,
  ApiConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ApiClient,
  WebSocketMessage,
  WebSocketConfig,
  RealTimeEvent,
  Notification,
  FileUpload,
  FileUploadConfig,
} 