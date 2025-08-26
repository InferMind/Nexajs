'use client'

import { useState, useEffect } from 'react'
import { authAPI, dashboardAPI, setAuthToken } from '@/lib/api'
import { Card } from '@/components/ui'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestConnectionPage() {
  const [tests, setTests] = useState([
    { name: 'Backend Health Check', status: 'pending', result: null },
    { name: 'User Registration', status: 'pending', result: null },
    { name: 'User Login', status: 'pending', result: null },
    { name: 'Dashboard Stats', status: 'pending', result: null },
  ])

  const updateTest = (index: number, status: 'success' | 'error', result: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, result } : test
    ))
  }

  const runTests = async () => {
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', result: null })))

    try {
      // Test 1: Backend Health Check
      const healthResponse = await fetch('http://localhost:3001/health')
      const healthData = await healthResponse.json()
      updateTest(0, 'success', healthData)
    } catch (error) {
      updateTest(0, 'error', error.message)
      return // Stop if backend is not running
    }

    try {
      // Test 2: User Registration
      const testEmail = `test-${Date.now()}@example.com`
      const registerData = await authAPI.register({
        email: testEmail,
        password: 'password123',
        name: 'Test User',
        company: 'Test Company',
        plan: 'free'
      })
      updateTest(1, 'success', registerData)

      // Store token for next test
      if (registerData.token) {
        setAuthToken(registerData.token)
      }
    } catch (error) {
      updateTest(1, 'error', error.message)
    }

    try {
      // Test 3: User Login (using the same credentials)
      const testEmail = `test-${Date.now() - 1000}@example.com` // Use a different email
      await authAPI.register({
        email: testEmail,
        password: 'password123',
        name: 'Test User Login',
        company: 'Test Company',
        plan: 'free'
      })

      const loginData = await authAPI.login({
        email: testEmail,
        password: 'password123'
      })
      updateTest(2, 'success', loginData)

      // Store token for next test
      if (loginData.token) {
        setAuthToken(loginData.token)
      }
    } catch (error) {
      updateTest(2, 'error', error.message)
    }

    try {
      // Test 4: Dashboard Stats
      const statsData = await dashboardAPI.getStats()
      updateTest(3, 'success', statsData)
    } catch (error) {
      updateTest(3, 'error', error.message)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Frontend-Backend Connection Test
          </h1>
          <p className="text-gray-600">
            Testing the connection between the Next.js frontend and Node.js backend
          </p>
        </div>

        <div className="grid gap-6">
          {tests.map((test, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {test.name}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  test.status === 'success' ? 'bg-green-100 text-green-800' :
                  test.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {test.status === 'pending' ? 'Running...' : test.status}
                </span>
              </div>
              
              {test.result && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Result:</h4>
                  <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                    {typeof test.result === 'string' 
                      ? test.result 
                      : JSON.stringify(test.result, null, 2)
                    }
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={runTests}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Tests Again
          </button>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Connection Status
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Frontend:</strong> http://localhost:3000</p>
            <p><strong>Backend:</strong> http://localhost:3001</p>
            <p><strong>Mock Data:</strong> {process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ? 'Enabled' : 'Disabled'}</p>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
          </div>
        </div>
      </div>
    </div>
  )
}