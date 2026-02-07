import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/markdown'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description || '',
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">{post.frontMatter.title}</h1>
          
          {post.frontMatter.date && (
            <p className="subtitle is-6 has-text-grey">
              {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
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
          
          <div className="content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  )
}
