'use client'

import { useState } from 'react'
import { CreditCard, Check, Zap, Building, Users } from 'lucide-react'

export default function BillingPage() {
  const [currentPlan] = useState('free')
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      credits: 5,
      features: [
        'Try each module',
        'Basic support',
        'Export results',
        '5 credits/month'
      ],
      icon: Zap,
      color: 'text-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      credits: 500,
      features: [
        'All modules included',
        'Priority support',
        'Advanced exports',
        'Team collaboration',
        '500 credits/month'
      ],
      icon: CreditCard,
      color: 'text-primary-600',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 99,
      credits: 'Unlimited',
      features: [
        'Unlimited usage',
        'Dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'Team management'
      ],
      icon: Building,
      color: 'text-purple-600'
    }
  ]

  const handleUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      // TODO: Implement Stripe checkout
      console.log('Upgrading to:', planId)
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your subscription and monitor your usage.
          </p>
        </div>

        {/* Current Usage */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-2xl font-semibold text-gray-900 capitalize">{currentPlan}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Used</p>
                <p className="text-2xl font-semibold text-gray-900">47 / 500</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">47</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Billing</p>
                <p className="text-2xl font-semibold text-gray-900">Jan 15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="card mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Document Summarizer</span>
                <span>23 credits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '46%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Email Writer</span>
                <span>15 credits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Support Assistant</span>
                <span>9 credits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card relative ${
                  plan.popular ? 'border-primary-500 border-2' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <plan.icon className={`h-12 w-12 mx-auto mb-4 ${plan.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-500">/month</span>}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {typeof plan.credits === 'number' 
                      ? `${plan.credits} credits/month`
                      : `${plan.credits} credits`
                    }
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || currentPlan === plan.id}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentPlan === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No billing history yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your billing history will appear here after your first payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}