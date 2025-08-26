'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useSupportQueries, useSupportSubmission } from '@/lib/hooks'
import { Card, Button, LoadingSpinner } from '@/components/ui'

interface SupportQuery {
  id: string
  subject: string
  message: string
  status: 'pending' | 'in-progress' | 'resolved'
  category: string
  createdAt: string
  response?: string
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new')
  const [newQuery, setNewQuery] = useState({
    subject: '',
    message: '',
    category: 'general'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedQuery, setSelectedQuery] = useState<SupportQuery | null>(null)

  // Use real API hooks
  const { data: queries, isLoading, error, refetch } = useSupportQueries()
  const { submitQuery, generateResponse, isSubmitting } = useSupportSubmission()

  // Ensure queries is always an array
  const queriesArray = Array.isArray(queries) ? queries : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuery.subject.trim() || !newQuery.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const result = await submitQuery(newQuery)
      if (result) {
        toast.success('Support query submitted successfully!')
        setNewQuery({ subject: '', message: '', category: 'general' })
        setActiveTab('history')
        refetch()
      }
    } catch (error) {
      toast.error('Failed to submit query')
    }
  }

  const handleGenerateResponse = async (queryId: string) => {
    try {
      const response = await generateResponse(queryId)
      if (response) {
        toast.success('AI response generated!')
        refetch()
      }
    } catch (error) {
      toast.error('Failed to generate response')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const filteredQueries = queriesArray.filter(query => {
    const matchesSearch = query.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || query.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Support Assistant</h1>
              <p className="text-gray-600">Get instant help with AI-powered support</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'new'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New Query
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Query History
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          /* New Query Form */
          <div className="max-w-2xl">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newQuery.category}
                    onChange={(e) => setNewQuery(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="general">General Support</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newQuery.subject}
                    onChange={(e) => setNewQuery(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newQuery.message}
                    onChange={(e) => setNewQuery(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Query
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          /* Query History */
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Query List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner className="w-8 h-8" />
              </div>
            ) : filteredQueries.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
                <p className="text-gray-600 mb-4">
                  {queriesArray.length === 0 
                    ? "You haven't submitted any support queries yet."
                    : "No queries match your search criteria."
                  }
                </p>
                <Button
                  onClick={() => setActiveTab('new')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Query
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQueries.map((query) => (
                  <Card key={query.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(query.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {query.subject}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                            {query.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{query.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {query.category}</span>
                          <span>•</span>
                          <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {query.status === 'pending' && (
                          <Button
                            onClick={() => handleGenerateResponse(query.id)}
                            disabled={isSubmitting}
                            size="sm"
                            variant="outline"
                          >
                            {isSubmitting ? (
                              <LoadingSpinner className="w-3 h-3" />
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate AI Response
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={() => copyToClipboard(query.message)}
                          size="sm"
                          variant="outline"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {query.response && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">AI Response</span>
                        </div>
                        <p className="text-gray-700 mb-3">{query.response}</p>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <ThumbsDown className="w-3 h-3 mr-1" />
                            Not Helpful
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(query.response!)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}