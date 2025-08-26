// Mock data service for development mode
export const mockData = {
  // User data
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    plan: 'pro',
    credits: 453,
    avatar: '/avatars/john.jpg'
  },

  // Dashboard stats
  stats: [
    {
      title: 'Documents Processed',
      value: '23',
      total: '50',
      change: '+12%',
      trend: 'up' as const,
      icon: 'FileText',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Support Queries',
      value: '9',
      total: '20',
      change: '+8%',
      trend: 'up' as const,
      icon: 'MessageSquare',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Emails Generated',
      value: '15',
      total: '30',
      change: '+25%',
      trend: 'up' as const,
      icon: 'Mail',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Credits Used',
      value: '47',
      total: '500',
      change: '-5%',
      trend: 'down' as const,
      icon: 'Zap',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ],

  // Recent activities
  activities: [
    {
      id: '1',
      type: 'document',
      title: 'Processed Q4 Financial Report',
      description: 'Generated summary with 5 key insights',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'email',
      title: 'Created follow-up email sequence',
      description: 'Generated 3 personalized emails',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'support',
      title: 'Handled customer inquiry',
      description: 'Provided automated response',
      time: '6 hours ago',
      status: 'completed'
    }
  ],

  // Document summaries
  summaries: [
    {
      id: '1',
      title: 'Q4 Financial Report.pdf',
      content: 'The Q4 financial report shows strong performance across all business units with revenue growth of 23% year-over-year. Key highlights include increased market share in the enterprise segment and successful cost optimization initiatives.',
      keyPoints: [
        'Revenue increased by 23% compared to Q4 last year',
        'Enterprise segment showed 35% growth',
        'Cost optimization saved $2.3M annually',
        'Customer retention rate improved to 94%',
        'New product launches contributed 15% to total revenue'
      ],
      actionItems: [
        'Schedule Q1 planning meeting with department heads',
        'Review and approve budget allocation for new initiatives',
        'Prepare investor presentation for upcoming board meeting',
        'Analyze competitor pricing strategies'
      ],
      createdAt: '2024-01-15T10:30:00Z',
      fileType: 'PDF',
      fileSize: 2.4,
      status: 'completed' as const
    },
    {
      id: '2',
      title: 'Marketing Strategy 2024.docx',
      content: 'The 2024 marketing strategy focuses on digital transformation and customer experience enhancement. Key initiatives include social media expansion, content marketing, and personalization.',
      keyPoints: [
        'Digital channels to account for 70% of marketing spend',
        'Content marketing budget increased by 40%',
        'New CRM system implementation planned for Q2',
        'Influencer partnerships to expand by 50%'
      ],
      actionItems: [
        'Hire 2 additional content creators',
        'Evaluate CRM system vendors',
        'Launch influencer outreach program',
        'Set up marketing automation workflows'
      ],
      createdAt: '2024-01-14T14:20:00Z',
      fileType: 'DOCX',
      fileSize: 1.8,
      status: 'completed' as const
    }
  ],

  // Support queries
  supportQueries: [
    {
      id: '1',
      subject: 'How to reset password?',
      message: 'I forgot my password and cannot access my account. Can you help me reset it?',
      response: 'I can help you reset your password. Please click on the "Forgot Password" link on the login page and follow the instructions. You\'ll receive an email with a reset link within a few minutes.',
      status: 'resolved' as const,
      createdAt: '2024-01-15T09:15:00Z',
      category: 'account'
    },
    {
      id: '2',
      subject: 'Billing question about credits',
      message: 'I\'m confused about how credits work. Do they roll over to the next month?',
      response: 'Credits in your current plan do roll over to the next month, but they expire after 12 months of inactivity. You can always check your credit balance and expiration dates in your billing dashboard.',
      status: 'resolved' as const,
      createdAt: '2024-01-14T16:45:00Z',
      category: 'billing'
    }
  ],

  // Sales emails
  salesEmails: [
    {
      id: '1',
      subject: 'Follow-up: AI Solutions Demo',
      content: 'Hi [Name],\n\nThank you for taking the time to see our AI solutions demo yesterday. I hope you found it valuable and can see how our platform could help streamline your business processes.\n\nAs discussed, our AI-powered document summarizer could save your team approximately 15 hours per week, while our customer support assistant could handle 60% of routine inquiries automatically.\n\nI\'d love to schedule a follow-up call to discuss how we can customize our solution for your specific needs. Are you available for a 30-minute call this week?\n\nBest regards,\n[Your Name]',
      type: 'follow-up' as const,
      createdAt: '2024-01-15T11:00:00Z',
      status: 'sent' as const
    },
    {
      id: '2',
      subject: 'Introducing Nexa AI - Transform Your Business',
      content: 'Hello [Name],\n\nI hope this email finds you well. I\'m reaching out because I noticed your company has been growing rapidly, and I believe our AI business platform could help you scale even more efficiently.\n\nNexa AI offers:\n• Automated document processing and summarization\n• Intelligent customer support assistance\n• AI-powered sales email generation\n• Advanced analytics and insights\n\nWould you be interested in a 15-minute demo to see how we\'ve helped similar companies reduce operational costs by 30% while improving customer satisfaction?\n\nI\'d be happy to show you exactly how this would work for your business.\n\nBest regards,\n[Your Name]',
      type: 'cold-outreach' as const,
      createdAt: '2024-01-14T13:30:00Z',
      status: 'draft' as const
    }
  ]
}

