import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'badge'
  
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}