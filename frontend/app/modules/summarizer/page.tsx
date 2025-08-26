'use client'

import { useState } from 'react'
import { Upload, FileText, Download, Share2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Summary {
  id: string
  title: string
  content: string
  keyPoints: string[]
  actionItems: string[]
  createdAt: string
}

export default function SummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [dragActive, setDragActive] = useState(false)

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
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to summarize')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement file upload and AI summarization
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockSummary: Summary = {
        id: '1',
        title: file.name,
        content: `This document discusses the quarterly business review meeting held on ${new Date().toLocaleDateString()}. The meeting covered various aspects of business performance, strategic initiatives, and future planning. Key stakeholders presented their departmental updates and outlined upcoming projects and challenges.`,
        keyPoints: [
          'Q4 revenue exceeded targets by 15%',
          'New product launch scheduled for Q2 2024',
          'Team expansion planned for engineering department',
          'Customer satisfaction scores improved by 12%',
          'Market expansion into European markets approved'
        ],
        actionItems: [
          'Finalize budget allocation for Q1 2024 by end of month',
          'Schedule follow-up meetings with department heads',
          'Prepare detailed project timelines for new product launch',
          'Conduct market research for European expansion',
          'Review and update customer feedback processes'
        ],
        createdAt: new Date().toISOString()
      }
      
      setSummary(mockSummary)
      toast.success('Document summarized successfully!')
    } catch (error) {
      toast.error('Failed to summarize document. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!summary) return
    
    const exportData = {
      title: summary.title,
      summary: summary.content,
      keyPoints: summary.keyPoints,
      actionItems: summary.actionItems,
      createdAt: summary.createdAt
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `summary-${summary.title}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Summary exported successfully!')
  }

  const handleShare = () => {
    if (!summary) return
    
    const shareText = `Summary of ${summary.title}\n\n${summary.content}\n\nKey Points:\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\nAction Items:\n${summary.actionItems.map(item => `• ${item}`).join('\n')}`
    
    if (navigator.share) {
      navigator.share({
        title: `Summary: ${summary.title}`,
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Summary copied to clipboard!')
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Meeting & Document Summarizer</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload meetings, contracts, or reports to get clear summaries and key action items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 ${
                    dragActive 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {file ? file.name : 'Drop files here or click to upload'}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.txt,.md"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT, MD up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Summary
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent Summaries */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Summaries</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Q4 Planning Meeting</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-500 text-sm">
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contract Review</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-500 text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Results */}
          <div className="space-y-6">
            {summary ? (
              <>
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Summary</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleExport}
                        className="btn-secondary text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </button>
                      <button
                        onClick={handleShare}
                        className="btn-secondary text-sm"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {summary.content}
                    </p>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Points</h3>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-2 w-2 bg-primary-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Action Items</h3>
                  <ul className="space-y-2">
                    {summary.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <input
                          type="checkbox"
                          className="flex-shrink-0 h-4 w-4 text-primary-600 border-gray-300 rounded mt-1 mr-3"
                        />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No summary yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a document to generate an AI-powered summary
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}