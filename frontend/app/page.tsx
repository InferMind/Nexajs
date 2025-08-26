'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Users, CheckCircle, Star, Play, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: '📄',
      title: 'AI Document Summarizer',
      description: 'Upload any document and get instant summaries with key insights and action items.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💬',
      title: 'Smart Support Assistant',
      description: 'Auto-generate FAQs and provide instant customer support with AI-powered chat.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '✉️',
      title: 'Sales Email Writer',
      description: 'Create compelling cold emails, follow-ups, and proposals that convert.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechStart',
      avatar: '👩‍💼',
      content: 'Nexa saved us 20+ hours per week on document processing. Game changer!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Sales Director, GrowthCo',
      avatar: '👨‍💼',
      content: 'Our email response rates increased by 40% using Nexa\'s AI writer.',
      rating: 5
    },
    {
      name: 'Lisa Park',
      role: 'Operations Manager, ScaleCorp',
      avatar: '👩‍💻',
      content: 'The support assistant handles 80% of our customer queries automatically.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Nexa</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Business Assistant
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-powered
              <span className="gradient-text block">business assistant</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Save time and money across operations, sales, and support with our intelligent AI tools. 
              One platform, endless possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/signup" className="btn-primary btn-lg group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary btn-lg group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Free 5 credits
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three powerful AI modules
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate your business processes and boost productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover group"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-blue-100">Documents Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-blue-100">Happy Businesses</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-blue-100">Time Saved</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-blue-100">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by businesses worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about Nexa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="card">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <p className="text-gray-600 mb-6">Perfect for trying out Nexa</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    5 credits per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    All AI modules
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Basic support
                  </li>
                </ul>
                <Link href="/auth/signup" className="btn-secondary w-full">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$29</div>
                <p className="text-gray-600 mb-6">For growing businesses</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    500 credits per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    All AI modules
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Advanced exports
                  </li>
                </ul>
                <Link href="/auth/signup" className="btn-primary w-full">
                  Start Pro Trial
                </Link>
              </div>
            </div>

            {/* Business Plan */}
            <div className="card">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$99</div>
                <p className="text-gray-600 mb-6">For teams and enterprises</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Unlimited credits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    All AI modules
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Team management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Custom integrations
                  </li>
                </ul>
                <Link href="/auth/signup" className="btn-secondary w-full">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using Nexa to save time and increase productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Start Free Trial
            </Link>
            <button className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Nexa</span>
              </div>
              <p className="text-gray-400">
                Your AI-powered assistant for every part of business.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nexa AI Business Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}