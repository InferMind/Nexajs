import React from 'react'
import { LucideIcon } from 'lucide-react'

interface AppIconProps {
  icon: LucideIcon
  gradient: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  hover?: boolean
}

export const AppIcon: React.FC<AppIconProps> = ({
  icon: Icon,
  gradient,
  size = 'md',
  className = '',
  hover = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }
  
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }
  
  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-2xl 
      bg-gradient-to-r ${gradient} 
      flex items-center justify-center 
      ${hover ? 'group-hover:scale-110 transition-transform' : ''}
      ${className}
    `}>
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  )
}