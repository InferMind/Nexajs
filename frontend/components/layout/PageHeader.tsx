import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="text-gray-400 mx-2">/</span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-sm text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}