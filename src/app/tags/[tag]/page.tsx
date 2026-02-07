import TagPageClient from './TagPageClient'
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
  
  return <TagPageClient tag={tag} posts={posts} />
}
