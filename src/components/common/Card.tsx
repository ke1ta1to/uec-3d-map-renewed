'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  variant?: 'dark' | 'darker'
}

export default function Card({ children, className = '', title, variant = 'dark' }: CardProps) {
  const baseClasses = 'rounded-lg border text-white backdrop-blur-sm'
  const variantClasses = {
    dark: 'bg-black/70 border-gray-600',
    darker: 'bg-black/80 border-gray-600'
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-600">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}