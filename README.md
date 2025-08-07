# NexaJS - Modern ERP Framework

A high-performance, modern ERP framework built with cutting-edge JavaScript technologies. Leveraging Node.js, TypeScript, and modern frameworks, it delivers enterprise-grade functionality with superior developer experience and performance compared to Odoo.

## 🚀 Week 3 Implementation - Advanced Database and System Features

This repository contains the complete Week 3 implementation of the NexaJS framework, which focuses on **Advanced Database and System Features**.

### 📋 What's Implemented in Week 3

#### ✅ Database Migrations and Seeding
- **Automated migrations** with dependency management
- **Data seeding** with environment-specific data
- **Migration rollback** capabilities
- **Seed status tracking** and management
- **Database reset** and cleanup utilities

#### ✅ Audit Logging System
- **Comprehensive audit trails** for all data changes
- **User action tracking** (login, logout, permissions)
- **System event logging** with metadata
- **Audit query interface** with filtering and search
- **Audit statistics** and analytics
- **Export capabilities** (JSON, CSV)

#### ✅ File Management System
- **Secure file uploads** with validation
- **File deduplication** using SHA256 hashing
- **Thumbnail generation** for images
- **File compression** and optimization
- **Metadata tracking** and search
- **File streaming** for downloads
- **Cleanup utilities** for orphaned files

#### ✅ Email Integration
- **Template-based emails** with Handlebars
- **SMTP integration** with multiple providers
- **Email scheduling** and queuing
- **Delivery tracking** and analytics
- **Bulk email** capabilities
- **Email templates** (welcome, password reset, notifications)
- **Email statistics** and reporting

#### ✅ Real-time Updates
- **WebSocket integration** with Socket.io
- **Authenticated connections** with JWT
- **Room-based messaging** for targeted updates
- **Real-time notifications** and data updates
- **Connection management** and monitoring
- **Activity tracking** and cleanup
- **Statistics and analytics**

#### ✅ Advanced Search Engine
- **Full-text search** across multiple models
- **Search suggestions** based on popular queries
- **Relevance scoring** and ranking
- **Search analytics** and trending
- **Filtered search** with multiple criteria
- **Search logs** and performance tracking
- **Index management** and optimization

#### ✅ Enhanced Core Systems
- **Advanced ORM** with relationship handling
- **Model registry** with dynamic registration
- **Authentication system** with RBAC
- **Base module** with comprehensive CRUD
- **API layer** with auto-CRUD generation
- **Validation system** with custom errors
- **Error handling** and logging

