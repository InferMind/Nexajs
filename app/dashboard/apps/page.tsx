'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  BarChart3,
  Calendar,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
  Brain,
  Target,
  Briefcase,
  PieChart,
  Clock,
  Globe,
  Smartphone,
  Database,
  Code,
  Palette,
  Camera,
  Music,
  Video,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react'
import { Card, SearchInput, Badge, Button } from '@/components/ui'

interface App {
  id: string
  name: string
  description: string
  icon: any
  category: string
  isActive: boolean
  isPopular?: boolean
  gradient: string
  bgColor: string
  textColor: string
  href: string
  credits?: number
}

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const categories = [
    { id: 'all', name: 'All Apps', count: 24 },
    { id: 'ai', name: 'AI & ML', count: 8 },
    { id: 'productivity', name: 'Productivity', count: 6 },
    { id: 'communication', name: 'Communication', count: 4 },
    { id: 'analytics', name: 'Analytics', count: 3 },
    { id: 'business', name: 'Business', count: 3 }
  ]

  const apps: App[] = [
    // Active Apps
    {
      id: 'summarizer',
      name: 'Document Summarizer',
      description: 'AI-powered document analysis and summarization with key insights extraction.',
      icon: FileText,
      category: 'ai',
      isActive: true,
      isPopular: true,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      href: '/dashboard/summarizer',
      credits: 2
    },
    {
      id: 'support',
      name: 'Support Assistant',
      description: 'Intelligent customer support with automated FAQ generation and chat responses.',
      icon: MessageSquare,
      category: 'ai',
      isActive: true,
      isPopular: true,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      href: '/dashboard/support',
      credits: 1
    },
    {
      id: 'sales',
      name: 'Sales Email Writer',
      description: 'Generate compelling sales emails, cold outreach, and follow-up sequences.',
      icon: Mail,
      category: 'ai',
      isActive: true,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      href: '/dashboard/sales',
      credits: 1
    },
    
    // Available Apps (Not Active)
    {
      id: 'analytics',
      name: 'Business Analytics',
      description: 'Advanced analytics dashboard with AI-powered insights and predictions.',
      icon: BarChart3,
      category: 'analytics',
      isActive: false,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      href: '/dashboard/analytics',
      credits: 3
    },
    {
      id: 'scheduler',
      name: 'Smart Scheduler',
      description: 'AI-powered meeting scheduling and calendar optimization.',
      icon: Calendar,
      category: 'productivity',
      isActive: false,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      href: '/dashboard/scheduler',
      credits: 2
    },
    {
      id: 'crm',
      name: 'Smart CRM',
      description: 'Customer relationship management with AI-powered lead scoring.',
      icon: Users,
      category: 'business',
      isActive: false,
      isPopular: true,
      gradient: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      href: '/dashboard/crm',
      credits: 4
    },
    {
      id: 'content',
      name: 'Content Generator',
      description: 'AI content creation for blogs, social media, and marketing materials.',
      icon: Brain,
      category: 'ai',
      isActive: false,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      href: '/dashboard/content',
      credits: 2
    },
    {
      id: 'goals',
      name: 'Goal Tracker',
      description: 'Track business goals and KPIs with intelligent progress monitoring.',
      icon: Target,
      category: 'productivity',
      isActive: false,
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      href: '/dashboard/goals',
      credits: 1
    },
    {
      id: 'finance',
      name: 'Financial Insights',
      description: 'AI-powered financial analysis and forecasting for better decisions.',
      icon: PieChart,
      category: 'analytics',
      isActive: false,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      href: '/dashboard/finance',
      credits: 3
    },
    {
      id: 'timetrack',
      name: 'Time Tracker',
      description: 'Smart time tracking with productivity insights and automated reporting.',
      icon: Clock,
      category: 'productivity',
      isActive: false,
      gradient: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      href: '/dashboard/timetrack',
      credits: 1
    },
    {
      id: 'social',
      name: 'Social Media Manager',
      description: 'Manage and schedule social media posts across multiple platforms.',
      icon: Globe,
      category: 'communication',
      isActive: false,
      gradient: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      href: '/dashboard/social',
      credits: 2
    },
    {
      id: 'mobile',
      name: 'Mobile App Builder',
      description: 'Create mobile apps without coding using AI-powered templates.',
      icon: Smartphone,
      category: 'business',
      isActive: false,
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      href: '/dashboard/mobile',
      credits: 5
    }
  ]

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    const matchesActiveFilter = !showOnlyActive || app.isActive
    
    return matchesSearch && matchesCategory && matchesActiveFilter
  })

  const activeApps = apps.filter(app => app.isActive)
  const popularApps = apps.filter(app => app.isPopular && !app.isActive)

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                App Drawer
              </h1>
              <p className="text-gray-600">
                Access all your AI-powered business modules in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">453 credits</span>
                </div>
              </div>
              <Button variant="primary" icon={Plus}>
                Browse App Store
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Access - Active Apps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Access</h2>
            <Badge variant="info">{activeApps.length} active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeApps.map((app) => (
              <Link key={app.id} href={app.href}>
                <Card variant="hover" className="group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        {app.isPopular && (
                          <Badge variant="warning" size="sm">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {app.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {app.credits} credit{app.credits !== 1 ? 's' : ''} per use
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search apps..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input text-sm py-2 px-3 min-w-0"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activeOnly"
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="activeOnly" className="text-sm text-gray-600">
                  Active only
                </label>
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Apps Section */}
        {!showOnlyActive && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Popular Apps</h2>
              <Link href="/dashboard/store" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all in store →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularApps.slice(0, 3).map((app) => (
                <Card key={app.id} variant="hover" className="group relative">
                  <div className="absolute top-4 right-4">
                    <Badge variant="warning" size="sm">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-500">
                        {app.credits} credit{app.credits !== 1 ? 's' : ''} per use
                      </span>
                      <Badge variant="secondary" size="sm">
                        {app.category}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Apps */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {showOnlyActive ? 'Active Apps' : 'All Apps'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <Card key={app.id} variant="hover" className="group">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      {app.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-500">
                        {app.credits} credit{app.credits !== 1 ? 's' : ''}
                      </span>
                      <Badge variant="secondary" size="sm">
                        {app.category}
                      </Badge>
                    </div>
                    {app.isActive ? (
                      <Link href={app.href}>
                        <Button variant="primary" size="sm" className="w-full">
                          Open App
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <Card key={app.id} variant="hover" className="group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        {app.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {app.isPopular && (
                          <Badge variant="warning" size="sm">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {app.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-500">
                          {app.credits} credit{app.credits !== 1 ? 's' : ''} per use
                        </span>
                        <Badge variant="secondary" size="sm">
                          {app.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {app.isActive ? (
                        <Link href={app.href}>
                          <Button variant="primary" size="sm">
                            Open App
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {filteredApps.length === 0 && (
            <Card className="text-center py-16">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No apps found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all' || showOnlyActive
                  ? 'Try adjusting your search or filter criteria'
                  : 'No apps available at the moment'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all' || showOnlyActive) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setShowOnlyActive(false)
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}