'use client'

import { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  Calendar,
  FileType,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Summary {
  id: string
  title: string
  content: string
  keyPoints: string[]
  actionItems: string[]
  createdAt: string
  fileType: string
  fileSize: number
  status: 'completed' | 'processing' | 'failed'
}

export default function SummarizerPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload')
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [summaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'Q4 Financial Report.pdf',
      content: 'The Q4 financial report shows strong performance across all business units with revenue growth of 23% year-over-year. Key highlights include increased market share in the enterprise segment and successful cost optimization initiatives.',
      keyPoints: [
        'Revenue increased by 23% compared to Q4 last year',
        'Enterprise segment showed 35% growth',
        'Operating costs reduced by 12% through optimization',
        'Cash flow improved significantly',
        'Market share expanded in key regions'
      ],
      actionItems: [
        'Prepare investor presentation for Q1 board meeting',
        'Analyze enterprise segment expansion opportunities',
        'Continue cost optimization initiatives in Q1',
        'Review and update financial forecasts for next year'
      ],
      createdAt: '2024-01-15T10:30:00Z',
      fileType: 'PDF',
      fileSize: 2.4,
      status: 'completed'
    },
    {
      id: '2',
      title: 'Product Roadmap 2024.docx',
      content: 'The product roadmap outlines key initiatives for 2024, focusing on AI integration, mobile experience improvements, and enterprise features. Timeline spans across four quarters with major releases planned.',
      keyPoints: [
        'AI features to be integrated in Q2',
        'Mobile app redesign scheduled for Q3',
        'Enterprise dashboard launch in Q4',
        'API v3 release planned for Q1',
        'Security enhancements throughout the year'
      ],
      actionItems: [
        'Finalize AI integration specifications',
        'Begin mobile app design process',
        'Conduct enterprise customer interviews',
        'Start API v3 development'
      ],
      createdAt: '2024-01-14T14:20:00Z',
      fileType: 'DOCX',
      fileSize: 1.8,
      status: 'completed'
    }
  ])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file')
      return
    }

    setProcessing(true)
    try {
      // TODO: Implement file upload and processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('Document summarized successfully!')
      setActiveTab('history')
    } catch (error) {
      toast.error('Failed to process document')
    } finally {
      setProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || summary.fileType.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Document Summarizer
              </h1>
              <p className="text-gray-600">
                Upload any document and get instant summaries with key insights and action items.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">453 credits left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'upload', name: 'Upload Document', icon: Upload },
              { id: 'history', name: 'Summary History', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto">
            {!processing ? (
              <div className="space-y-8">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInput}
                  />
                  
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Upload your document
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Drag and drop your file here, or click to browse
                      </p>
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary"
                      >
                        Choose File
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Supports PDF, DOC, DOCX, TXT files up to 10MB
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card text-center">
                    <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Advanced AI extracts key insights and important information from your documents.
                    </p>
                  </div>
                  
                  <div className="card text-center">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Action Items</h3>
                    <p className="text-sm text-gray-600">
                      Get specific, actionable tasks and next steps based on your document content.
                    </p>
                  </div>
                  
                  <div className="card text-center">
                    <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Share2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Easy Sharing</h3>
                    <p className="text-sm text-gray-600">
                      Export summaries and share insights with your team instantly.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Processing State */
              <div className="card text-center py-16">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Processing your document...
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI is analyzing your document and extracting key insights. This usually takes 30-60 seconds.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search summaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-11"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input text-sm py-2 px-3"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="txt">TXT</option>
                </select>
                
                <button className="btn-secondary btn-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Summaries Grid */}
            {filteredSummaries.length > 0 ? (
              <div className="grid gap-6">
                {filteredSummaries.map((summary) => (
                  <div key={summary.id} className="card hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{summary.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <FileType className="w-4 h-4 mr-1" />
                              {summary.fileType}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(summary.createdAt).toLocaleDateString()}
                            </span>
                            <span>{summary.fileSize}MB</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedSummary(summary)}
                          className="btn-ghost btn-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button className="btn-ghost btn-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {summary.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {summary.keyPoints.length} key points
                        </span>
                        <span className="text-sm text-gray-500">
                          {summary.actionItems.length} action items
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(summary.content)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No summaries found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Upload your first document to get started'
                  }
                </p>
                {!searchQuery && filterType === 'all' && (
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="btn-primary"
                  >
                    Upload Document
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary Detail Modal */}
        {selectedSummary && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSummary(null)} />
              
              <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedSummary.title}
                    </h3>
                    <button
                      onClick={() => setSelectedSummary(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedSummary.content}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Points</h4>
                      <ul className="space-y-2">
                        {selectedSummary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
                      <ul className="space-y-2">
                        {selectedSummary.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => copyToClipboard(selectedSummary.content)}
                    className="btn-secondary"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <button className="btn-primary">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}