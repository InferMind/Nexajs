# Nexa AI Backend

Backend API server for the Nexa AI Business Hub platform. Built with Node.js, Express, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Supabase account and project
- OpenAI API key
- SMTP email service (Gmail, SendGrid, etc.)
- Stripe account (for payments)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd nexa/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000

   # Database
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here

   # AI Services
   OPENAI_API_KEY=your_openai_api_key

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

4. **Database setup**
   ```bash
   # Run migrations to create tables
   npm run db:migrate
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/         # Route controllers (future expansion)
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   ├── cors.js        # CORS configuration
│   │   ├── rateLimit.js   # Rate limiting
│   │   ├── validation.js  # Input validation
│   │   └── requestLogger.js # Request logging
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── documents.js   # Document processing
│   │   ├── support.js     # Customer support
│   │   ├── sales.js       # Sales email generation
│   │   └── billing.js     # Billing and payments
│   ├── services/          # Business logic services
│   │   ├── aiService.js   # OpenAI integration
│   │   ├── emailService.js # Email sending
│   │   ├── fileService.js # File processing
│   │   └── creditService.js # Credit management
│   ├── utils/             # Utility functions
│   │   ├── logger.js      # Logging utility
│   │   ├── validation.js  # Validation helpers
│   │   └── encryption.js  # Encryption utilities
│   └── server.js          # Main server file
├── database/              # Database files
│   ├── schema.sql         # Database schema
│   └── seeds/
│       └── sample_data.sql # Sample data
├── scripts/               # Utility scripts
│   ├── migrate.js         # Run migrations
│   ├── seed.js           # Seed database
│   └── reset.js          # Reset database
├── logs/                  # Log files (created automatically)
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh JWT token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Documents (`/api/documents`)
- `POST /upload` - Upload and process document
- `GET /` - List user documents
- `GET /:id` - Get specific document
- `DELETE /:id` - Delete document

### Support (`/api/support`)
- `POST /chat` - Chat with AI assistant
- `POST /generate-faqs` - Generate FAQs from documents
- `GET /faqs` - Get user FAQs
- `POST /faqs` - Create custom FAQ
- `PUT /faqs/:id` - Update FAQ
- `DELETE /faqs/:id` - Delete FAQ

### Sales (`/api/sales`)
- `POST /generate-email` - Generate sales email
- `POST /send-email` - Send email
- `GET /templates` - Get email templates
- `GET /sent` - Get sent emails history
- `PUT /templates/:id` - Update email template
- `DELETE /templates/:id` - Delete email template

### Billing (`/api/billing`)
- `GET /info` - Get billing information
- `POST /create-checkout-session` - Create Stripe checkout
- `POST /webhook` - Stripe webhook handler
- `POST /cancel-subscription` - Cancel subscription
- `GET /usage` - Get usage statistics

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Sanitize and validate all inputs
- **CORS Protection** - Configured for frontend domain
- **Helmet Security** - Security headers
- **File Upload Validation** - Secure file handling
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization

## 🔧 Services

### AI Service (`aiService.js`)
- Document summarization using OpenAI GPT-4
- Sales email generation
- Support response generation
- FAQ generation from documents

### Email Service (`emailService.js`)
- SMTP email sending
- Welcome emails
- Password reset emails
- Sales email delivery

### File Service (`fileService.js`)
- PDF text extraction
- Word document processing
- Text file handling
- File validation and security

### Credit Service (`creditService.js`)
- Credit balance management
- Usage tracking
- Plan-based credit allocation
- Usage analytics

## 📊 Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

- **users** - User accounts and profiles
- **documents** - Uploaded documents and summaries
- **support_queries** - Customer support tickets
- **faqs** - FAQ knowledge base
- **email_templates** - Generated email templates
- **sent_emails** - Email sending history
- **credit_usage** - Credit consumption tracking

## 🚦 Rate Limiting

Different endpoints have different rate limits:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **AI Operations**: 10 requests per minute
- **File Uploads**: 5 uploads per minute
- **Email Sending**: 50 emails per hour

## 📝 Logging

The application logs:
- All API requests and responses
- Authentication events
- Credit usage
- AI API calls
- Errors and warnings

Logs are written to:
- Console (development)
- Files in `/logs` directory (production)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Database Management

```bash
# Reset database (drops all tables)
npm run db:reset

# Run migrations (create tables)
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## 📈 Monitoring

### Health Check
```bash
GET /health
```

Returns server status, version, and environment info.

### API Documentation
```bash
GET /api
```

Returns API overview and available endpoints.

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Use production database
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_KEY=your_production_service_key

# Strong JWT secret
JWT_SECRET=your_very_long_random_secret_key

# Production API keys
OPENAI_API_KEY=your_production_openai_key
STRIPE_SECRET_KEY=sk_live_your_production_stripe_key

# Production email service
SMTP_HOST=your_production_smtp_host
SMTP_USER=your_production_email
SMTP_PASS=your_production_password
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Process Management

For production, use PM2 or similar:

```bash
npm install -g pm2
pm2 start src/server.js --name nexa-backend
pm2 startup
pm2 save
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase URL and service key
   - Verify network connectivity
   - Check Supabase project status

2. **OpenAI API Errors**
   - Verify API key is valid
   - Check API quota and billing
   - Monitor rate limits

3. **Email Sending Failed**
   - Check SMTP credentials
   - Verify email service settings
   - Check firewall/network restrictions

4. **File Upload Issues**
   - Check file size limits
   - Verify supported file types
   - Check disk space

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and stack traces.

## 📚 API Documentation

For detailed API documentation with request/response examples, visit:
- Development: `http://localhost:3001/api`
- Production: `https://api.nexa.ai/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.