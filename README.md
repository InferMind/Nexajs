# Nexa AI Business Hub

> **🚀 AI-Powered Business Assistant Platform**

Nexa is a comprehensive AI business hub that provides intelligent document processing, customer support automation, and sales email generation. Built with modern web technologies and designed for scalability.

![Nexa AI Business Hub](https://img.shields.io/badge/Status-Development-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Database](#-database)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🤖 AI Modules
- **Document Summarizer**: Upload and get AI-powered summaries with key insights
- **Customer Support Assistant**: Automated response generation for support queries
- **Sales Email Writer**: AI-generated personalized sales emails
- **Content Generator**: Create marketing content and business documents

### 🎯 Core Features
- **App Store**: Discover and install new AI modules
- **App Drawer**: Manage all your installed applications
- **Credit System**: Usage-based pricing with flexible plans
- **Analytics Dashboard**: Track usage, performance, and insights
- **Team Collaboration**: Multi-user support with role management
- **API Access**: RESTful API for integrations

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Dark/Light Mode**: Customizable theme preferences
- **Mobile First**: Optimized for all device sizes
- **Real-time Updates**: Live notifications and status updates
- **Accessibility**: WCAG 2.1 compliant interface

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│  (Supabase)     │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • PostgreSQL    │
│ • TypeScript    │    │ • TypeScript    │    │ • Real-time     │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Row Level     │
│ • Zustand       │    │ • Rate Limiting │    │   Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  External APIs  │
                    │                 │
                    │ • OpenAI GPT    │
                    │ • Stripe        │
                    │ • SendGrid      │
                    │ • AWS S3        │
                    └─────────────────┘
```

## 📁 Project Structure

```
nexa/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Main dashboard and modules
│   │   ├── modules/        # Individual AI modules
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and configurations
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/                 # Node.js Backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── tests/             # Backend tests
│   └── package.json       # Backend dependencies
│
├── database/               # Database configurations
│   ├── migrations/        # Database migrations
│   ├── seeds/            # Sample data
│   └── schema.sql        # Database schema
│
├── docs/                   # Documentation
│   ├── API.md            # API documentation
│   ├── DEPLOYMENT.md     # Deployment guide
│   ├── DEVELOPMENT.md    # Development setup
│   └── ARCHITECTURE.md   # System architecture
│
├── scripts/               # Automation scripts
├── docker-compose.yml    # Docker configuration
└── README.md            # This file
```

## 🎨 Frontend

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand (removed for standalone mode)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Key Features
- **Server-Side Rendering**: Optimized performance with Next.js
- **Component Library**: Reusable UI components with consistent design
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript coverage
- **Modern Routing**: App Router with nested layouts

### Component Architecture
```
components/
├── ui/                    # Basic UI Components
│   ├── Button.tsx        # Customizable button component
│   ├── Card.tsx          # Container component with variants
│   ├── Input.tsx         # Form input with validation
│   ├── Modal.tsx         # Accessible modal dialogs
│   ├── Badge.tsx         # Status indicators
│   ├── StatCard.tsx      # Dashboard statistics
│   ├── ProgressBar.tsx   # Progress indicators
│   ├── AppIcon.tsx       # App icons with gradients
│   ├── SearchInput.tsx   # Search with clear functionality
│   ├── LoadingSpinner.tsx # Loading states
│   ├── EmptyState.tsx    # Empty state placeholders
│   └── index.ts          # Component exports
│
└── layout/               # Layout Components
    ├── PageHeader.tsx    # Page headers with breadcrumbs
    └── index.ts          # Layout exports
```

### Pages Structure
```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── globals.css           # Global styles
├── auth/                 # Authentication
│   ├── login/           # Login page
│   └── signup/          # Registration page
├── dashboard/           # Main application
│   ├── page.tsx        # Dashboard home
│   ├── layout.tsx      # Dashboard layout
│   ├── apps/           # App drawer
│   ├── store/          # App store
│   ├── summarizer/     # Document summarizer
│   ├── support/        # Customer support
│   ├── sales/          # Sales email writer
│   ├── billing/        # Billing and credits
│   └── settings/       # User settings
└── modules/            # Individual AI modules
    ├── summarizer/     # Document processing
    ├── support/        # Support automation
    └── sales/          # Email generation
```

### Development Mode
The frontend is currently configured to run in **standalone mode** without backend dependencies:

- **Mock Data**: All data is simulated using `/lib/mockData.ts`
- **No API Calls**: Authentication and data fetching are mocked
- **Environment**: Uses `.env.local` for configuration
- **Hot Reload**: Full development experience with Next.js

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:3000`

## 🔧 Backend

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT + Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **File Storage**: AWS S3 / Supabase Storage
- **Email**: SendGrid
- **Payments**: Stripe
- **AI**: OpenAI GPT-4

### API Structure
```
src/
├── controllers/          # Request handlers
│   ├── auth.ts          # Authentication
│   ├── documents.ts     # Document processing
│   ├── support.ts       # Customer support
│   ├── sales.ts         # Sales emails
│   ├── billing.ts       # Payments and credits
│   └── users.ts         # User management
│
├── middleware/          # Custom middleware
│   ├── auth.ts         # JWT verification
│   ├── rateLimit.ts    # Rate limiting
│   ├── validation.ts   # Input validation
│   └── cors.ts         # CORS configuration
│
├── models/             # Database models
│   ├── User.ts         # User model
│   ├── Document.ts     # Document model
│   ├── Credit.ts       # Credit system
│   └── Module.ts       # AI modules
│
├── routes/             # API routes
│   ├── auth.ts         # /api/auth/*
│   ├── documents.ts    # /api/documents/*
│   ├── support.ts      # /api/support/*
│   ├── sales.ts        # /api/sales/*
│   └── billing.ts      # /api/billing/*
│
├── services/           # Business logic
│   ├── aiService.ts    # OpenAI integration
│   ├── emailService.ts # Email sending
│   ├── fileService.ts  # File handling
│   └── creditService.ts # Credit management
│
└── utils/              # Helper functions
    ├── logger.ts       # Logging utility
    ├── validation.ts   # Input validation
    └── encryption.ts   # Data encryption
```

### API Endpoints

#### Authentication
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
POST   /api/auth/refresh        # Token refresh
POST   /api/auth/logout         # User logout
POST   /api/auth/forgot         # Password reset
```

#### Documents
```
POST   /api/documents/upload    # Upload document
GET    /api/documents          # List documents
GET    /api/documents/:id      # Get document
POST   /api/documents/:id/summarize # Generate summary
DELETE /api/documents/:id      # Delete document
```

#### Support
```
POST   /api/support/query      # Submit support query
GET    /api/support/queries    # List queries
POST   /api/support/respond    # Generate response
PUT    /api/support/:id        # Update query status
```

#### Sales
```
POST   /api/sales/generate     # Generate sales email
GET    /api/sales/templates    # List templates
POST   /api/sales/send         # Send email
GET    /api/sales/history      # Email history
```

#### Billing
```
GET    /api/billing/credits    # Get credit balance
POST   /api/billing/purchase   # Purchase credits
GET    /api/billing/history    # Transaction history
POST   /api/billing/webhook    # Stripe webhook
```

### Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4

# Email Service
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@nexa.ai

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=nexa-documents
```

### Running Backend
```bash
cd backend
npm install
npm run dev
```

Access at: `http://localhost:3001`

## 🗄️ Database

### Database Provider
**Supabase** (PostgreSQL with real-time capabilities)

### Schema Overview
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  credits INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  summary TEXT,
  key_points JSONB,
  action_items JSONB,
  file_type VARCHAR(50),
  file_size INTEGER,
  status VARCHAR(50) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Support queries table
CREATE TABLE support_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Sales emails table
CREATE TABLE sales_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  recipient_email VARCHAR(255),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'purchase', 'usage', 'refund'
  description TEXT,
  module VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI modules table
CREATE TABLE ai_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price_per_use INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  features JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables...
```

### Database Setup
1. Create Supabase project
2. Run schema from `/database/schema.sql`
3. Set up RLS policies
4. Configure environment variables
5. Run seed data (optional)

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**
- **Supabase** account (for full functionality)

### Quick Start (Frontend Only)
```bash
# Clone the repository
git clone https://github.com/your-username/nexa.git
cd nexa

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Full Stack Setup
```bash
# 1. Clone and setup frontend
git clone https://github.com/your-username/nexa.git
cd nexa/frontend
npm install

# 2. Setup backend
cd ../backend
npm install
cp .env.example .env
# Edit .env with your configuration

# 3. Setup database
# Create Supabase project
# Run database/schema.sql
# Configure RLS policies

# 4. Start services
npm run dev:all  # Starts both frontend and backend
```

### Docker Setup
```bash
# Start all services with Docker
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: Configured in docker-compose.yml
```

## 💻 Development

### Development Workflow
1. **Frontend Development**: Use mock data for rapid UI development
2. **Backend Development**: Build APIs with proper validation and error handling
3. **Integration**: Connect frontend to backend APIs
4. **Testing**: Unit tests, integration tests, and E2E tests
5. **Deployment**: Deploy to staging and production environments

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

### Testing Strategy
```bash
# Frontend tests
cd frontend
npm run test        # Jest + React Testing Library
npm run test:e2e    # Playwright E2E tests

# Backend tests
cd backend
npm run test        # Jest + Supertest
npm run test:integration  # Integration tests
```

### Environment Modes

#### Development Mode (Current)
- Frontend runs standalone with mock data
- No backend dependencies required
- Perfect for UI/UX development and exploration

#### Production Mode
- Full stack integration
- Real API calls and database
- Authentication and payment processing
- AI service integration

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### Backend Deployment (Railway/Heroku)
```bash
# Railway deployment
npm install -g @railway/cli
railway login
railway init
railway up

# Heroku deployment
heroku create nexa-api
git push heroku main
```

### Environment Variables (Production)
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend (.env)
NODE_ENV=production
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
```

### Monitoring & Analytics
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Uptime**: Pingdom
- **Logs**: LogRocket

## 📚 API Documentation

### Authentication
All API endpoints (except public ones) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Rate Limiting
- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1000 requests/hour
- **Enterprise**: Custom limits

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Contribution Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Use conventional commit messages

### Pull Request Process
1. Update README.md with details of changes
2. Update the version numbers following SemVer
3. The PR will be merged once you have sign-off from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Setup](docs/DEVELOPMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community discussions and Q&A
- **Discord**: Real-time chat and support
- **Email**: support@nexa.ai

### Commercial Support
For enterprise support, custom development, or consulting services, contact us at enterprise@nexa.ai.

---

## 🎯 Current Status

### ✅ Completed Features
- **Frontend Architecture**: Complete UI/UX with modern design system
- **Component Library**: Reusable components with TypeScript
- **Authentication Pages**: Login and signup with mock authentication
- **Dashboard**: Statistics, quick actions, and recent activities
- **App Drawer**: Module management interface
- **App Store**: Module discovery and installation
- **Document Summarizer**: File upload and processing interface
- **Mock Data System**: Complete development environment

### 🚧 In Development
- **Backend API**: RESTful API with Express.js
- **Database Integration**: Supabase setup and schema
- **AI Services**: OpenAI integration for document processing
- **Payment System**: Stripe integration for credit purchases
- **Real-time Features**: WebSocket connections for live updates

### 📋 Roadmap
- **Mobile App**: React Native application
- **Advanced Analytics**: Business intelligence dashboard
- **Team Features**: Multi-user collaboration
- **API Marketplace**: Third-party integrations
- **White-label Solution**: Customizable branding

---

**Built with ❤️ by the Nexa Team**

*Transforming businesses with AI-powered automation*