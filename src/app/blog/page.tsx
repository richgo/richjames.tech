import { getAllBlogPosts } from '@/lib/markdown'
import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles and insights',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return <BlogListClient posts={posts} />
}
