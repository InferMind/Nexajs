"use client"

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { User, Mail, Building2, CreditCard, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <Link href="/dashboard" className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center">
          <div className="text-4xl mr-4">{user?.avatar || '👤'}</div>
          <div>
            <div className="text-lg font-semibold">{user?.name || 'User'}</div>
            <div className="text-sm text-gray-500">{user?.plan || 'Free'} Plan</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">Email</div>
            <div className="flex items-center text-sm text-gray-800">
              <Mail className="w-4 h-4 mr-2" /> {user?.email}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">Company</div>
            <div className="flex items-center text-sm text-gray-800">
              <Building2 className="w-4 h-4 mr-2" /> {user?.company || '-'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <div className="text-xs text-gray-500 mb-1">Credits</div>
            <div className="flex items-center text-sm text-gray-800">
              <CreditCard className="w-4 h-4 mr-2" /> {user?.credits ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}