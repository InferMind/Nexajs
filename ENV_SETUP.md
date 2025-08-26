# Environment Variables Setup Guide

This guide explains how to set up environment variables for both frontend and backend of the Nexa AI Business Hub.

## Frontend Environment Variables

### Setup Instructions
1. Copy `frontend/.env.local` to your frontend directory
2. Update the values with your actual configuration

### Required Variables

#### API Configuration
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001/api)

#### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

#### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for payments

## Backend Environment Variables

### Setup Instructions
1. Copy `backend/.env.example` to `backend/.env`
2. Update all placeholder values with your actual credentials

### Required Variables

#### Server Configuration
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

#### Database (Supabase)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Service role key (not anon key)

#### Authentication
- `JWT_SECRET` - Secret key for JWT tokens (use a long, random string)
- `JWT_EXPIRES_IN` - Token expiration time

#### AI Services
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `OPENAI_MODEL` - Model to use (gpt-4 recommended)

#### Email Service
Choose one of the following:

**SMTP (Recommended for Gmail)**
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP port (587 for Gmail)
- `SMTP_USER` - Your email address
- `SMTP_PASS` - App password (not regular password)

**SendGrid (Alternative)**
- `SENDGRID_API_KEY` - SendGrid API key
- `FROM_EMAIL` - Sender email address

#### Payment Processing
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret

#### File Storage
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_BUCKET_NAME` - S3 bucket name
- `MAX_FILE_SIZE` - Maximum file size in bytes

## Service Setup Instructions

### 1. Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get URL and keys from Settings > API
4. Run the database schema from `/database/schema.sql`

### 2. OpenAI Setup
1. Create account at [openai.com](https://openai.com)
2. Generate API key from API section
3. Add billing information for usage

### 3. Stripe Setup (Optional)
1. Create account at [stripe.com](https://stripe.com)
2. Get publishable and secret keys from Developers > API keys
3. Set up webhook endpoint for `/api/billing/webhook`

### 4. Email Setup
Choose one option:

**Gmail SMTP:**
1. Enable 2-factor authentication
2. Generate app password in Google Account settings
3. Use app password (not regular password)

**SendGrid:**
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Generate API key
3. Verify sender email

### 5. AWS S3 Setup (Optional)
1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Get access key and secret

## Security Notes

- Never commit `.env` files to version control
- Use strong, random values for secrets
- Rotate keys regularly
- Use different keys for development and production
- Enable 2FA on all service accounts

## Development vs Production

### Development
- Use test/sandbox keys for all services
- Set `NODE_ENV=development`
- Use localhost URLs

### Production
- Use live/production keys
- Set `NODE_ENV=production`
- Use actual domain URLs
- Enable additional security measures