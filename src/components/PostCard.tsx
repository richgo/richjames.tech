'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@/lib/markdown'

export default function PostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  const { frontMatter, slug } = post

  return (
    <article className="post-card group">
      <Link href={`/blog/${slug}`} className="post-card-link">
        <div className="post-card-art">
          {frontMatter.featuredimage ? (
            <Image
              src={frontMatter.featuredimage}
              alt={frontMatter.featuredimagealt || frontMatter.title}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              priority={priority}
              className="object-contain transition-opacity duration-500 group-hover:opacity-90"
            />
          ) : (
            <div className="post-card-fallback" aria-hidden="true"><span>RJ / FIELD NOTES</span></div>
          )}
          <span className="post-card-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </div>
        <div className="post-card-copy">
          <div className="eyebrow post-card-meta">
            <span>{frontMatter.tags?.[0] || 'Engineering'}</span>
            <time dateTime={new Date(frontMatter.date).toISOString()}>
              {new Date(frontMatter.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })}
            </time>
          </div>
          <h2>{frontMatter.title}</h2>
          {frontMatter.description && <p>{frontMatter.description}</p>}
          <span className="post-card-read">
            {frontMatter.source === 'linkedin' ? 'From LinkedIn' : `${Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read`}
            <span aria-hidden="true"> / </span> Read the story
          </span>
        </div>
      </Link>
    </article>
  )
}
