'use client'

import { motion } from 'framer-motion'
import { useState, type RefObject } from 'react'

export default function Reveal({ children, className, delay = 0, root }: {
  children: React.ReactNode
  className?: string
  delay?: number
  root?: RefObject<Element | null>
}) {
  const [revealed, setRevealed] = useState(false)
  return (
    <motion.div
      className={`${className || ''} ${revealed ? 'is-revealed' : ''}`}
      onViewportEnter={() => setRevealed(true)}
      viewport={{ once: true, amount: 0.12, root }}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}
