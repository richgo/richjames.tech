'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface TagCount {
  tag: string
  count: number
}

interface TagsClientProps {
  tagCounts: TagCount[]
}

export default function TagsClient({ tagCounts }: TagsClientProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null)
  
  const maxCount = Math.max(...tagCounts.map(t => t.count))
  
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-50 mb-6">
            Browse by Tag
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore posts organized by topics and technologies
          </p>
        </motion.div>

        {/* Tag Cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto"
        >
          {tagCounts.map(({ tag, count }, index) => {
            // Size based on post count (1.0 to 2.5 scale)
            const scale = 1 + (count / maxCount) * 1.5
            const fontSize = `${scale}rem`
            
            return (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onHoverStart={() => setHoveredTag(tag)}
                onHoverEnd={() => setHoveredTag(null)}
              >
                <Link 
                  href={`/tags/${tag}`}
                  className="block relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontSize }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all cursor-pointer ${
                      hoveredTag === tag
                        ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-500/50'
                        : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:border-indigo-500/50'
                    }`}
                  >
                    <span>{tag}</span>
                    <motion.span
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: hoveredTag === tag ? 1 : 0.6 }}
                      className="ml-2 text-sm"
                    >
                      ({count})
                    </motion.span>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-slate-800/30 backdrop-blur-sm rounded-full px-8 py-4 border border-slate-700/50">
            <p className="text-slate-300">
              <span className="text-2xl font-bold text-indigo-400">{tagCounts.length}</span>
              <span className="ml-2">unique tags</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
