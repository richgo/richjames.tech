import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/markdown'
import type { MarkdownContent } from '@/lib/markdown'
import HomeClient from './HomeClient'

export default function Home() {
  const allPosts = getAllBlogPosts()
  const recentPosts = allPosts.slice(0, 4)

  return <HomeClient posts={recentPosts} />
}
