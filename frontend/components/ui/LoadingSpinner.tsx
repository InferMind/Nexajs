import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

// A polished dual-ring spinner with an accessible status role
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  } as const

  const borderSize = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-4',
  } as const

  return (
    <div className={`inline-flex items-center ${className}`} role="status" aria-live="polite" aria-busy="true">
      <span className={`relative inline-flex ${sizeClasses[size]}`}>
        {/* Background ring */}
        <span className={`absolute inset-0 rounded-full ${borderSize[size]} border-blue-200 opacity-40`} />
        {/* Spinning arc */}
        <span className={`absolute inset-0 rounded-full ${borderSize[size]} border-t-transparent border-blue-600 animate-spin`} />
        {/* Subtle glow */}
        <span className="absolute inset-0 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.25)]" />
      </span>
      {label && (
        <span className="ml-2 text-sm text-gray-600" aria-label={label}>
          {label}
        </span>
      )}
      <span className="sr-only">Loading</span>
    </div>
  )
}