# NexaJS - Modern ERP Framework in JavaScript

## Project Overview

**NexaJS** is a high-performance, modern ERP framework built with cutting-edge JavaScript technologies. Leveraging Node.js, TypeScript, and modern frameworks, it delivers enterprise-grade functionality with superior developer experience and performance compared to Odoo.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 20+ with ES2023 features
- **Language**: TypeScript 5.0+ for type safety
- **Backend Framework**: Fastify (fastest Node.js framework)
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Next.js 14 with React 18
- **Real-time**: Socket.io for WebSocket communication
- **Caching**: Redis with ioredis client
- **Queue**: Bull Queue with Redis
- **Testing**: Vitest + Playwright
- **Deployment**: Docker + Kubernetes

## Project Architecture

```
nexajs/
├── package.json                    # Root package configuration
├── turbo.json                     # Turborepo configuration
├── docker-compose.yml             # Development environment
├── apps/
│   ├── api/                       # Backend API server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts           # Server entry point
│   │   │   ├── app.ts             # Fastify app setup
│   │   │   ├── core/              # Core framework
│   │   │   │   ├── orm/           # ORM layer
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── model.ts   # Base model class
│   │   │   │   │   ├── fields.ts  # Field definitions
│   │   │   │   │   ├── query.ts   # Query builder
│   │   │   │   │   └── relations.ts # Relationships
│   │   │   │   ├── registry/      # Model registry
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── models.ts
│   │   │   │   │   └── modules.ts
│   │   │   │   ├── auth/          # Authentication
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── jwt.ts
│   │   │   │   │   ├── rbac.ts
│   │   │   │   │   └── middleware.ts
│   │   │   │   ├── validation/    # Data validation
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── schemas.ts
│   │   │   │   │   └── decorators.ts
│   │   │   │   └── cache/         # Caching layer
│   │   │   │       ├── index.ts
│   │   │   │       ├── redis.ts
│   │   │   │       └── memory.ts
│   │   │   ├── modules/           # Business modules
│   │   │   │   ├── base/          # Base module
│   │   │   │   │   ├── models/
│   │   │   │   │   │   ├── User.ts
│   │   │   │   │   │   ├── Partner.ts
│   │   │   │   │   │   └── Company.ts
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   ├── users.ts
│   │   │   │   │   │   └── partners.ts
│   │   │   │   │   └── services/
│   │   │   │   │       ├── UserService.ts
│   │   │   │   │       └── PartnerService.ts
│   │   │   │   ├── crm/           # CRM module
│   │   │   │   ├── sales/         # Sales module
│   │   │   │   ├── inventory/     # Inventory module
│   │   │   │   └── accounting/    # Accounting module
│   │   │   ├── plugins/           # Plugin system
│   │   │   │   ├── index.ts
│   │   │   │   ├── loader.ts
│   │   │   │   └── manager.ts
│   │   │   ├── workflow/          # Workflow engine
│   │   │   │   ├── index.ts
│   │   │   │   ├── engine.ts
│   │   │   │   ├── state.ts
│   │   │   │   └── transitions.ts
│   │   │   ├── reports/           # Report system
│   │   │   │   ├── index.ts
│   │   │   │   ├── generator.ts
│   │   │   │   ├── templates/
│   │   │   │   └── formats/
│   │   │   ├── events/            # Event system
│   │   │   │   ├── index.ts
│   │   │   │   ├── emitter.ts
│   │   │   │   └── handlers/
│   │   │   └── utils/             # Utilities
│   │   │       ├── logger.ts
│   │   │       ├── config.ts
│   │   │       └── helpers.ts
│   │   ├── prisma/                # Database schema
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── tests/                 # API tests
│   │       ├── unit/
│   │       ├── integration/
│   │       └── fixtures/
│   ├── web/                       # Frontend web app
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── src/
│   │   │   ├── app/               # Next.js 14 app router
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── crm/
│   │   │   │   ├── sales/
│   │   │   │   └── settings/
│   │   │   ├── components/        # Reusable components
│   │   │   │   ├── ui/            # Base UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Table.tsx
│   │   │   │   │   └── Modal.tsx
│   │   │   │   ├── forms/         # Form components
│   │   │   │   │   ├── FormBuilder.tsx
│   │   │   │   │   ├── FieldRenderer.tsx
│   │   │   │   │   └── ValidationDisplay.tsx
│   │   │   │   ├── layout/        # Layout components
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   └── Navigation.tsx
│   │   │   │   └── business/      # Business components
│   │   │   │       ├── PartnerCard.tsx
│   │   │   │       ├── OrderList.tsx
│   │   │   │       └── Dashboard.tsx
│   │   │   ├── lib/               # Utilities and configs
│   │   │   │   ├── api.ts         # API client
│   │   │   │   ├── auth.ts        # Auth utilities
│   │   │   │   ├── utils.ts       # Helper functions
│   │   │   │   └── validations.ts # Form validations
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   │   ├── useApi.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useSocket.ts
│   │   │   │   └── useForm.ts
│   │   │   ├── store/             # State management
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── ui.ts
│   │   │   │   └── modules/
│   │   │   └── types/             # TypeScript types
│   │   │       ├── api.ts
│   │   │       ├── auth.ts
│   │   │       └── models.ts
│   │   └── public/                # Static assets
│   │       ├── icons/
│   │       ├── images/
│   │       └── favicon.ico
│   └── mobile/                    # React Native mobile app
│       ├── package.json
│       ├── App.tsx
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── navigation/
│       │   └── services/
│       └── android/
├── packages/                      # Shared packages
│   ├── shared/                    # Shared utilities
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── types/             # Shared TypeScript types
│   │   │   ├── utils/             # Shared utilities
│   │   │   ├── constants/         # Shared constants
│   │   │   └── validations/       # Shared validations
│   │   └── index.ts
│   ├── ui/                        # Shared UI components
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── styles/
│   │   │   └── hooks/
│   │   └── index.ts
│   └── config/                    # Shared configurations
│       ├── package.json
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── tools/                         # Development tools
│   ├── scripts/                   # Build and deployment scripts
│   ├── generators/                # Code generators
│   └── migrations/                # Database migration tools
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   ├── user-guide/                # User documentation
│   └── developer-guide/           # Developer documentation
└── deployment/                    # Deployment configurations
    ├── docker/
    ├── kubernetes/
    └── terraform/
```

