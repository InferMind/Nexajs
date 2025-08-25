'use client'

import { useState } from 'react'
import { MessageSquare, Plus, Settings, Bot, User, Send, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: string
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'faqs' | 'setup'>('chat')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI support assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.',
      category: 'Account'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for subscription payments.',
      category: 'Billing'
    },
    {
      id: '3',
      question: 'How do I upgrade my plan?',
      answer: 'You can upgrade your plan anytime from the Billing section in your dashboard. Changes take effect immediately.',
      category: 'Billing'
    }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Thank you for your message. I\'m processing your request and will provide a helpful response based on your documentation and knowledge base.',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const generateFAQs = async () => {
    toast.success('Generating FAQs from your documentation...')
    // TODO: Implement AI FAQ generation
  }

  const categories = ['All', 'Account', 'Billing', 'Features', 'Technical']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Customer Support Assistant</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect your website/email/chat and let AI handle customer support automatically.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'chat', name: 'Live Chat', icon: MessageSquare },
              { id: 'faqs', name: 'FAQs', icon: Plus },
              { id: 'setup', name: 'Setup', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="card h-96 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <Bot className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">AI Support Chat</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-primary-600' 
                            : 'bg-gray-200'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Chat Stats */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chat Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Conversations</span>
                    <span className="text-sm font-medium text-gray-900">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resolved Automatically</span>
                    <span className="text-sm font-medium text-gray-900">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="text-sm font-medium text-gray-900">2.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-gray-900">4.8/5</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Queries</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Password reset help</p>
                    <p className="text-gray-500">Resolved automatically</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Billing question</p>
                    <p className="text-gray-500">Escalated to human</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Feature request</p>
                    <p className="text-gray-500">Resolved automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedCategory === category
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={generateFAQs}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate FAQs
              </button>
            </div>

            <div className="grid gap-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="max-w-2xl space-y-8">
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Knowledge Base Setup</h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload your documentation, policies, and knowledge base to train your AI assistant.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <button className="btn-primary">
                      Upload Documents
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      PDF, DOC, TXT files up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Uploaded Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">Product Documentation.pdf</span>
                    <span className="text-xs text-gray-500">2.3 MB</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">FAQ Guidelines.docx</span>
                    <span className="text-xs text-gray-500">1.1 MB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Integration Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Integration
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="https://yourwebsite.com"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button className="btn-secondary">Connect</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Integration
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      placeholder="support@yourcompany.com"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button className="btn-secondary">Connect</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slack Integration
                  </label>
                  <button className="btn-secondary w-full">
                    Connect to Slack Workspace
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">AI Behavior Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Tone
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Casual</option>
                    <option>Formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escalation Threshold
                  </label>
                  <select className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    <option>Low - Escalate complex queries</option>
                    <option>Medium - Escalate when uncertain</option>
                    <option>High - Try to resolve everything</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="auto-learn"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-learn" className="ml-2 block text-sm text-gray-900">
                    Enable automatic learning from conversations
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}