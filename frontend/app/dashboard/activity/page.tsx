"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, FileText, Mail, MessageSquare, ArrowLeft } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks'

export default function ActivityPage() {
  const { data, isLoading } = useDashboardStats()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    if (data?.activities) setActivities(data.activities)
  }, [data])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
        </div>
        <Link href="/dashboard" className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="py-12 text-center text-gray-600">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-gray-600">No recent activity</div>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => {
              const Icon = a.type === 'document' ? FileText : a.type === 'email' ? Mail : MessageSquare
              return (
                <div key={a.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.action} • {new Date(a.created_at).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}