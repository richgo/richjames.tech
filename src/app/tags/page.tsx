import TagsClient from './TagsClient'
import { getAllTags, getBlogPostsByTag } from '@/lib/markdown'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse posts by tag',
}

export default function TagsPage() {
  const tags = getAllTags()
  
  // Calculate tag sizes based on post count
  const tagCounts = tags.map(tag => ({
    tag,
    count: getBlogPostsByTag(tag).length
  }))
  
  return <TagsClient tagCounts={tagCounts} />
}
