'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { MarkdownContent } from '@/lib/markdown'

interface HomeClientProps {
  posts: MarkdownContent[]
}

const techStack = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 
  'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST APIs', 'Microservices', 'CI/CD', 'Terraform'
]

function HeroSection() {
  const headline = "Hi, I'm Rich James"
  const words = headline.split(' ')

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-pink-500/20 to-purple-500/20">
        <div className="animate-gradient-slow absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-indigo-500/20 to-blue-500/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 text-center">
        {/* Animated headline */}
        <div className="mb-6 overflow-hidden">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="inline-block text-5xl font-bold text-slate-50 sm:text-6xl md:text-7xl"
            >
              {word}
              {i < words.length - 1 && '\u00A0'}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: words.length * 0.2 }}
          className="mb-8 text-xl text-slate-400 sm:text-2xl"
        >
          Chief Engineer • Building the future of digital
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: words.length * 0.2 + 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/blog"
            className="group relative overflow-hidden rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            Read Blog →
          </Link>
          <Link
            href="/contact"
            className="group relative overflow-hidden rounded-lg border-2 border-slate-700 bg-slate-800/50 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-600 hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]"
          >
            Get in Touch
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: words.length * 0.2 + 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-slate-400"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 10%) scale(1.1); }
          66% { transform: translate(-10%, 5%) scale(0.9); }
        }
        .animate-gradient-slow {
          animation: gradient-slow 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

function RecentPostsSection({ posts }: { posts: MarkdownContent[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="bg-slate-900 px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-4xl font-bold text-slate-50"
        >
          Recent Posts
        </motion.h2>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-slate-800 p-6 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Date */}
              {post.frontMatter.date && (
                <time className="mb-3 block text-sm text-slate-400">
                  {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-slate-50 transition-colors group-hover:text-indigo-400">
                <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                  {post.frontMatter.title}
                </Link>
              </h3>

              {/* Description */}
              {post.frontMatter.description && (
                <p className="mb-4 text-slate-400">{post.frontMatter.description}</p>
              )}

              {/* Tags */}
              {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.frontMatter.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: posts.length * 0.1 + 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-700 px-6 py-3 font-semibold text-slate-300 transition-all hover:border-indigo-500 hover:text-indigo-400"
          >
            View all posts
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function TechStackMarquee() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="overflow-hidden bg-slate-800 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center text-3xl font-bold text-slate-50"
      >
        Tech Stack
      </motion.h2>

      {/* Marquee */}
      <div className="relative">
        <div className="marquee-container group">
          <div className="marquee flex gap-8">
            {[...techStack, ...techStack].map((tech, index) => (
              <span
                key={index}
                className="whitespace-nowrap text-2xl font-semibold text-slate-500 transition-all duration-300 grayscale hover:text-indigo-400 hover:grayscale-0 group-hover:pause-animation"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
        }
        .marquee {
          animation: scroll 30s linear infinite;
        }
        .group:hover .marquee {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default function HomeClient({ posts }: HomeClientProps) {
  return (
    <main>
      <HeroSection />
      <RecentPostsSection posts={posts} />
      <TechStackMarquee />
    </main>
  )
}
