'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: number
  color?: string
}

export default function LoadingSpinner({ size = 40, color = 'currentColor' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center h-screen" role="status">
      <motion.div
        className="rounded-full border-4 border-t-4"
        style={{
          width: size,
          height: size,
          borderColor: `${color}33`,
          borderTopColor: color,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity,
        }}
        aria-label="Loading"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

