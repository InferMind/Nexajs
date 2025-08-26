'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Grid3X3,
  FileText, 
  MessageSquare, 
  Mail, 
  Calculator,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  Star,
  Download,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  TrendingUp,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { useAuth } from '@/lib/auth-context'

interface App {
  id: string
  name: string
  description: string
  icon: any
  category: string
  status: 'installed' | 'available' | 'updating'
  rating: number
  downloads: string
  size: string
  version: string
  href?: string
  color: string
  bgColor: string
}

export default function AppsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const { user } = useAuth()

  const installedApps: App[] = [
    {
      id: 'summarizer',
      name: 'AI Document Summarizer',
      description: 'Upload and analyze documents with AI-powered insights',
      icon: FileText,
      category: 'productivity',
      status: 'installed',
      rating: 4.8,
      downloads: '12.5K',
      size: '2.3 MB',
      version: '2.1.0',
      href: '/dashboard/summarizer',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'support',
      name: 'Smart Support Assistant',
      description: 'AI-powered customer support and FAQ generation',
      icon: MessageSquare,
      category: 'support',
      status: 'installed',
      rating: 4.7,
      downloads: '8.2K',
      size: '1.8 MB',
      version: '1.9.2',
      href: '/dashboard/support',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      id: 'sales',
      name: 'Sales Email Writer',
      description: 'Generate compelling sales emails with AI assistance',
      icon: Mail,
      category: 'sales',
      status: 'installed',
      rating: 4.9,
      downloads: '15.7K',
      size: '3.1 MB',
      version: '3.0.1',
      href: '/dashboard/sales',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ]

  const availableApps: App[] = [
    {
      id: 'analytics',
      name: 'Business Analytics',
      description: 'Advanced analytics and reporting dashboard',
      icon: BarChart3,
      category: 'analytics',
      status: 'available',
      rating: 4.6,
      downloads: '9.3K',
      size: '4.2 MB',
      version: '1.5.0',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      id: 'crm',
      name: 'Customer Relationship Manager',
      description: 'Manage customer relationships and sales pipeline',
      icon: Users,
      category: 'sales',
      status: 'available',
      rating: 4.5,
      downloads: '6.8K',
      size: '5.7 MB',
      version: '2.3.1',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50'
    },
    {
      id: 'scheduler',
      name: 'Smart Scheduler',
      description: 'AI-powered meeting and task scheduling',
      icon: Calendar,
      category: 'productivity',
      status: 'available',
      rating: 4.4,
      downloads: '4.1K',
      size: '2.9 MB',
      version: '1.2.3',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50'
    },
    {
      id: 'calculator',
      name: 'Business Calculator',
      description: 'Financial calculations and business metrics',
      icon: Calculator,
      category: 'finance',
      status: 'available',
      rating: 4.3,
      downloads: '3.2K',
      size: '1.1 MB',
      version: '1.0.8',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    }
  ]

  const allApps = [...installedApps, ...availableApps]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'sales', label: 'Sales & Marketing' },
    { value: 'support', label: 'Customer Support' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'finance', label: 'Finance' }
  ]

  const filteredApps = allApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || app.category === filterCategory
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'installed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'updating':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
      default:
        return <Download className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed':
        return 'bg-green-100 text-green-800'
      case 'updating':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">App Drawer</h1>
              <p className="text-gray-600">Manage your installed apps and discover new ones</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Installed</p>
                  <p className="text-xl font-semibold text-gray-900">{installedApps.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-xl font-semibold text-gray-900">{availableApps.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits Used</p>
                  <p className="text-xl font-semibold text-gray-900">{500 - (user?.credits || 0)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-xl font-semibold text-gray-900">4.7</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="installed">Installed</option>
                  <option value="available">Available</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Apps Grid/List */}
        {filteredApps.length === 0 ? (
          <Card className="p-12 text-center">
            <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-600">
              No apps match your search criteria. Try adjusting your filters.
            </p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${app.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(app.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{app.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{app.rating}</span>
                  </div>
                  <span>{app.downloads}</span>
                  <span>{app.size}</span>
                </div>

                <div className="flex space-x-2">
                  {app.status === 'installed' && app.href ? (
                    <Link href={app.href} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        Open
                      </Button>
                    </Link>
                  ) : app.status === 'available' ? (
                    <Button className="flex-1 inline-flex items-center justify-center rounded-xl bg-white text-blue-700 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all hover:shadow-md">
                      <Download className="w-4 h-4 mr-2" />
                      <span className="font-medium">Install</span>
                    </Button>
                  ) : (
                    <Button disabled className="flex-1">
                      <Clock className="w-4 h-4 mr-2 animate-pulse" />
                      Updating...
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${app.color} flex items-center justify-center`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{app.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{app.rating}</span>
                      </div>
                      <span>{app.downloads} downloads</span>
                      <span>{app.size}</span>
                      <span>v{app.version}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {app.status === 'installed' && app.href ? (
                      <Link href={app.href}>
                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                          Open
                        </Button>
                      </Link>
                    ) : app.status === 'available' ? (
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                        <Download className="w-4 h-4 mr-2" />
                        Install
                      </Button>
                    ) : (
                      <Button disabled>
                        <Clock className="w-4 h-4 mr-2 animate-pulse" />
                        Updating...
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Discover More Apps</h3>
              <p className="text-indigo-700">Browse our app store to find more tools for your business</p>
            </div>
            <Link href="/dashboard/store">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Visit App Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}