import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'gradient' | 'glass'
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200'
  
  const variantClasses = {
    default: 'card',
    hover: 'card-hover',
    gradient: 'card-gradient',
    glass: 'glass'
  }
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className} ${
    onClick ? 'cursor-pointer' : ''
  }`
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}