### 🏗️ Project Structure

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
│   │   │   │   ├── orm/           # ORM layer (Week 2)
│   │   │   │   ├── registry/      # Model registry (Week 2)
│   │   │   │   ├── auth/          # Authentication (Week 2)
│   │   │   │   ├── validation/    # Data validation (Week 2)
│   │   │   │   ├── database/      # Database migrations & seeding (Week 3)
│   │   │   │   ├── audit/         # Audit logging system (Week 3)
│   │   │   │   ├── files/         # File management system (Week 3)
│   │   │   │   ├── email/         # Email integration (Week 3)
│   │   │   │   ├── realtime/      # Real-time updates (Week 3)
│   │   │   │   ├── search/        # Advanced search engine (Week 3)
│   │   │   │   └── cache/         # Caching layer (Week 2)
│   │   │   ├── modules/           # Business modules
│   │   │   │   └── base/          # Base module (Week 2)
│   │   │   ├── plugins/           # Plugin system (Week 3)
│   │   │   ├── workflow/          # Workflow engine (Week 3)
│   │   │   ├── reports/           # Report system (Week 3)
│   │   │   ├── events/            # Event system (Week 3)
│   │   │   └── utils/             # Utilities
│   │   │       ├── logger.ts      # Structured logging
│   │   │       └── config.ts      # Environment configuration
│   │   ├── prisma/                # Database schema
│   │   │   └── schema.prisma      # Complete database schema
│   │   └── tests/                 # API tests
│   └── web/                       # Frontend web app
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── src/
│       │   ├── app/               # Next.js 14 app router
│       │   ├── components/        # Reusable components
│       │   │   ├── ui/            # Base UI components
│       │   │   ├── forms/         # Form components
│       │   │   ├── layout/        # Layout components
│       │   │   └── business/      # Business components
│       │   ├── lib/               # Utilities and configs
│       │   ├── hooks/             # Custom React hooks
│       │   ├── store/             # State management
│       │   └── types/             # TypeScript types
│       └── public/                # Static assets
├── packages/                      # Shared packages
│   └── shared/                    # Shared utilities
│       ├── package.json
│       ├── src/
│       │   ├── types/             # Shared TypeScript types
│       │   ├── utils/             # Shared utilities
│       │   ├── constants/         # Shared constants
│       │   └── validations/       # Shared validations
│       └── index.ts
└── README.md                      # This file
```

### 🛠️ Technology Stack

#### Backend
- **Runtime**: Node.js 20+ with ES2023 features
- **Framework**: Fastify (fastest Node.js framework)
- **Language**: TypeScript 5.0+ for type safety
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis with ioredis client
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod schema validation
- **Logging**: Winston structured logging
- **Documentation**: Swagger/OpenAPI

#### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI + Heroicons
- **Charts**: Recharts for data visualization
- **Real-time**: Socket.io client

#### Development Tools
- **Package Manager**: pnpm for fast, efficient package management
- **Monorepo**: Turborepo for build system and caching
- **TypeScript**: Full type safety across the stack
- **Docker**: Containerized development environment
- **Testing**: Vitest + Playwright
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with Tailwind plugin

### 🚀 Getting Started

#### Prerequisites
- Node.js 20+ 
- pnpm 8+
- Docker and Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

#### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexajs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment example
   cp apps/api/env.example apps/api/.env
   
   # Edit the .env file with your configuration
   nano apps/api/.env
   ```

4. **Start the development environment**
   ```bash
   # Start all services (database, redis, api, web)
   pnpm run docker:up
   
   # Or start individual services
   pnpm run dev
   ```

5. **Access the applications**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/documentation
   - **Health Check**: http://localhost:3001/health

#### Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm run dev

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Lint code
pnpm run lint

# Type check
pnpm run type-check

# Format code
pnpm run format

# Database operations
pnpm run db:migrate
pnpm run db:seed

