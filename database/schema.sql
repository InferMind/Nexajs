-- Nexa AI Business Hub Database Schema
-- PostgreSQL Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  credits INTEGER DEFAULT 5,
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  subscription_end_date TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  content TEXT,
  summary TEXT,
  key_points JSONB,
  action_items JSONB,
  file_type VARCHAR(50),
  file_size INTEGER,
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  processing_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Support queries table
CREATE TABLE IF NOT EXISTS support_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  category VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- FAQ knowledge base
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('cold', 'follow-up', 'proposal')),
  customer_name VARCHAR(255) NOT NULL,
  customer_company VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  industry VARCHAR(100),
  pain_point TEXT,
  product_interest TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sent emails table
CREATE TABLE IF NOT EXISTS sent_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivery_status VARCHAR(50) DEFAULT 'sent',
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Credit usage tracking
CREATE TABLE IF NOT EXISTS credit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  credits_used INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_support_queries_user_id ON support_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_support_queries_status ON support_queries(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created_at ON credit_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_queries_updated_at BEFORE UPDATE ON support_queries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for documents table
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for support_queries table
CREATE POLICY "Users can view own support queries" ON support_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own support queries" ON support_queries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own support queries" ON support_queries FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for faqs table
CREATE POLICY "Users can view own faqs" ON faqs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own faqs" ON faqs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own faqs" ON faqs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own faqs" ON faqs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_templates table
CREATE POLICY "Users can view own email templates" ON email_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email templates" ON email_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own email templates" ON email_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own email templates" ON email_templates FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sent_emails table
CREATE POLICY "Users can view own sent emails" ON sent_emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sent emails" ON sent_emails FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for credit_usage table
CREATE POLICY "Users can view own credit usage" ON credit_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credit usage" ON credit_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for api_keys table
CREATE POLICY "Users can view own api keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_sessions table
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (auth.uid() = user_id);