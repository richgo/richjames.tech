'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Braces, Layers3, Workflow } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import PostCard from '@/components/PostCard'
import Reveal from '@/components/Reveal'
import type { MarkdownContent } from '@/lib/markdown'

const disciplines = [
  { number: '01', icon: Workflow, title: 'AI, with a purpose.', text: 'Agentic systems and software that do useful work. Less theatre, more things that actually ship.', tags: 'AI / AGENTS / SDLC' },
  { number: '02', icon: Layers3, title: 'Built for the real world.', text: 'Architecture, cloud and engineering at enterprise scale. Where the interesting constraints tend to live.', tags: 'ARCHITECTURE / CLOUD' },
  { number: '03', icon: Braces, title: 'Show your working.', text: 'Experiments, code and the occasional strong opinion. Notes from building, not just watching.', tags: 'OPEN SOURCE / ENGINEERING' },
]

export default function HomeClient({ posts }: { posts: MarkdownContent[] }) {
  const reducedMotion = useReducedMotion()
  const latest = posts[0]

  return (
    <>
      <section className="home-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow hero-intro"><span className="status-dot" /> RICH JAMES / CHIEF ENGINEER</p>
            <h1 className="hero-heading">
              Serious<br />engineering.<br />
              <span>A curious mind.</span>
            </h1>
            <p className="hero-description">AI, architecture and the art of making things work. Field notes from the code, not the sidelines.</p>
            <div className="hero-actions">
              <Link href="/blog" className="button-primary">Explore the writing <ArrowUpRight size={18} /></Link>
              <Link href="/about" className="button-text">A bit about me <ArrowUpRight size={17} /></Link>
            </div>
            <a href="#latest" className="hero-scroll"><ArrowDown size={15} /> KEEP EXPLORING</a>
          </div>
          {latest && (
            <motion.div
              className="hero-feature-wrap"
              initial={false}
              animate={{ y: 0 }}
              whileHover={reducedMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.4 }}
            >
              <div className="feature-topline"><span>THE LATEST THINKING</span><span>01 / FIELD NOTES</span></div>
              <Link href={`/blog/${latest.slug}`} className="hero-feature group">
                <div className="hero-feature-image">
                  {latest.frontMatter.featuredimage && (
                    <Image
                      src={latest.frontMatter.featuredimage}
                      alt={latest.frontMatter.featuredimagealt || latest.frontMatter.title}
                      fill priority
                      sizes="(max-width: 900px) 100vw, 46vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  )}
                  <span className="feature-label">{latest.frontMatter.tags?.[0] || 'Engineering'} / IN FOCUS</span>
                </div>
                <div className="hero-feature-copy">
                  <h2>{latest.frontMatter.title}</h2>
                  <span className="feature-cta">Read the latest <ArrowUpRight size={22} /></span>
                </div>
              </Link>
              <div className="feature-bottomline"><span>IDEAS INTO IMPLEMENTATION.</span><span className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="discipline-section">
        <div className="site-container discipline-grid">
          {disciplines.map(({ number, icon: Icon, title, text, tags }, index) => (
            <Reveal key={number} delay={index * 0.08}>
              <div className="discipline">
                <div className="discipline-top"><span>{number}</span><Icon size={22} strokeWidth={1.3} /></div>
                <h2>{title}</h2>
                <p>{text}</p>
                <span className="eyebrow">{tags}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="latest" className="writing-section site-container">
        <Reveal>
          <div className="section-heading">
            <div><p className="eyebrow">THE ENGINEERING NOTEBOOK</p><h2>Fresh from <em>the workbench.</em></h2></div>
            <Link href="/blog" className="button-text">The full archive <ArrowUpRight size={18} /></Link>
          </div>
        </Reveal>
        <div className="post-grid">
          {posts.slice(1).map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.06}><PostCard post={post} /></Reveal>
          ))}
        </div>
      </section>

      <section className="site-container">
        <Reveal>
          <div className="conversation-panel">
            <div><p className="eyebrow">ALWAYS CURIOUS</p><h2>Good ideas start<br />with a <em>conversation.</em></h2></div>
            <a href="mailto:contact@richjames.tech" className="button-primary">Say hello <ArrowUpRight size={18} /></a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