## Core Dependencies

### Backend (API)
```json
{
  "dependencies": {
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^7.2.4",
    "@fastify/multipart": "^8.0.0",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/swagger": "^8.12.0",
    "@prisma/client": "^5.7.1",
    "fastify": "^4.24.3",
    "fastify-plugin": "^4.5.1",
    "ioredis": "^5.3.2",
    "bull": "^4.12.2",
    "socket.io": "^4.7.4",
    "zod": "^3.22.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "puppeteer": "^21.6.1",
    "exceljs": "^4.4.0",
    "pdf-lib": "^1.17.1",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "typescript": "^5.3.3",
    "prisma": "^5.7.1",
    "vitest": "^1.0.4",
    "supertest": "^6.3.3",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2"
  }
}
```

### Frontend (Web)
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.12.2",
    "@tanstack/react-table": "^8.10.7",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "tailwindcss": "^3.3.6",
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "framer-motion": "^10.16.16",
    "socket.io-client": "^4.7.4",
    "recharts": "^2.8.0",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.3.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.4",
    "playwright": "^1.40.1"
  }
}
```

## Implementation Phases

### Phase 1: Foundation Setup (Weeks 1-3)

#### Week 1: Project Initialization
```bash
# Initialize monorepo with Turborepo
npx create-turbo@latest nexajs --package-manager pnpm
cd nexajs

# Setup backend API
mkdir -p apps/api/src
cd apps/api
npm init -y
npm install fastify @fastify/cors @fastify/helmet typescript @types/node

# Setup frontend
cd ../
npx create-next-app@latest web --typescript --tailwind --app
```

#### Week 2: Core Backend Structure
```typescript
// apps/api/src/app.ts
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  })

  // Register plugins
  await app.register(cors, { origin: true })
  await app.register(helmet)
  await app.register(jwt, { secret: process.env.JWT_SECRET! })

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date() }))

  return app
}

// apps/api/src/core/orm/model.ts
export abstract class BaseModel {
  abstract tableName: string
  abstract primaryKey: string
  
  static async find<T extends BaseModel>(this: new() => T, id: number): Promise<T | null> {
    // Implementation
  }
  
  static async findMany<T extends BaseModel>(this: new() => T, where?: any): Promise<T[]> {
    // Implementation
  }
  
  async save(): Promise<this> {
    // Implementation
  }
  
  async delete(): Promise<void> {
    // Implementation
  }
}
```

#### Week 3: Database Setup with Prisma
```prisma
// apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Partner {
  id          Int      @id @default(autoincrement())
  name        String
  email       String?  @unique
  phone       String?
  address     String?
  isCustomer  Boolean  @default(false)
  isSupplier  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("partners")
}

