import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/markdown'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to richjames.tech',
}

export default function Home() {
  const allPosts = getAllBlogPosts()
  const recentPosts = allPosts.slice(0, 5)

  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">Welcome to richjames.tech</h1>
          
          <p className="subtitle">
            Technical articles and insights
          </p>

          <h2 className="title is-4">Recent Posts</h2>
          
          <div className="columns is-multiline">
            {recentPosts.map((post) => (
              <div key={post.slug} className="column is-12">
                <article className="box">
                  <h3 className="title is-5">
                    <Link href={`/blog/${post.slug}`}>
                      {post.frontMatter.title}
                    </Link>
                  </h3>
                  
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
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="tag is-info is-light"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>

          <p>
            <Link href="/blog" className="button is-primary">
              View all posts →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
