import React from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${
    Icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : ''
  } ${className}`
  
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input className={inputClasses} {...props} />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helpText && !error && <p className="form-help">{helpText}</p>}
    </div>
  )
}