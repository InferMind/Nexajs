"use client"

import Link from 'next/link'
import { HelpCircle, Mail, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        </div>
        <Link href="/dashboard" className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Documentation</h2>
          <p className="text-sm text-gray-600 mb-4">Learn how to use the apps and features.</p>
          <a href="/docs/SETUP.md" className="btn-secondary"> <BookOpen className="w-4 h-4 mr-2"/> Read docs</a>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
          <p className="text-sm text-gray-600 mb-4">Need help? Reach out to us.</p>
          <a href="mailto:support@nexa.ai" className="btn-secondary"> <Mail className="w-4 h-4 mr-2"/> Email support</a>
        </div>

        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">FAQ</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <details className="rounded-lg border p-4 bg-white">
              <summary className="cursor-pointer font-medium">How do I reset my password?</summary>
              <p className="mt-2">Use the Forgot password link on the login page and check your email.</p>
            </details>
            <details className="rounded-lg border p-4 bg-white">
              <summary className="cursor-pointer font-medium">How to connect Google login?</summary>
              <p className="mt-2">Add your Google OAuth credentials in Supabase Authentication settings and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the frontend .env.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}