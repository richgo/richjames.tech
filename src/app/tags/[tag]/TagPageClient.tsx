'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PostCard from '@/components/PostCard'
import Reveal from '@/components/Reveal'
import type { BlogPost } from '@/lib/markdown'

export default function TagPageClient({ tag, posts }: { tag: string; posts: BlogPost[] }) {
  return (
    <section className="site-container archive-page">
      <header className="archive-header mb-12">
        <Link href="/tags" className="button-text mb-8"><ArrowLeft size={16} /> All topics</Link>
        <p className="eyebrow">{posts.length} {posts.length === 1 ? 'STORY' : 'STORIES'} / FILED UNDER</p>
        <h1 className="break-words"><em>{tag}</em></h1>
      </header>
      <div className="post-grid">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={(index % 3) * .06} className="topic-post">
            <PostCard post={post} priority={index < 3} />
            <div className="article-tags">
              {post.frontMatter.tags?.map(topic => <Link key={topic} href={`/tags/${encodeURIComponent(topic)}`} aria-current={topic === tag ? 'page' : undefined}>{topic}</Link>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
