'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react'

interface Post {
  slug: string
  frontMatter: {
    title: string
    date?: string
    description?: string
    tags?: string[]
  }
}

interface TagPageClientProps {
  tag: string
  posts: Post[]
}

export default function TagPageClient({ tag, posts }: TagPageClientProps) {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link 
            href="/tags"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all tags
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center">
              <TagIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-50">
                {tag}
              </h1>
              <p className="text-slate-400 mt-1">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.frontMatter.title}
                </h2>
              </Link>
              
              {post.frontMatter.date && (
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.frontMatter.date}>
                    {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              
              {post.frontMatter.description && (
                <p className="text-slate-300 leading-relaxed mb-4">
                  {post.frontMatter.description}
                </p>
              )}
              
              {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.frontMatter.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/tags/${t}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        t === tag
                          ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-indigo-400'
                      }`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