enum Role {
  USER
  ADMIN
  MANAGER
}
```

### Phase 2: Core ORM & API (Weeks 4-6)

#### Week 4: Advanced ORM System
```typescript
// apps/api/src/core/orm/fields.ts
export abstract class Field<T = any> {
  abstract validate(value: T): boolean
  abstract serialize(value: T): any
  abstract deserialize(value: any): T
}

export class CharField extends Field<string> {
  constructor(
    private maxLength?: number,
    private required = false,
    private unique = false
  ) {
    super()
  }
  
  validate(value: string): boolean {
    if (this.required && !value) return false
    if (this.maxLength && value.length > this.maxLength) return false
    return true
  }
  
  serialize(value: string): string {
    return value
  }
  
  deserialize(value: any): string {
    return String(value)
  }
}

export class Many2OneField<T extends BaseModel> extends Field<T | null> {
  constructor(
    private relatedModel: new() => T,
    private foreignKey: string,
    private onDelete: 'CASCADE' | 'SET_NULL' | 'RESTRICT' = 'RESTRICT'
  ) {
    super()
  }
  
  async resolve(id: number): Promise<T | null> {
    return this.relatedModel.find(id)
  }
}

// Model decorator for automatic registration
export function Model(tableName: string) {
  return function <T extends { new(...args: any[]): BaseModel }>(constructor: T) {
    // Register model in registry
    ModelRegistry.register(tableName, constructor)
    return constructor
  }
}
```

#### Week 5: API Layer with Auto-CRUD
```typescript
// apps/api/src/core/api/crud.ts
export class CRUDController<T extends BaseModel> {
  constructor(private model: new() => T) {}
  
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 20, search, filters } = request.query as any
    
    try {
      const results = await this.model.findMany({
        where: this.buildWhere(search, filters),
        skip: (page - 1) * limit,
        take: limit
      })
      
      const total = await this.model.count({
        where: this.buildWhere(search, filters)
      })
      
      return {
        success: true,
        data: results,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      reply.status(500)
      return { success: false, error: error.message }
    }
  }
  
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const instance = new this.model()
      Object.assign(instance, request.body)
      await instance.save()
      
      return { success: true, data: instance }
    } catch (error) {
      reply.status(400)
      return { success: false, error: error.message }
    }
  }
  
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    
    try {
      const instance = await this.model.find(parseInt(id))
      if (!instance) {
        reply.status(404)
        return { success: false, error: 'Record not found' }
      }
      
      Object.assign(instance, request.body)
      await instance.save()
      
      return { success: true, data: instance }
    } catch (error) {
      reply.status(400)
      return { success: false, error: error.message }
    }
  }
  
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    
    try {
      const instance = await this.model.find(parseInt(id))
      if (!instance) {
        reply.status(404)
        return { success: false, error: 'Record not found' }
      }
      
      await instance.delete()
      return { success: true }
    } catch (error) {
      reply.status(400)
      return { success: false, error: error.message }
    }
  }
}

// Auto-register CRUD routes
export function registerCRUDRoutes<T extends BaseModel>(
  app: FastifyInstance,
  path: string,
  model: new() => T
) {
  const controller = new CRUDController(model)
  
  app.get(`${path}`, controller.list.bind(controller))
  app.post(`${path}`, controller.create.bind(controller))
  app.get(`${path}/:id`, controller.get.bind(controller))
  app.put(`${path}/:id`, controller.update.bind(controller))
  app.delete(`${path}/:id`, controller.delete.bind(controller))
}
```

#### Week 6: Authentication & Authorization
```typescript
// apps/api/src/core/auth/rbac.ts
export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  conditions?: Record<string, any>
}

export class RBACManager {
  private roles = new Map<string, Permission[]>()
  private userRoles = new Map<number, string[]>()
  
  defineRole(roleName: string, permissions: Permission[]) {
    this.roles.set(roleName, permissions)
  }
  
  assignRole(userId: number, roleName: string) {
    const userRoles = this.userRoles.get(userId) || []
    userRoles.push(roleName)
    this.userRoles.set(userId, userRoles)
  }
  
  hasPermission(userId: number, resource: string, action: string): boolean {
    const userRoles = this.userRoles.get(userId) || []
    
    for (const roleName of userRoles) {
      const permissions = this.roles.get(roleName) || []
      const hasPermission = permissions.some(p => 
        p.resource === resource && p.action === action
      )
      if (hasPermission) return true
    }
    
    return false
  }
}

