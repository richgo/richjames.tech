'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin } from 'lucide-react'
import type { BlogPost } from '@/lib/markdown'

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const maxScroll = documentHeight - windowHeight
      const progress = (scrollTop / maxScroll) * 100

      setScrollProgress(progress)
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / 200)
  }

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <motion.div
          className="h-full bg-indigo-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <article className="min-h-screen bg-slate-900 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-5xl font-bold text-slate-50 leading-tight flex-1">
                {post.frontMatter.title}
              </h1>
              {post.frontMatter.linkedinUrl && (
                <a
                  href={post.frontMatter.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 whitespace-nowrap text-sm font-medium"
                >
                  <Linkedin className="w-4 h-4" />
                  View on LinkedIn
                </a>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-400 mb-6">
              {post.frontMatter.date && (
                <time className="text-lg">
                  {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              <span>•</span>
              <span className="text-lg">{calculateReadingTime(post.content)} min read</span>
            </div>

            {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.frontMatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-slate-50 prose-headings:font-bold prose-headings:leading-tight
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-snug
              prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:leading-snug
              prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4 prose-h4:leading-snug
              prose-h5:text-lg prose-h5:mt-6 prose-h5:mb-3 prose-h5:leading-snug
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-5
              prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
              prose-strong:text-slate-50 prose-strong:font-semibold
              prose-code:text-pink-400 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg prose-pre:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6
              prose-ul:text-slate-300 prose-ul:my-6 prose-ul:space-y-2 prose-ol:text-slate-300 prose-ol:my-6 prose-ol:space-y-2
              prose-li:my-2 prose-li:leading-relaxed
              prose-img:my-8 prose-img:rounded-lg prose-img:w-full prose-img:h-auto"
          >
            <ReactMarkdown
              components={{
                pre: ({ children, ...props }) => {
                  const codeContent = typeof children === 'object' && children && 'props' in children
                    ? String((children as any).props?.children || '')
                    : String(children)
                  const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
                  
                  return (
                    <div className="relative group">
                      <pre {...props} className="!pr-16">
                        {children}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(codeContent, codeId)}
                        className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium rounded bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-600 transition-all duration-200"
                        aria-label="Copy code"
                      >
                        {copiedCode === codeId ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  )
                },
                code: ({ className, children, ...props }) => {
                  const isInline = !className
                  if (isInline) {
                    return <code {...props}>{children}</code>
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                img: ({ src, alt, ...props }) => {
                  return (
                    <img
                      src={src}
                      alt={alt}
                      {...props}
                      className="w-full h-auto rounded-lg my-8 block bg-transparent"
                      style={{ margin: '2rem 0', padding: 0, background: 'transparent' }}
                    />
                  )
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-16 border-t border-slate-800"
            >
              <h2 className="text-3xl font-bold text-slate-50 mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-slate-50 mb-3 group-hover:text-indigo-400 transition-colors">
                      {relatedPost.frontMatter.title}
                    </h3>
                    {relatedPost.frontMatter.description && (
                      <p className="text-slate-400 text-sm line-clamp-3">
                        {relatedPost.frontMatter.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </article>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all duration-200 z-40"
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
