import Link from 'next/link'
import { getAllTags, getBlogPostsByTag } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tag,
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `Posts tagged with "${tag}"`,
    description: `All posts tagged with ${tag}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const posts = getBlogPostsByTag(tag)
  
  if (posts.length === 0) {
    notFound()
  }
  
  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">Posts tagged with "{tag}"</h1>
          
          <p className="subtitle">
            <Link href="/tags">← Back to all tags</Link>
          </p>
          
          <div className="columns is-multiline">
            {posts.map((post) => (
              <div key={post.slug} className="column is-12">
                <article className="box">
                  <h2 className="title is-4">
                    <Link href={`/blog/${post.slug}`}>
                      {post.frontMatter.title}
                    </Link>
                  </h2>
                  
                  {post.frontMatter.date && (
                    <p className="subtitle is-6 has-text-grey">
                      {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  {post.frontMatter.description && (
                    <p className="content">{post.frontMatter.description}</p>
                  )}
                  
                  {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                    <div className="tags">
                      {post.frontMatter.tags.map((t) => (
                        <Link
                          key={t}
                          href={`/tags/${t}`}
                          className="tag is-info is-light"
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