// Authentication middleware
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      reply.status(401)
      return { error: 'No token provided' }
    }
    
    const decoded = request.server.jwt.verify(token) as any
    request.user = decoded
  } catch (error) {
    reply.status(401)
    return { error: 'Invalid token' }
  }
}
```

### Phase 3: Frontend Development (Weeks 7-9)

#### Week 7: Next.js Setup with Modern UI
```typescript
// apps/web/src/lib/api.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  private token: string | null = null
  
  setToken(token: string) {
    this.token = token
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }
    
    const response = await fetch(url, { ...options, headers })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
```

#### Week 8: Component Library & Forms
```typescript
// apps/web/src/components/ui/Table.tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

interface TableProps<T> {
  data: T[]
  columns: any[]
  loading?: boolean
  onRowClick?: (row: T) => void
}

export function Table<T>({ data, columns, loading, onRowClick }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// apps/web/src/components/forms/FormBuilder.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface FormField {
  name: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea'
  label: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: z.ZodSchema
}

interface FormBuilderProps {
  fields: FormField[]
  onSubmit: (data: any) => void
  defaultValues?: Record<string, any>
  loading?: boolean
}

export function FormBuilder({ fields, onSubmit, defaultValues, loading }: FormBuilderProps) {
  const schema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation || z.string()
      return acc
    }, {} as Record<string, z.ZodSchema>)
  )
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              {...register(field.name)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              {...register(field.name)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={4}
            />
          ) : (
            <input
              {...register(field.name)}
              type={field.type}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          )}
          
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.name]?.message}
            </p>
          )}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

#### Week 9: State Management & Real-time Features
```typescript
// apps/web/src/store/index.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        
        login: async (email: string, password: string) => {
          try {
            const response = await apiClient.post('/auth/login', { email, password })
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
            })
            apiClient.setToken(response.token)
          } catch (error) {
            throw error
          }
        },
        
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false })
          apiClient.setToken('')
        },
      }),
      { name: 'auth-storage' }
    )
  )
)

// apps/web/src/hooks/useSocket.ts
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { token } = useAuthStore()
  
  useEffect(() => {
    if (token) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
        auth: { token }
      })
      
      setSocket(newSocket)
      
      return () => {
        newSocket.close()
      }
    }
  }, [token])
  
  return socket
}
```

### Phase 4: Advanced Features (Weeks 10-12)

#### Week 10: Module System & Plugin Architecture
```typescript
// apps/api/src/core/modules/manager.ts
export interface ModuleDefinition {
  name: string
  version: string
  description: string
  dependencies: string[]
  models: (new() => BaseModel)[]
  routes: (app: FastifyInstance) => void
  hooks: ModuleHooks
}

export interface ModuleHooks {
  beforeInstall?: () => Promise<void>
  afterInstall?: () => Promise<void>
  beforeUninstall?: () => Promise<void>
  afterUninstall?: () => Promise<void>
}

export class ModuleManager {
  private modules = new Map<string, ModuleDefinition>()
  private installedModules = new Set<string>()
  
  register(module: ModuleDefinition) {
    this.modules.set(module.name, module)
  }
  
  async install(moduleName: string): Promise<void> {
    const module = this.modules.get(moduleName)
    if (!module) throw new Error(`Module ${moduleName} not found`)
    
    // Check dependencies
    for (const dep of module.dependencies) {
      if (!this.installedModules.has(dep)) {
        await this.install(dep)
      }
    }
    
    // Run pre-install hooks
    await module.hooks.beforeInstall?.()
    
    // Register models
    for (const Model of module.models) {
      ModelRegistry.register(Model)
    }
    
    // Register routes
    // module.routes(this.app)
    
    // Run post-install hooks
    await module.hooks.afterInstall?.()
    
    this.installedModules.add(moduleName)
  }
  
  async uninstall(moduleName: string): Promise<void> {
    const module = this.modules.get(moduleName)
    if (!module) throw new Error(`Module ${moduleName} not found`)
    
    await module.hooks.beforeUninstall?.()
    
    // Unregister models and routes
    // Implementation here
    
    await module.hooks.afterUninstall?.()
    
    this.installedModules.delete(moduleName)
  }
}
```

