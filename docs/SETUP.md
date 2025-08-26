# Nexa AI Business Hub - Setup Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL (or Supabase account)
- OpenAI API key
- Stripe account (for billing)
- SMTP email service (Gmail, SendGrid, etc.)

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   cd nexa
   npm run install:all
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your API keys and configuration
   ```

3. **Database Setup**
   - Create a Supabase project at https://supabase.com
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Update `.env` with your Supabase URL and keys

4. **OpenAI Setup**
   - Get API key from https://platform.openai.com
   - Add to `.env` as `OPENAI_API_KEY`

5. **Stripe Setup** (Optional for MVP testing)
   - Create Stripe account at https://stripe.com
   - Get publishable and secret keys
   - Create products and price IDs for Pro ($29) and Business ($99) plans
   - Add webhook endpoint for `/api/billing/webhook`

6. **Email Setup** (Optional)
   - Configure SMTP settings in `.env`
   - For Gmail: use App Password, not regular password

7. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Environment Variables

### Required for Basic Functionality
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

### Optional for Full Features
```env
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASS=your_password
```

## Project Structure

```
nexa/
├── frontend/          # Next.js React app
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   └── public/       # Static assets
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── middleware/ # Auth, validation
│   │   └── services/ # Business logic
├── database/         # SQL schemas
└── docs/            # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Document Summarizer
- `POST /api/summarizer/summarize` - Upload and summarize document
- `GET /api/summarizer/history` - Get user's summaries
- `GET /api/summarizer/:id` - Get specific summary

### Support Assistant
- `POST /api/support/generate-faqs` - Generate FAQs from documents
- `GET /api/support/faqs` - Get user's FAQs
- `POST /api/support/chat` - Chat with AI assistant
- `GET /api/support/conversations` - Get chat history

### Sales & Email Writer
- `POST /api/sales/generate-email` - Generate sales email
- `POST /api/sales/send-email` - Send email
- `GET /api/sales/templates` - Get email templates
- `GET /api/sales/sent` - Get sent emails

### Billing
- `GET /api/billing/info` - Get billing information
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/webhook` - Stripe webhook handler

## Testing

1. **Create Test Account**
   - Sign up at http://localhost:3000/auth/signup
   - Choose Free plan (5 credits)

2. **Test Each Module**
   - **Summarizer**: Upload a PDF/DOC file
   - **Support**: Generate FAQs, test chat
   - **Sales**: Create cold email, follow-up, proposal

3. **Test Billing** (if Stripe configured)
   - Upgrade to Pro plan
   - Verify credit increase
   - Test webhook with Stripe CLI

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
# Deploy to your preferred platform
```

### Database
- Supabase handles hosting automatically
- For self-hosted: Use PostgreSQL with the provided schema

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend `.env`
   - Verify Supabase URL configuration

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check billing/usage limits
   - Ensure model availability

3. **File Upload Issues**
   - Check file size limits (10MB)
   - Verify supported file types
   - Check multer configuration

4. **Database Connection**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure schema is applied

### Getting Help

- Check logs in browser console and terminal
- Verify all environment variables are set
- Test API endpoints with Postman/curl
- Check Supabase dashboard for database issues

## Next Steps

1. **MVP Launch**
   - Deploy to production
   - Set up monitoring
   - Configure analytics

2. **Growth Features**
   - Add integrations (Slack, Gmail)
   - Implement team collaboration
   - Add usage analytics dashboard

3. **Scale Features**
   - Add more AI modules
   - Implement marketplace
   - Add enterprise features