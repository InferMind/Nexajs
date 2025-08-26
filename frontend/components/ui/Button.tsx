import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn focus-ring'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    outline: 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700'
  }
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'px-6 py-3',
    lg: 'btn-lg'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
        </>
      )}
    </button>
  )
}