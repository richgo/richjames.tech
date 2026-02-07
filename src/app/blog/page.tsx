import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/markdown'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles and insights',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">Blog</h1>
          
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
                      {post.frontMatter.tags.map((tag) => (
                        <span key={tag} className="tag is-info is-light">
                          {tag}
                        </span>
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
