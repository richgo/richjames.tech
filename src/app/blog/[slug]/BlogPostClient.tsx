'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowUp, ArrowUpRight } from 'lucide-react'
import PostCard from '@/components/PostCard'
import Reveal from '@/components/Reveal'
import type { BlogPost } from '@/lib/markdown'

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const pre = useRef<HTMLPreElement>(null)
  const [status, setStatus] = useState('')

  const copy = async () => {
    if (!pre.current) return
    try {
      await navigator.clipboard.writeText(pre.current.textContent || '')
      setStatus('Copied')
    } catch {
      setStatus('Could not copy. Select the code and copy it manually.')
    }
  }

  return (
    <div className="relative">
      <pre ref={pre} {...props} className="!pt-14">{children}</pre>
      <button type="button" onClick={copy} className="absolute right-3 top-3 rounded border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-amber-200">Copy code</button>
      <span role="status" className="block text-xs text-slate-300">{status}</span>
    </div>
  )
}

const markdownComponents: Components = {
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  img: ({ src, alt, title }) => (
    // Markdown images can have arbitrary dimensions; keep diagrams at their natural aspect ratio.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ''} title={title} loading="lazy" decoding="async" className="h-auto w-full" />
  ),
}

export default function BlogPostClient({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const reducedMotion = useReducedMotion()
  const article = useRef<HTMLElement>(null)
  const { frontMatter } = post

  useEffect(() => {
    const handleScroll = () => {
      const element = article.current
      if (!element) return
      const start = element.getBoundingClientRect().top + window.scrollY
      const distance = element.offsetHeight - window.innerHeight
      setScrollProgress(distance > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / distance)) : 1)
      setShowScrollTop(window.scrollY > 500)
    }
    handleScroll()
    const observer = new ResizeObserver(handleScroll)
    if (article.current) observer.observe(article.current)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <div className="article-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <article ref={article} className="article-shell">
        <header className="article-heading">
          <Link href="/blog" className="button-text"><ArrowLeft size={15} /> Back to the field notes</Link>
          <h1>{frontMatter.title}</h1>
          {frontMatter.description && <p className="article-description">{frontMatter.description}</p>}
          <div className="article-meta">
            <span>Rich James</span><span aria-hidden="true">/</span>
            <time dateTime={new Date(frontMatter.date).toISOString()}>{new Date(frontMatter.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time>
            <span aria-hidden="true">/</span><span>{Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read</span>
            {frontMatter.linkedinUrl && <a href={frontMatter.linkedinUrl} target="_blank" rel="noopener noreferrer" className="button-text">View on LinkedIn <ArrowUpRight size={14} /></a>}
          </div>
          {frontMatter.tags && <div className="article-tags">{frontMatter.tags.map(tag => <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>}
        </header>

        {frontMatter.featuredimage && <div className="article-cover">
          <Image
            src={frontMatter.featuredimage}
            alt={frontMatter.featuredimagealt || frontMatter.title}
            fill priority sizes="(max-width: 1164px) 95vw, 1100px"
            className="object-contain"
          />
        </div>}

        <div className="article-body prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-50 prose-strong:text-slate-100 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-img:rounded-lg">
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </article>

      {relatedPosts.length > 0 && <section className="site-container article-related">
        <div className="section-heading"><div><p className="eyebrow">FOLLOW THE THREAD</p><h2>A little more <em>to explore.</em></h2></div></div>
        <div className="post-grid mb-20">
          {relatedPosts.map((related, index) => <Reveal key={related.slug} delay={index * .06}><PostCard post={related} /></Reveal>)}
        </div>
      </section>}
      {showScrollTop && <motion.button
        type="button"
        initial={false}
        whileHover={reducedMotion ? undefined : { y: -3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-slate-600 bg-slate-800 p-3 text-slate-100 shadow-xl"
        aria-label="Scroll to top"
      ><ArrowUp size={20} /></motion.button>}
    </>
  )
}
