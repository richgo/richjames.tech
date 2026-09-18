'use client'

import { useState } from 'react'
import { Search, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import Reveal from '@/components/Reveal'
import type { BlogPost } from '@/lib/markdown'

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All writing')
  const filtered = posts.filter(post => {
    const matchesType = filter === 'All writing' || (filter === 'Articles' ? post.frontMatter.source !== 'linkedin' : post.frontMatter.source === 'linkedin')
    const text = `${post.frontMatter.title} ${post.frontMatter.description || ''} ${post.frontMatter.tags?.join(' ') || ''}`.toLowerCase()
    return matchesType && text.includes(query.trim().toLowerCase())
  })

  return (
    <section className="site-container archive-page">
      <header className="archive-header">
        <p className="eyebrow">IDEAS, EXPERIMENTS & OCCASIONAL OPINIONS</p>
        <h1>The <em>field notes.</em></h1>
        <div className="archive-description"><p>Engineering in practice. What worked, what didn&apos;t, and what I&apos;m building next.</p><Link href="/tags" className="button-text">Browse topics <ArrowUpRight size={18} /></Link></div>
      </header>
      <div className="archive-toolbar">
        <div className="archive-filters" role="group" aria-label="Filter writing">
          {['All writing', 'Articles', 'LinkedIn notes'].map(label => (
            <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>
          ))}
        </div>
        <label className="archive-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search articles</span><input type="search" placeholder="Find something interesting..." value={query} onChange={event => setQuery(event.target.value)} /></label>
      </div>
      <p className="archive-count eyebrow" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'STORY' : 'STORIES'} / NEWEST FIRST</p>
      <div className="post-grid">
        {filtered.map((post, index) => (
          <Reveal key={post.slug} delay={(index % 3) * 0.06}><PostCard post={post} priority={index < 3} /></Reveal>
        ))}
      </div>
      {filtered.length === 0 && <div className="archive-empty"><h2>No notes on that one. Yet.</h2><p>Try another search, or look through the full archive.</p><button className="button-primary" onClick={() => { setQuery(''); setFilter('All writing') }}>Show all writing</button></div>}
    </section>
  )
}
