'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/lib/markdown'

interface BlogListClientProps {
  posts: BlogPost[]
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / 200)
  }

  return (
    <section className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-50 mb-4">Blog</h1>
          <p className="text-xl text-slate-400 mb-12">Technical articles and insights</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  {/* Featured image placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-pink-500 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-300" />
                    <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center text-6xl">
                      📝
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-50 mb-3 group-hover:text-indigo-400 transition-colors">
                      <span className="relative inline-block">
                        {post.frontMatter.title}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                      </span>
                    </h2>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      {post.frontMatter.date && (
                        <time>
                          {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      )}
                      <span>•</span>
                      <span>{calculateReadingTime(post.content)} min read</span>
                    </div>
                    
                    {post.frontMatter.description && (
                      <p className="text-slate-300 mb-4 line-clamp-3 flex-1">
                        {post.frontMatter.description}
                      </p>
                    )}
                    
                    {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.frontMatter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
