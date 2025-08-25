'use client'

import { useState } from 'react'
import { 
  Star, 
  Download, 
  Users, 
  Zap, 
  Shield, 
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Plus,
  Check,
  ArrowRight,
  Heart,
  Share2,
  ExternalLink,
  Award,
  Verified,
  Crown,
  FileText,
  MessageSquare,
  Mail,
  BarChart3,
  Calendar,
  Brain,
  Target,
  PieChart,
  Globe,
  Smartphone,
  Camera,
  Music,
  Video,
  Code,
  Palette,
  Database,
  Briefcase
} from 'lucide-react'
import { Card, SearchInput, Badge, Button, Modal } from '@/components/ui'

interface StoreApp {
  id: string
  name: string
  description: string
  longDescription: string
  icon: any
  category: string
  developer: string
  rating: number
  reviews: number
  downloads: number
  price: number
  credits: number
  isInstalled: boolean
  isFeatured?: boolean
  isNew?: boolean
  isPopular?: boolean
  isPremium?: boolean
  gradient: string
  bgColor: string
  textColor: string
  screenshots: string[]
  features: string[]
  version: string
  lastUpdated: string
  size: string
  compatibility: string[]
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories', count: 48 },
    { id: 'ai', name: 'AI & Machine Learning', count: 15 },
    { id: 'productivity', name: 'Productivity', count: 12 },
    { id: 'communication', name: 'Communication', count: 8 },
    { id: 'analytics', name: 'Analytics & Reports', count: 7 },
    { id: 'business', name: 'Business Tools', count: 6 }
  ]

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest' },
    { id: 'downloads', name: 'Most Downloaded' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ]

  const apps: StoreApp[] = [
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Pro',
      description: 'Professional business analytics with AI-powered insights and predictive modeling.',
      longDescription: 'Transform your business data into actionable insights with our advanced analytics platform. Features include real-time dashboards, predictive analytics, custom reporting, and AI-powered recommendations.',
      icon: BarChart3,
      category: 'analytics',
      developer: 'DataViz Solutions',
      rating: 4.8,
      reviews: 1247,
      downloads: 15420,
      price: 49,
      credits: 5,
      isInstalled: false,
      isFeatured: true,
      isPopular: true,
      isPremium: true,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      screenshots: ['/screenshots/analytics-1.jpg', '/screenshots/analytics-2.jpg'],
      features: [
        'Real-time data visualization',
        'Predictive analytics',
        'Custom dashboard builder',
        'Export to multiple formats',
        'Team collaboration tools'
      ],
      version: '2.1.0',
      lastUpdated: '2024-01-10',
      size: '12.5 MB',
      compatibility: ['Web', 'Mobile', 'API']
    },
    {
      id: 'smart-scheduler-pro',
      name: 'Smart Scheduler Pro',
      description: 'AI-powered meeting scheduling with calendar optimization and automatic conflict resolution.',
      longDescription: 'Never miss a meeting again with our intelligent scheduling assistant. Automatically finds the best meeting times, handles time zones, and integrates with all major calendar platforms.',
      icon: Calendar,
      category: 'productivity',
      developer: 'TimeSync Inc',
      rating: 4.6,
      reviews: 892,
      downloads: 8340,
      price: 29,
      credits: 3,
      isInstalled: false,
      isNew: true,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      screenshots: ['/screenshots/scheduler-1.jpg', '/screenshots/scheduler-2.jpg'],
      features: [
        'AI-powered scheduling',
        'Calendar integration',
        'Time zone handling',
        'Conflict resolution',
        'Meeting templates'
      ],
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      size: '8.2 MB',
      compatibility: ['Web', 'Mobile']
    },
    {
      id: 'content-genius',
      name: 'Content Genius',
      description: 'AI content creation suite for blogs, social media, and marketing materials.',
      longDescription: 'Create engaging content effortlessly with our AI-powered writing assistant. Generate blog posts, social media content, email campaigns, and more with just a few clicks.',
      icon: Brain,
      category: 'ai',
      developer: 'ContentCraft',
      rating: 4.7,
      reviews: 2156,
      downloads: 23450,
      price: 39,
      credits: 4,
      isInstalled: false,
      isPopular: true,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      screenshots: ['/screenshots/content-1.jpg', '/screenshots/content-2.jpg'],
      features: [
        'AI content generation',
        'Multiple content types',
        'SEO optimization',
        'Plagiarism checker',
        'Brand voice training'
      ],
      version: '3.2.1',
      lastUpdated: '2024-01-08',
      size: '15.8 MB',
      compatibility: ['Web', 'API']
    },
    {
      id: 'crm-ultimate',
      name: 'CRM Ultimate',
      description: 'Complete customer relationship management with AI-powered lead scoring and automation.',
      longDescription: 'Manage your entire sales pipeline with our comprehensive CRM solution. Features include lead scoring, automated follow-ups, sales forecasting, and detailed analytics.',
      icon: Users,
      category: 'business',
      developer: 'SalesForce Pro',
      rating: 4.9,
      reviews: 3421,
      downloads: 45230,
      price: 79,
      credits: 6,
      isInstalled: false,
      isFeatured: true,
      isPremium: true,
      gradient: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      screenshots: ['/screenshots/crm-1.jpg', '/screenshots/crm-2.jpg'],
      features: [
        'Lead management',
        'Sales pipeline tracking',
        'Automated workflows',
        'Email integration',
        'Advanced reporting'
      ],
      version: '4.5.2',
      lastUpdated: '2024-01-12',
      size: '22.1 MB',
      compatibility: ['Web', 'Mobile', 'API']
    },
    {
      id: 'social-manager',
      name: 'Social Media Manager',
      description: 'Comprehensive social media management with AI-powered content suggestions.',
      longDescription: 'Manage all your social media accounts from one dashboard. Schedule posts, analyze performance, engage with followers, and get AI-powered content suggestions.',
      icon: Globe,
      category: 'communication',
      developer: 'SocialHub',
      rating: 4.4,
      reviews: 1876,
      downloads: 12340,
      price: 35,
      credits: 3,
      isInstalled: false,
      gradient: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      screenshots: ['/screenshots/social-1.jpg', '/screenshots/social-2.jpg'],
      features: [
        'Multi-platform posting',
        'Content scheduling',
        'Analytics dashboard',
        'Engagement tracking',
        'AI content suggestions'
      ],
      version: '2.8.0',
      lastUpdated: '2024-01-05',
      size: '18.7 MB',
      compatibility: ['Web', 'Mobile']
    },
    {
      id: 'finance-tracker',
      name: 'Finance Tracker Pro',
      description: 'Advanced financial tracking and forecasting with AI-powered insights.',
      longDescription: 'Take control of your business finances with comprehensive tracking, budgeting, and forecasting tools powered by artificial intelligence.',
      icon: PieChart,
      category: 'analytics',
      developer: 'FinanceAI',
      rating: 4.5,
      reviews: 967,
      downloads: 7890,
      price: 59,
      credits: 4,
      isInstalled: false,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      screenshots: ['/screenshots/finance-1.jpg', '/screenshots/finance-2.jpg'],
      features: [
        'Expense tracking',
        'Budget planning',
        'Financial forecasting',
        'Tax preparation',
        'Investment analysis'
      ],
      version: '1.9.3',
      lastUpdated: '2024-01-07',
      size: '14.2 MB',
      compatibility: ['Web', 'Mobile', 'API']
    }
  ]

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.developer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'downloads':
        return b.downloads - a.downloads
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      default: // popular
        return b.downloads - a.downloads
    }
  })

  const featuredApps = apps.filter(app => app.isFeatured)
  const newApps = apps.filter(app => app.isNew)

  const handleInstallApp = (app: StoreApp) => {
    // TODO: Implement app installation logic
    console.log('Installing app:', app.name)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                App Store
              </h1>
              <p className="text-gray-600">
                Discover and install powerful AI modules to enhance your business
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">453 credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Apps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
            <Badge variant="info">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredApps.slice(0, 2).map((app) => (
              <Card key={app.id} variant="gradient" className="group cursor-pointer" onClick={() => setSelectedApp(app)}>
                <div className="flex items-start space-x-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <app.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                      {app.isPremium && (
                        <Badge variant="warning" size="sm">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{app.description}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{app.rating}</span>
                        <span className="text-sm text-gray-500">({app.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{app.downloads.toLocaleString()}</span>
                      </div>
                      <Badge variant="secondary" size="sm">{app.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${app.price}</span>
                        <span className="text-sm text-gray-500">• {app.credits} credits/use</span>
                      </div>
                      <Button variant="primary" size="sm" onClick={(e) => {
                        e.stopPropagation()
                        handleInstallApp(app)
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Install
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* New Apps */}
        {newApps.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New & Updated</h2>
              <Badge variant="success">
                <Sparkles className="w-3 h-3 mr-1" />
                Fresh
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newApps.map((app) => (
                <Card key={app.id} variant="hover" className="group cursor-pointer" onClick={() => setSelectedApp(app)}>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      <Badge variant="success" size="sm">New</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{app.rating}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${app.price}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                      e.stopPropagation()
                      handleInstallApp(app)
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search apps, developers, categories..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input text-sm py-2 px-3"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm py-2 px-3"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              
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

        {/* All Apps */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Apps</h2>
            <span className="text-sm text-gray-500">
              {sortedApps.length} app{sortedApps.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedApps.map((app) => (
                <Card key={app.id} variant="hover" className="group cursor-pointer" onClick={() => setSelectedApp(app)}>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      {app.isNew && <Badge variant="success" size="sm">New</Badge>}
                      {app.isPremium && <Badge variant="warning" size="sm">Pro</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{app.developer}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{app.rating}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${app.price}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                      e.stopPropagation()
                      handleInstallApp(app)
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedApps.map((app) => (
                <Card key={app.id} variant="hover" className="group cursor-pointer" onClick={() => setSelectedApp(app)}>
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${app.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        {app.isNew && <Badge variant="success" size="sm">New</Badge>}
                        {app.isPremium && <Badge variant="warning" size="sm">Premium</Badge>}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{app.developer}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {app.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{app.rating}</span>
                          <span className="text-sm text-gray-500">({app.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{app.downloads.toLocaleString()}</span>
                        </div>
                        <Badge variant="secondary" size="sm">{app.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">${app.price}</div>
                        <div className="text-xs text-gray-500">{app.credits} credits/use</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation()
                        handleInstallApp(app)
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Install
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {sortedApps.length === 0 && (
            <Card className="text-center py-16">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No apps found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear filters
              </Button>
            </Card>
          )}
        </div>

        {/* App Detail Modal */}
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          size="xl"
          title={selectedApp?.name}
        >
          {selectedApp && (
            <div className="space-y-6">
              {/* App Header */}
              <div className="flex items-start space-x-6">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${selectedApp.gradient} flex items-center justify-center`}>
                  <selectedApp.icon className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
                    {selectedApp.isNew && <Badge variant="success">New</Badge>}
                    {selectedApp.isPremium && <Badge variant="warning">Premium</Badge>}
                  </div>
                  <p className="text-gray-600 mb-3">{selectedApp.developer}</p>
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedApp.rating}</span>
                      <span className="text-gray-500">({selectedApp.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">{selectedApp.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-gray-900">${selectedApp.price}</div>
                    <div className="text-sm text-gray-500">
                      {selectedApp.credits} credit{selectedApp.credits !== 1 ? 's' : ''} per use
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="primary" onClick={() => handleInstallApp(selectedApp)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Install App
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About this app</h3>
                <p className="text-gray-700 leading-relaxed">{selectedApp.longDescription}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedApp.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* App Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Version</div>
                  <div className="font-medium">{selectedApp.version}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Updated</div>
                  <div className="font-medium">{new Date(selectedApp.lastUpdated).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-medium">{selectedApp.size}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium capitalize">{selectedApp.category}</div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}