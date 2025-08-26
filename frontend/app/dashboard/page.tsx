'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowRight,
  Clock,
  CheckCircle,
  Star,
  BarChart3,
  Activity,
  Sparkles,
  Plus,
  Calendar,
  Target,
  ChevronRight
} from 'lucide-react'
import { Card, Button, StatCard, ProgressBar, AppIcon } from '@/components/ui'
import { useDashboardStats } from '@/lib/hooks'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const { user } = useAuth()
  const { data: dashboardData, isLoading, error } = useDashboardStats()

  // Map stats with icons
  const stats = dashboardData?.stats?.map(stat => ({
    ...stat,
    icon: stat.icon === 'FileText' ? FileText :
          stat.icon === 'MessageSquare' ? MessageSquare :
          stat.icon === 'Mail' ? Mail :
          stat.icon === 'Zap' ? Zap : FileText
  })) || []

  const quickActions = [
    {
      title: 'Summarize Document',
      description: 'Upload and analyze any document',
      icon: FileText,
      href: '/dashboard/summarizer',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      title: 'Generate Email',
      description: 'Create sales emails with AI',
      icon: Mail,
      href: '/dashboard/sales',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    {
      title: 'Support Assistant',
      description: 'Manage FAQs and chat support',
      icon: MessageSquare,
      href: '/dashboard/support',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    }
  ]

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (dashboardData?.activities) {
      setRecentActivity(dashboardData.activities.map((a: any) => ({
        ...a,
        icon: a.type === 'document' ? FileText : a.type === 'email' ? Mail : MessageSquare,
        color: a.type === 'document' ? 'text-blue-600' : a.type === 'email' ? 'text-green-600' : 'text-purple-600',
        bgColor: a.type === 'document' ? 'bg-blue-100' : a.type === 'email' ? 'bg-green-100' : 'bg-purple-100',
        time: new Date(a.created_at).toLocaleString(),
      })))
    }
  }, [dashboardData])

  const usageData = [
    { name: 'Mon', summarizer: 4, sales: 2, support: 1 },
    { name: 'Tue', summarizer: 6, sales: 3, support: 2 },
    { name: 'Wed', summarizer: 3, sales: 5, support: 1 },
    { name: 'Thu', summarizer: 8, sales: 2, support: 3 },
    { name: 'Fri', summarizer: 5, sales: 4, support: 2 },
    { name: 'Sat', summarizer: 2, sales: 1, support: 1 },
    { name: 'Sun', summarizer: 3, sales: 2, support: 0 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your AI assistant today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input text-sm py-2 px-3"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="inline-flex items-center px-3 py-2 rounded-xl bg-white text-blue-700 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all hover:shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-medium">New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              total={stat.total}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              gradient={stat.color}
              bgColor={stat.bgColor}
              textColor={stat.textColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h2>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ background: action.bgColor }}
                  >
                    <div className="relative z-10">
                      <AppIcon
                        icon={action.icon}
                        gradient={action.color}
                        size="md"
                        hover={true}
                        className="mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {action.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Get started
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Weekly Usage
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {usageData.map((day, index) => {
                const total = day.summarizer + day.sales + day.support
                const maxTotal = Math.max(...usageData.map(d => d.summarizer + d.sales + d.support))
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 text-xs font-medium text-gray-600">
                      {day.name}
                    </div>
                    <div className="flex-1 flex items-center space-x-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${(total / maxTotal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-6">
                        {total}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    <span className="text-gray-600">Summarizer</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className="text-gray-600">Sales</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    <span className="text-gray-600">Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.action} • {activity.time}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link 
                href="/dashboard/activity" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
              >
                View all activity
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Goals & Achievements */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                This Week's Goals
              </h2>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <ProgressBar
                value={23}
                max={50}
                label="Process 50 documents"
                showValue={true}
                gradient="from-blue-500 to-cyan-500"
              />
              
              <ProgressBar
                value={15}
                max={30}
                label="Generate 30 emails"
                showValue={true}
                gradient="from-green-500 to-emerald-500"
              />
              
              <ProgressBar
                value={9}
                max={20}
                label="Handle 20 support queries"
                showValue={true}
                gradient="from-purple-500 to-pink-500"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Weekly streak: 5 days
                  </span>
                </div>
                <span className="text-xs text-gray-500">Keep it up! 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-8">
          <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Ready for more? Upgrade to Pro! 🚀
                </h3>
                <p className="text-blue-100 mb-4">
                  Get 500 credits per month and unlock advanced features.
                </p>
                <Link href="/dashboard/billing" className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-blue-600 hover:bg-gray-100 shadow-sm border border-white/20 transition-all hover:shadow-md">
                  <span className="font-medium">Upgrade Now</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}