# Docker operations
pnpm run docker:up
pnpm run docker:down
```

### 🔌 Week 3 API Endpoints

The Week 3 implementation adds comprehensive API endpoints for advanced features:

#### Database Management
- `GET /api/v1/database/migrations` - Get migration status
- `POST /api/v1/database/migrate` - Run database migrations
- `GET /api/v1/database/seed-status` - Get seeding status

#### Audit Logging
- `GET /api/v1/audit/logs` - Query audit logs with filters
- `GET /api/v1/audit/stats` - Get audit statistics

#### File Management
- `POST /api/v1/files/upload` - Upload files with validation
- `GET /api/v1/files/:id` - Get file information
- `GET /api/v1/files/:id/download` - Download file stream
- `GET /api/v1/files` - Query files with filters

#### Email Integration
- `POST /api/v1/email/send` - Send custom emails
- `POST /api/v1/email/welcome` - Send welcome emails
- `GET /api/v1/email/stats` - Get email statistics

#### Real-time Features
- `GET /api/v1/websocket/stats` - Get WebSocket connection stats

#### Advanced Search
- `GET /api/v1/search` - Full-text search across models
- `GET /api/v1/search/suggestions` - Get search suggestions
- `GET /api/v1/search/analytics` - Get search analytics

### 📊 Database Schema

The Week 3 implementation includes a comprehensive database schema with:

#### Core Models
- **Users**: User management with roles and authentication
- **Companies**: Multi-tenant company support
- **Partners**: Customer, supplier, and employee management

#### System Models
- **AuditLog**: Complete audit trail for all operations
- **SystemConfig**: Configuration management
- **Files**: File storage and management with deduplication
- **EmailDelivery**: Email delivery tracking
- **ScheduledEmail**: Email scheduling and queuing
- **SearchLog**: Search analytics and performance tracking
- **Migration**: Database migration tracking
- **Notifications**: User notification system
- **Sessions**: User session management
- **ApiKeys**: API key management

#### Workflow Models
- **WorkflowDefinition**: Workflow templates
- **WorkflowInstance**: Active workflow instances
- **WorkflowHistory**: Workflow execution history

#### Report Models
- **Report**: Report definitions and scheduling
- **ReportExecution**: Report execution tracking

### 🔧 Configuration

The framework includes extensive configuration options:

#### Environment Variables
- **Server**: Port, host, environment
- **Database**: Connection strings, pool settings
- **Redis**: Cache and session storage
- **JWT**: Authentication tokens
- **Security**: CORS, rate limiting, encryption
- **Features**: Feature flags for modules
- **External Services**: Email, storage, AI integration

#### Feature Flags
- Enable/disable modules and features
- Development tools and debugging
- Performance optimizations
- Security settings

### 🧪 Testing Strategy

The framework is designed with comprehensive testing in mind:

#### Backend Testing
- **Unit Tests**: Vitest for fast unit testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Prisma test utilities
- **Performance Tests**: Load testing setup

#### Frontend Testing
- **Component Tests**: React component testing
- **E2E Tests**: Playwright for end-to-end testing
- **Visual Tests**: Screenshot testing
- **Accessibility Tests**: WCAG compliance

### 📈 Performance Features

#### Backend Performance
- **Fastify**: Fastest Node.js web framework
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis-based caching layer
- **Compression**: Response compression
- **Rate Limiting**: API protection

#### Frontend Performance
- **Next.js 14**: Latest performance optimizations
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js image optimization
- **Caching**: React Query caching
- **Virtualization**: Large list optimization

### 🔒 Security Features

#### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions
- **Session Management**: Secure session handling
- **API Keys**: Programmatic access control

#### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Cross-site request forgery protection

#### Infrastructure Security
- **HTTPS**: Secure communication
- **Rate Limiting**: API abuse prevention
- **Audit Logging**: Complete activity tracking
- **Encryption**: Data encryption at rest and in transit

### 🌟 Key Advantages Over Odoo

#### Performance
- **5-10x faster** than Python for I/O operations
- **Modern JavaScript** with V8 engine optimizations
- **Async/await** throughout the stack
- **Connection pooling** for efficient resource usage

#### Developer Experience
- **TypeScript**: Full type safety and IntelliSense
- **Hot Reloading**: Instant development feedback
- **Modern Tooling**: ESLint, Prettier, Vitest
- **Component-Based**: Reusable UI components

#### Architecture
- **Microservices Ready**: Easy service separation
- **API-First**: RESTful APIs with OpenAPI docs
- **Real-time**: WebSocket integration
- **Mobile Ready**: React Native support

#### Scalability
- **Horizontal Scaling**: Load balancer ready
- **Caching**: Redis integration
- **Queue System**: Background job processing
- **CDN Ready**: Static asset optimization

### 📅 Development Roadmap

#### Week 1 ✅ (Completed)
- [x] Project initialization
- [x] Monorepo setup
- [x] Backend foundation
- [x] Frontend foundation
- [x] Database schema
- [x] Development environment

#### Week 2 ✅ (Completed)
- [x] Core ORM system
- [x] Model registry
- [x] Authentication system
- [x] Base module implementation
- [x] API layer with auto-CRUD

#### Week 3 ✅ (Current)
- [x] Database migrations and seeding
- [x] Audit logging system
- [x] File management system
- [x] Email integration
- [x] Real-time updates with WebSocket
- [x] Advanced search engine
- [x] Enhanced core systems

#### Week 4 (Next)
- [ ] Plugin architecture
- [ ] Workflow engine
- [ ] Report system
- [ ] Advanced UI components
- [ ] Performance optimizations

### 🤝 Contributing

This is Week 1 of a comprehensive ERP framework implementation. The project follows modern development practices:

#### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

#### Development Workflow
- **Feature Branches**: Git flow workflow
- **Code Review**: Pull request reviews
- **Testing**: Comprehensive test coverage
- **Documentation**: Inline and external docs

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 🆘 Support

For support and questions:
- **Documentation**: Check the `/docs` directory
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: support@nexajs.com

---

**NexaJS** - Building the future of ERP systems with modern JavaScript technologies. 🚀 