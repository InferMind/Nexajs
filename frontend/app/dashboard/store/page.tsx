'use client'

import { useState } from 'react'
import { 
  Store,
  Star,
  Download,
  TrendingUp,
  Crown,
  Shield,
  Zap,
  Users,
  Calendar,
  BarChart3,
  Calculator,
  FileText,
  MessageSquare,
  Mail,
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle,
  Plus
} from 'lucide-react'
import { Card, Button } from '@/components/ui'
import toast from 'react-hot-toast'

interface StoreApp {
  id: string
  name: string
  description: string
  longDescription: string
  icon: any
  category: string
  rating: number
  reviews: number
  downloads: string
  price: 'free' | 'premium' | 'enterprise'
  priceAmount?: string
  size: string
  version: string
  developer: string
  screenshots: string[]
  features: string[]
  color: string
  bgColor: string
  isInstalled: boolean
  isFeatured: boolean
  isNew: boolean
  tags: string[]
}

export default function StorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const storeApps: StoreApp[] = [
    {
      id: 'analytics-pro',
      name: 'Business Analytics Pro',
      description: 'Advanced analytics and reporting dashboard with AI insights',
      longDescription: 'Transform your business data into actionable insights with our advanced analytics platform. Features real-time dashboards, predictive analytics, and automated reporting.',
      icon: BarChart3,
      category: 'analytics',
      rating: 4.8,
      reviews: 1247,
      downloads: '25.3K',
      price: 'premium',
      priceAmount: '$29/month',
      size: '8.2 MB',
      version: '3.1.0',
      developer: 'Analytics Corp',
      screenshots: [],
      features: ['Real-time dashboards', 'Predictive analytics', 'Custom reports', 'Data visualization', 'API integration'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      isInstalled: false,
      isFeatured: true,
      isNew: false,
      tags: ['analytics', 'reporting', 'dashboard', 'ai']
    },
    {
      id: 'crm-ultimate',
      name: 'CRM Ultimate',
      description: 'Complete customer relationship management solution',
      longDescription: 'Manage your entire customer lifecycle with our comprehensive CRM solution. Track leads, manage contacts, and close more deals.',
      icon: Users,
      category: 'sales',
      rating: 4.7,
      reviews: 892,
      downloads: '18.7K',
      price: 'premium',
      priceAmount: '$49/month',
      size: '12.5 MB',
      version: '2.8.1',
      developer: 'SalesTech Inc',
      screenshots: [],
      features: ['Lead management', 'Contact tracking', 'Sales pipeline', 'Email integration', 'Mobile app'],
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      isInstalled: false,
      isFeatured: true,
      isNew: false,
      tags: ['crm', 'sales', 'leads', 'contacts']
    },
    {
      id: 'scheduler-ai',
      name: 'AI Smart Scheduler',
      description: 'Intelligent meeting and task scheduling with AI optimization',
      longDescription: 'Let AI handle your scheduling needs. Smart conflict resolution, automatic time zone handling, and intelligent meeting suggestions.',
      icon: Calendar,
      category: 'productivity',
      rating: 4.6,
      reviews: 634,
      downloads: '12.1K',
      price: 'free',
      size: '4.3 MB',
      version: '1.9.2',
      developer: 'TimeWise Solutions',
      screenshots: [],
      features: ['AI scheduling', 'Calendar sync', 'Meeting rooms', 'Time zone handling', 'Mobile notifications'],
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      isInstalled: false,
      isFeatured: false,
      isNew: true,
      tags: ['calendar', 'scheduling', 'ai', 'meetings']
    },
    {
      id: 'finance-calculator',
      name: 'Business Finance Calculator',
      description: 'Advanced financial calculations and business metrics',
      longDescription: 'Comprehensive financial calculator for business planning, loan calculations, ROI analysis, and more.',
      icon: Calculator,
      category: 'finance',
      rating: 4.4,
      reviews: 423,
      downloads: '8.9K',
      price: 'free',
      size: '2.1 MB',
      version: '1.5.3',
      developer: 'FinanceTools Ltd',
      screenshots: [],
      features: ['ROI calculator', 'Loan calculator', 'Break-even analysis', 'Cash flow', 'Tax calculations'],
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      isInstalled: false,
      isFeatured: false,
      isNew: false,
      tags: ['finance', 'calculator', 'roi', 'business']
    },
    {
      id: 'document-ai',
      name: 'Document AI Pro',
      description: 'Advanced document processing with OCR and AI analysis',
      longDescription: 'Extract text, analyze content, and automate document workflows with advanced AI capabilities.',
      icon: FileText,
      category: 'productivity',
      rating: 4.9,
      reviews: 1567,
      downloads: '32.4K',
      price: 'premium',
      priceAmount: '$19/month',
      size: '6.7 MB',
      version: '4.2.1',
      developer: 'DocuTech AI',
      screenshots: [],
      features: ['OCR scanning', 'AI analysis', 'Batch processing', 'Format conversion', 'Cloud storage'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      isInstalled: false,
      isFeatured: true,
      isNew: false,
      tags: ['documents', 'ocr', 'ai', 'processing']
    },
    {
      id: 'chatbot-builder',
      name: 'Chatbot Builder',
      description: 'Create intelligent chatbots for customer support',
      longDescription: 'Build and deploy AI-powered chatbots for your website and customer support channels.',
      icon: MessageSquare,
      category: 'support',
      rating: 4.5,
      reviews: 756,
      downloads: '15.2K',
      price: 'premium',
      priceAmount: '$39/month',
      size: '9.8 MB',
      version: '2.3.0',
      developer: 'ChatBot Solutions',
      screenshots: [],
      features: ['Visual builder', 'AI training', 'Multi-channel', 'Analytics', 'Integrations'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      isInstalled: false,
      isFeatured: false,
      isNew: true,
      tags: ['chatbot', 'ai', 'support', 'automation']
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'sales', label: 'Sales & Marketing' },
    { value: 'support', label: 'Customer Support' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'finance', label: 'Finance' }
  ]

  const filteredApps = storeApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || app.category === filterCategory
    const matchesPrice = filterPrice === 'all' || app.price === filterPrice
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'downloads':
        return parseInt(b.downloads.replace(/[^\d]/g, '')) - parseInt(a.downloads.replace(/[^\d]/g, ''))
      case 'name':
        return a.name.localeCompare(b.name)
      case 'newest':
        return b.isNew ? 1 : -1
      default: // featured
        return b.isFeatured ? 1 : -1
    }
  })

  const handleInstall = (app: StoreApp) => {
    if (app.price === 'premium') {
      toast.success(`Redirecting to payment for ${app.name}...`)
    } else {
      toast.success(`Installing ${app.name}...`)
    }
  }

  const getPriceDisplay = (app: StoreApp) => {
    switch (app.price) {
      case 'free':
        return 'Free'
      case 'premium':
        return app.priceAmount || 'Premium'
      case 'enterprise':
        return 'Enterprise'
      default:
        return 'Free'
    }
  }

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'free':
        return 'bg-green-100 text-green-800'
      case 'premium':
        return 'bg-blue-100 text-blue-800'
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">App Store</h1>
              <p className="text-gray-600">Discover and install powerful business apps</p>
            </div>
          </div>

          {/* Featured Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium text-blue-100">Featured App</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Business Analytics Pro</h2>
                <p className="text-blue-100 mb-4">Transform your data into actionable insights with AI-powered analytics</p>
                <div className="flex items-center space-x-4 text-sm text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span>4.8 (1,247 reviews)</span>
                  </div>
                  <span>25.3K downloads</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-2">$29/month</div>
                <Button className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-gray-50 shadow-sm border border-white/30 transition-all hover:shadow-md">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-medium">Install Now</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Store className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Apps</p>
                  <p className="text-xl font-semibold text-gray-900">{storeApps.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Free Apps</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {storeApps.filter(app => app.price === 'free').length}
                  </p>
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
                  <p className="text-xl font-semibold text-gray-900">4.6</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">New This Week</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {storeApps.filter(app => app.isNew).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name A-Z</option>
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
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Apps Grid/List */}
        {sortedApps.length === 0 ? (
          <Card className="p-12 text-center">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-600">
              No apps match your search criteria. Try adjusting your filters.
            </p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApps.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${app.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {app.isFeatured && <Crown className="w-4 h-4 text-yellow-500" />}
                    {app.isNew && <Zap className="w-4 h-4 text-blue-500" />}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(app.price)}`}>
                      {getPriceDisplay(app)}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{app.description}</p>
                <p className="text-gray-500 text-xs mb-4">by {app.developer}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{app.rating}</span>
                    <span>({app.reviews})</span>
                  </div>
                  <span>{app.downloads}</span>
                  <span>{app.size}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {app.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleInstall(app)}
                    className={`flex-1 ${
                      app.price === 'free' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {app.price === 'free' ? 'Install' : 'Buy'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {sortedApps.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${app.color} flex items-center justify-center flex-shrink-0`}>
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
                          {app.isFeatured && <Crown className="w-4 h-4 text-yellow-500" />}
                          {app.isNew && <Zap className="w-4 h-4 text-blue-500" />}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(app.price)}`}>
                            {getPriceDisplay(app)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">by {app.developer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleInstall(app)}
                          className={`${
                            app.price === 'free' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                          }`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {app.price === 'free' ? 'Install' : 'Buy'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{app.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{app.rating}</span>
                        <span>({app.reviews} reviews)</span>
                      </div>
                      <span>{app.downloads} downloads</span>
                      <span>{app.size}</span>
                      <span>v{app.version}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {app.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}