// Mock API functions
export const mockApi = {
  // Simulate API delay
  delay: (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Authentication
  login: async (email: string, password: string) => {
    await mockApi.delay()
    if (email === 'demo@nexa.ai' && password === 'demo123') {
      return { success: true, user: mockData.user }
    }
    throw new Error('Invalid credentials')
  },

  signup: async (userData: any) => {
    await mockApi.delay(1500)
    return { success: true, user: { ...mockData.user, ...userData } }
  },

  // Document processing
  processDocument: async (file: File) => {
    await mockApi.delay(3000)
    const newSummary = {
      id: Date.now().toString(),
      title: file.name,
      content: 'This is a mock summary of your uploaded document. In a real implementation, this would contain AI-generated insights and key points extracted from your document.',
      keyPoints: [
        'Key insight extracted from document',
        'Important finding or trend identified',
        'Actionable recommendation based on content',
        'Statistical highlight or metric'
      ],
      actionItems: [
        'Follow up on identified opportunities',
        'Review recommendations with team',
        'Implement suggested improvements'
      ],
      createdAt: new Date().toISOString(),
      fileType: file.type.includes('pdf') ? 'PDF' : 'DOCX',
      fileSize: file.size / (1024 * 1024),
      status: 'completed' as const
    }
    return newSummary
  },

  // Support
  generateSupportResponse: async (query: string) => {
    await mockApi.delay(2000)
    return {
      response: 'Thank you for your inquiry. This is a mock AI-generated response. In a real implementation, this would provide a helpful and contextual answer based on your question.',
      confidence: 0.95,
      suggestedActions: [
        'Check our documentation',
        'Contact support team',
        'Schedule a demo call'
      ]
    }
  },

  // Sales emails
  generateSalesEmail: async (type: string, context: any) => {
    await mockApi.delay(2500)
    const templates = {
      'cold-outreach': 'This is a mock cold outreach email generated by AI. It would be personalized based on the prospect\'s company and industry.',
      'follow-up': 'This is a mock follow-up email that would reference previous conversations and provide next steps.',
      'proposal': 'This is a mock proposal email that would outline your solution and value proposition.'
    }
    
    return {
      subject: `Mock ${type} email subject`,
      content: templates[type as keyof typeof templates] || 'Mock email content',
      suggestions: [
        'Personalize the greeting',
        'Add specific company details',
        'Include a clear call-to-action'
      ]
    }
  }
}

export default mockData