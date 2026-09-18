'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Reveal({ children, className, delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [revealed, setRevealed] = useState(false)
  return (
    <motion.div
      className={`${className || ''} ${revealed ? 'is-revealed' : ''}`}
      onViewportEnter={() => setRevealed(true)}
      viewport={{ once: true, amount: 0.12 }}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}
