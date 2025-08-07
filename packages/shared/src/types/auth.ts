// User Types
export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  active: boolean
  avatar?: string
  phone?: string
  timezone: string
  locale: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
  companyId?: number
  company?: Company
}

export interface Company {
  id: number
  name: string
  code: string
  description?: string
  website?: string
  logo?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// Role Types
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  companyName?: string
  companyCode?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface PasswordReset {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Session Types
export interface Session {
  id: number
  userId: number
  token: string
  ipAddress?: string
  userAgent?: string
  expiresAt: string
  createdAt: string
}

export interface SessionInfo {
  id: string
  ipAddress?: string
  userAgent?: string
  lastActivity: string
  isCurrent: boolean
}

// Permission Types
export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  conditions?: Record<string, any>
}

export interface Role {
  name: string
  description?: string
  permissions: Permission[]
  isSystem?: boolean
}

// API Key Types
export interface ApiKey {
  id: number
  name: string
  key: string
  userId: number
  permissions?: Record<string, any>
  active: boolean
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateApiKeyRequest {
  name: string
  permissions?: Record<string, any>
  expiresAt?: string
}

// Two-Factor Authentication
export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface TwoFactorVerify {
  code: string
  remember?: boolean
}

export interface TwoFactorBackup {
  code: string
}

// OAuth Types
export interface OAuthProvider {
  name: string
  clientId: string
  redirectUri: string
  scope: string[]
}

export interface OAuthCallback {
  code: string
  state?: string
}

// Profile Types
export interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string
  phone?: string
  timezone: string
  locale: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationPreferences
  dashboard: DashboardPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  types: {
    system: boolean
    business: boolean
    security: boolean
  }
}

export interface DashboardPreferences {
  layout: string
  widgets: string[]
  refreshInterval: number
}

// Security Types
export interface SecurityLog {
  id: number
  userId: number
  action: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
  createdAt: string
}

export interface LoginAttempt {
  id: number
  email: string
  ipAddress: string
  userAgent: string
  success: boolean
  failureReason?: string
  createdAt: string
}

// Export all types
export type {
  User,
  Company,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  PasswordReset,
  PasswordResetConfirm,
  ChangePassword,
  Session,
  SessionInfo,
  Permission,
  Role,
  ApiKey,
  CreateApiKeyRequest,
  TwoFactorSetup,
  TwoFactorVerify,
  TwoFactorBackup,
  OAuthProvider,
  OAuthCallback,
  UserProfile,
  UserPreferences,
  NotificationPreferences,
  DashboardPreferences,
  SecurityLog,
  LoginAttempt,
}

export { UserRole } 