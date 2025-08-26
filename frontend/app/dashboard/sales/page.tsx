'use client'

import { useState } from 'react'
import { 
  Mail, 
  Send, 
  Copy, 
  Download, 
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useSalesEmails, useSalesEmailGeneration, SalesEmail } from '@/lib/hooks'
import { Card, Button, LoadingSpinner } from '@/components/ui'

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')
  const [emailType, setEmailType] = useState('cold-outreach')
  const [context, setContext] = useState({
    companyName: '',
    recipientName: '',
    recipientCompany: '',
    productService: '',
    painPoint: '',
    callToAction: ''
  })
  const [generatedEmail, setGeneratedEmail] = useState<{
    subject: string
    content: string
    suggestions: string[]
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedEmail, setSelectedEmail] = useState<SalesEmail | null>(null)

  // Use real API hooks
  const { data: emails, isLoading, error, refetch } = useSalesEmails()
  const { generateEmail, sendEmail, isGenerating } = useSalesEmailGeneration()

  // Ensure emails is always an array
  const emailsArray = Array.isArray(emails) ? emails : []

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!context.companyName.trim() || !context.recipientName.trim()) {
      toast.error('Please fill in the required fields')
      return
    }

    try {
      const result = await generateEmail(emailType, context)
      if (result) {
        setGeneratedEmail(result)
        toast.success('Email generated successfully!')
      }
    } catch (error) {
      toast.error('Failed to generate email')
    }
  }

  const handleSendEmail = async (recipientEmail: string) => {
    if (!generatedEmail || !recipientEmail.trim()) {
      toast.error('Please provide recipient email')
      return
    }

    try {
      const success = await sendEmail({
        to: recipientEmail,
        subject: generatedEmail.subject,
        content: generatedEmail.content
      })
      
      if (success) {
        toast.success('Email sent successfully!')
        refetch()
      }
    } catch (error) {
      toast.error('Failed to send email')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const filteredEmails = emailsArray.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || email.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Edit3 className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const emailTypes = [
    { value: 'cold-outreach', label: 'Cold Outreach' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'meeting-request', label: 'Meeting Request' },
    { value: 'product-demo', label: 'Product Demo' }
  ]

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Email Writer</h1>
              <p className="text-gray-600">Create compelling sales emails with AI assistance</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Emails</p>
                  <p className="text-xl font-semibold text-gray-900">{emailsArray.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Send className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sent</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {emailsArray.filter(e => e.status === 'sent').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {emailsArray.filter(e => e.status === 'draft').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-xl font-semibold text-gray-900">24%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generate Email
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email History
            </button>
          </div>
        </div>

        {activeTab === 'generate' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Email Generation Form */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Details</h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Type
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {emailTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Company *
                      </label>
                      <input
                        type="text"
                        value={context.companyName}
                        onChange={(e) => setContext(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Acme Corp"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        value={context.recipientName}
                        onChange={(e) => setContext(prev => ({ ...prev, recipientName: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Company
                    </label>
                    <input
                      type="text"
                      value={context.recipientCompany}
                      onChange={(e) => setContext(prev => ({ ...prev, recipientCompany: e.target.value }))}
                      placeholder="Target Company Inc"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service
                    </label>
                    <input
                      type="text"
                      value={context.productService}
                      onChange={(e) => setContext(prev => ({ ...prev, productService: e.target.value }))}
                      placeholder="AI-powered business automation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pain Point to Address
                    </label>
                    <textarea
                      value={context.painPoint}
                      onChange={(e) => setContext(prev => ({ ...prev, painPoint: e.target.value }))}
                      placeholder="Manual processes taking too much time"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      value={context.callToAction}
                      onChange={(e) => setContext(prev => ({ ...prev, callToAction: e.target.value }))}
                      placeholder="Schedule a 15-minute demo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isGenerating ? (
                      <>
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Email
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Generated Email Preview */}
            <div>
              {generatedEmail ? (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Generated Email</h2>
                    <Button
                      onClick={() => setGeneratedEmail(null)}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={generatedEmail.subject}
                          onChange={(e) => setGeneratedEmail(prev => prev ? { ...prev, subject: e.target.value } : null)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Button
                          onClick={() => copyToClipboard(generatedEmail.subject)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Content
                      </label>
                      <div className="relative">
                        <textarea
                          value={generatedEmail.content}
                          onChange={(e) => setGeneratedEmail(prev => prev ? { ...prev, content: e.target.value } : null)}
                          rows={12}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                        <Button
                          onClick={() => copyToClipboard(generatedEmail.content)}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {generatedEmail.suggestions.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Suggestions
                        </label>
                        <div className="space-y-2">
                          {generatedEmail.suggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-green-800">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="email"
                          placeholder="recipient@company.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendEmail((e.target as HTMLInputElement).value)
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[type="email"]') as HTMLInputElement
                          if (input) handleSendEmail(input.value)
                        }}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Generated</h3>
                  <p className="text-gray-600">
                    Fill out the form and click "Generate Email" to create your sales email.
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Email History */
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {emailTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner className="w-8 h-8" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <Card className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                <p className="text-gray-600 mb-4">
                  {emailsArray.length === 0 
                    ? "You haven't generated any sales emails yet."
                    : "No emails match your search criteria."
                  }
                </p>
                <Button
                  onClick={() => setActiveTab('generate')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Email
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEmails.map((email) => (
                  <Card key={email.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(email.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {email.subject}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{email.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {email.type.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>{new Date(email.createdAt).toLocaleDateString()}</span>
                          {email.recipientEmail && (
                            <>
                              <span>•</span>
                              <span>To: {email.recipientEmail}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setSelectedEmail(email)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(email.content)}
                          size="sm"
                          variant="outline"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
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