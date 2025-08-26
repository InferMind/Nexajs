'use client'

import { useState } from 'react'
import { Mail, Send, Copy, Edit, Trash2, Plus, User, Building, Target } from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailTemplate {
  id: string
  type: 'cold' | 'follow-up' | 'proposal'
  subject: string
  content: string
  createdAt: string
}

interface CustomerData {
  name: string
  company: string
  email: string
  industry: string
  painPoint: string
  productInterest: string
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'sent'>('generate')
  const [emailType, setEmailType] = useState<'cold' | 'follow-up' | 'proposal'>('cold')
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    company: '',
    email: '',
    industry: '',
    painPoint: '',
    productInterest: ''
  })
  const [generatedEmail, setGeneratedEmail] = useState<EmailTemplate | null>(null)
  const [loading, setLoading] = useState(false)

  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      type: 'cold',
      subject: 'Boost Your Sales Team\'s Productivity by 40%',
      content: 'Hi [Name],\n\nI noticed [Company] has been expanding rapidly in the [Industry] space. Congratulations on your recent growth!\n\nI wanted to reach out because we\'ve helped similar companies like yours increase their sales productivity by up to 40% using our AI-powered sales tools...',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'follow-up',
      subject: 'Following up on our conversation about [Product]',
      content: 'Hi [Name],\n\nI wanted to follow up on our conversation last week about how [Product] could help [Company] with [Pain Point].\n\nAs promised, I\'ve attached a customized proposal that outlines...',
      createdAt: '2024-01-14T14:20:00Z'
    }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    })
  }

  const generateEmail = async () => {
    if (!customerData.name || !customerData.company) {
      toast.error('Please fill in at least customer name and company')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement AI email generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const emailTemplates = {
        cold: {
          subject: `Boost ${customerData.company}'s ${customerData.industry} Operations with AI`,
          content: `Hi ${customerData.name},

I hope this email finds you well. I came across ${customerData.company} and was impressed by your work in the ${customerData.industry} industry.

I'm reaching out because we've helped similar companies in your space overcome challenges related to ${customerData.painPoint || 'operational efficiency'}. Our AI-powered platform has enabled businesses like yours to:

• Reduce manual work by up to 60%
• Increase productivity by 40%
• Save $50K+ annually on operational costs

${customerData.productInterest ? `I noticed you might be interested in ${customerData.productInterest}, which is exactly what we specialize in.` : ''}

Would you be open to a brief 15-minute call this week to discuss how we could help ${customerData.company} achieve similar results?

Best regards,
[Your Name]

P.S. I'd be happy to share a case study of how we helped [Similar Company] achieve a 45% increase in efficiency within 3 months.`
        },
        'follow-up': {
          subject: `Following up: AI solutions for ${customerData.company}`,
          content: `Hi ${customerData.name},

I wanted to follow up on my previous email about how our AI platform could help ${customerData.company} with ${customerData.painPoint || 'your operational challenges'}.

I understand you're probably busy, but I thought you might be interested in this quick case study: We recently helped a ${customerData.industry} company similar to ${customerData.company} reduce their manual workload by 55% in just 2 months.

The results were:
• 40% faster processing times
• $75K annual savings
• 90% reduction in errors

Would you have 10 minutes this week for a quick call to see if we could achieve similar results for ${customerData.company}?

Best regards,
[Your Name]`
        },
        proposal: {
          subject: `Proposal: AI Transformation for ${customerData.company}`,
          content: `Hi ${customerData.name},

Thank you for your interest in our AI solutions for ${customerData.company}.

Based on our discussion about ${customerData.painPoint || 'your operational challenges'}, I've prepared a customized proposal that outlines how we can help ${customerData.company} achieve:

PHASE 1 (Month 1-2):
• Implementation of core AI modules
• Integration with your existing systems
• Team training and onboarding

PHASE 2 (Month 3-4):
• Advanced automation setup
• Custom workflow optimization
• Performance monitoring

EXPECTED OUTCOMES:
• 40-60% reduction in manual tasks
• $50K+ annual cost savings
• ROI within 6 months

Investment: Starting at $299/month for the Pro plan

I'd love to schedule a call to walk through this proposal and answer any questions you might have.

Best regards,
[Your Name]

P.S. We're offering a 30-day free trial for new clients this month.`
        }
      }

      const generated: EmailTemplate = {
        id: Date.now().toString(),
        type: emailType,
        subject: emailTemplates[emailType].subject,
        content: emailTemplates[emailType].content,
        createdAt: new Date().toISOString()
      }

      setGeneratedEmail(generated)
      toast.success('Email generated successfully!')
    } catch (error) {
      toast.error('Failed to generate email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const sendEmail = () => {
    if (!generatedEmail) return
    // TODO: Implement email sending
    toast.success('Email sent successfully!')
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Sales & Email Writer</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate cold emails, proposals, and follow-ups with AI. One-click send from dashboard.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'generate', name: 'Generate Email', icon: Plus },
              { id: 'templates', name: 'Templates', icon: Mail },
              { id: 'sent', name: 'Sent Emails', icon: Send }
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

        {/* Generate Email Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Email Type</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cold', name: 'Cold Email', icon: Target },
                    { id: 'follow-up', name: 'Follow-up', icon: Mail },
                    { id: 'proposal', name: 'Proposal', icon: Building }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEmailType(type.id as any)}
                      className={`p-3 rounded-lg border-2 text-center ${
                        emailType === type.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={customerData.name}
                          onChange={handleInputChange}
                          className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={customerData.company}
                          onChange={handleInputChange}
                          className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@acmecorp.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={customerData.industry}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pain Point / Challenge
                    </label>
                    <textarea
                      name="painPoint"
                      value={customerData.painPoint}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What challenges are they facing?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Interest
                    </label>
                    <input
                      type="text"
                      name="productInterest"
                      value={customerData.productInterest}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Which product/service are they interested in?"
                    />
                  </div>
                </div>

                <button
                  onClick={generateEmail}
                  disabled={loading}
                  className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Email'}
                </button>
              </div>
            </div>

            {/* Generated Email */}
            <div className="space-y-6">
              {generatedEmail ? (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Generated Email</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(generatedEmail.content)}
                        className="btn-secondary text-sm"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                      <button className="btn-secondary text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={sendEmail}
                        className="btn-primary text-sm"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={generatedEmail.subject}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Content
                      </label>
                      <textarea
                        value={generatedEmail.content}
                        rows={15}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="text-center py-12">
                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No email generated yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the customer information and click generate to create an AI-powered email
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Email Templates</h2>
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </button>
            </div>

            <div className="grid gap-6">
              {templates.map((template) => (
                <div key={template.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                          template.type === 'cold' 
                            ? 'bg-blue-100 text-blue-800'
                            : template.type === 'follow-up'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {template.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {template.subject}
                      </h3>
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {template.content}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Emails Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Sent Emails</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <Send className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No emails sent yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Emails you send through the platform will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}