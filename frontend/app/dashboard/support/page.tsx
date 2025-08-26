"use client"

import Link from 'next/link'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import { useSupportQueries, useSupportSubmission } from '@/lib/hooks'

export default function SupportPage() {
  const { data, isLoading } = useSupportQueries()
  const { submitQuery, isSubmitting } = useSupportSubmission()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        </div>
        <Link href="/dashboard" className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent queries</h2>
          {isLoading ? (
            <div className="py-8 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-3">
              {(data || []).map((q: any) => (
                <div key={q.id} className="p-3 rounded-xl bg-gray-50 border">
                  <div className="text-sm font-medium text-gray-900">{q.subject}</div>
                  <div className="text-xs text-gray-500">{q.status} • {new Date(q.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Submit new query</h2>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const formData = new FormData(form)
              const subject = String(formData.get('subject') || '')
              const message = String(formData.get('message') || '')
              const category = String(formData.get('category') || 'general')
              await submitQuery({ subject, message, category })
              form.reset()
            }}
          >
            <input name="subject" placeholder="Subject" className="input" required />
            <textarea name="message" placeholder="Message" className="input min-h-[120px]" required />
            <select name="category" className="input">
              <option value="general">General</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
            </select>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}