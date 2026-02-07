import Link from 'next/link'
import { getAllTags, getBlogPostsByTag } from '@/lib/markdown'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse posts by tag',
}

export default function TagsPage() {
  const tags = getAllTags()
  
  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">Tags</h1>
          
          <div className="tags are-large">
            {tags.map((tag) => {
              const postCount = getBlogPostsByTag(tag).length
              return (
                <Link 
                  key={tag} 
                  href={`/tags/${tag}`}
                  className="tag is-info is-light"
                >
                  {tag} ({postCount})
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
