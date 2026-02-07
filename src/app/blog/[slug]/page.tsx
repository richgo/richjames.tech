import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/markdown'
import type { Metadata } from 'next'
import BlogPostClient from './BlogPostClient'

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

  // Get all posts for related posts
  const allPosts = getAllBlogPosts()
  // Find related posts (posts with matching tags, excluding current)
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.frontMatter.tags?.some(tag => 
      post.frontMatter.tags?.includes(tag)
    ))
    .slice(0, 3)
  
  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
