import { getPageContent } from '@/lib/markdown'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About',
  description: 'About me',
}

export default function AboutPage() {
  const pageContent = getPageContent('about')
  
  if (!pageContent) {
    notFound()
  }
  
  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">{pageContent.frontMatter.title}</h1>
          <div className="content">
            <ReactMarkdown>{pageContent.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  )
}