#### Week 11: Workflow Engine
```typescript
// apps/api/src/core/workflow/engine.ts
export interface WorkflowState {
  name: string
  transitions: WorkflowTransition[]
  actions: WorkflowAction[]
  permissions: string[]
}

export interface WorkflowTransition {
  name: string
  from: string
  to: string
  condition?: (context: any) => boolean
  action?: (context: any) => Promise<void>
}

export interface WorkflowAction {
  name: string
  type: 'email' | 'webhook' | 'function'
  config: Record<string, any>
}

export class WorkflowEngine {
  private workflows = new Map<string, Workflow>()
  
  defineWorkflow(name: string, states: WorkflowState[], initialState: string) {
    const workflow = new Workflow(name, states, initialState)
    this.workflows.set(name, workflow)
  }
  
  async executeTransition(
    workflowName: string,
    recordId: number,
    transitionName: string,
    context: any = {}
  ): Promise<void> {
    const workflow = this.workflows.get(workflowName)
    if (!workflow) throw new Error(`Workflow ${workflowName} not found`)
    
    const currentState = await this.getCurrentState(workflowName, recordId)
    const transition = workflow.getTransition(currentState, transitionName)
    
    if (!transition) {
      throw new Error(`Transition ${transitionName} not available from ${currentState}`)
    }
    
    // Check conditions
    if (transition.condition && !transition.condition(context)) {
      throw new Error('Transition condition not met')
    }
    
    // Execute transition action
    if (transition.action) {
      await transition.action(context)
    }
    
    // Update state
    await this.updateState(workflowName, recordId, transition.to)
    
    // Execute state actions
    const newState = workflow.getState(transition.to)
    for (const action of newState.actions) {
      await this.executeAction(action, context)
    }
  }
  
  private async executeAction(action: WorkflowAction, context: any): Promise<void> {
    switch (action.type) {
      case 'email':
        // Send email
        break
      case 'webhook':
        // Call webhook
        break
      case 'function':
        // Execute function
        break
    }
  }
}
```

#### Week 12: Report System
```typescript
// apps/api/src/core/reports/generator.ts
import puppeteer from 'puppeteer'
import ExcelJS from 'exceljs'

export interface ReportTemplate {
  name: string
  template: string
  format: 'pdf' | 'excel' | 'csv' | 'html'
  parameters: ReportParameter[]
}

export interface ReportParameter {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  required: boolean
  defaultValue?: any
}

export class ReportGenerator {
  async generatePDF(template: string, data: any): Promise<Buffer> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    // Render template with data
    const html = this.renderTemplate(template, data)
    await page.setContent(html)
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    })
    
    await browser.close()
    return pdf
  }
  
  async generateExcel(data: any[], columns: string[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Report')
    
    // Add headers
    worksheet.addRow(columns)
    
    // Add data
    data.forEach(row => {
      const values = columns.map(col => row[col])
      worksheet.addRow(values)
    })
    
    // Style headers
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }
    
    return workbook.xlsx.writeBuffer() as Promise<Buffer>
  }
  
  generateCSV(data: any[], columns: string[]): string {
    const headers = columns.join(',')
    const rows = data.map(row => 
      columns.map(col => `"${row[col] || ''}"`).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }
  
  private renderTemplate(template: string, data: any): string {
    // Simple template rendering - in production use a proper template engine
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || ''
    })
  }
}
```

## Key Advantages Over Odoo

### 1. Performance
- **Node.js Speed**: 5-10x faster than Python for I/O operations
- **Modern JavaScript**: V8 engine optimizations
- **Async/Await**: Non-blocking operations throughout
- **Connection Pooling**: Efficient database connections

### 2. Developer Experience
- **TypeScript**: Full type safety and IntelliSense
- **Hot Reloading**: Instant development feedback
- **Modern Tooling**: ESLint, Prettier, Vitest
- **Component-Based**: Reusable UI components

### 3. Modern Architecture
- **Microservices Ready**: Easy service separation
- **API-First**: RESTful APIs with OpenAPI docs
- **Real-time**: WebSocket integration
- **Mobile Ready**: React Native support

### 4. Scalability
- **Horizontal Scaling**: Load balancer ready
- **Caching**: Redis integration
- **Queue System**: Background job processing
- **CDN Ready**: Static asset optimization

## Success Metrics

### Performance Targets
- **API Response**: < 100ms average
- **Page Load**: < 2 seconds
- **Memory Usage**: < 200MB base
- **Concurrent Users**: > 1000

### Quality Targets
- **Test Coverage**: > 85%
- **TypeScript Coverage**: 100%
- **Accessibility**: WCAG 2.1 AA
- **Security**: OWASP compliance

## Deployment Strategy

### Development
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/nexajs
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=nexajs
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Production
- **Kubernetes**: Container orchestration
- **Docker**: Containerized deployment
- **CI/CD**: GitHub Actions pipeline
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Conclusion

NexaJS provides a modern, high-performance alternative to Odoo using cutting-edge JavaScript technologies. The framework delivers enterprise functionality with superior developer experience, better performance, and modern architectural patterns.

The TypeScript foundation ensures type safety and maintainability, while the modular architecture allows for easy customization and extension. With built-in real-time features, comprehensive testing, and production-ready deployment configurations, NexaJS is designed for modern business needs.