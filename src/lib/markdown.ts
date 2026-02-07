import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface FrontMatter {
  templateKey?: string
  title: string
  date: string
  description?: string
  featuredpost?: boolean
  featuredimage?: string
  tags?: string[]
  [key: string]: any
}

export interface MarkdownContent {
  slug: string
  frontMatter: FrontMatter
  content: string
}

export type BlogPost = MarkdownContent

/**
 * Get all markdown files from a directory
 */
export function getMarkdownFiles(directory: string): string[] {
  const fullPath = path.join(contentDirectory, directory)
  
  if (!fs.existsSync(fullPath)) {
    return []
  }
  
  const files = fs.readdirSync(fullPath)
  return files.filter(file => file.endsWith('.md'))
}

/**
 * Parse a markdown file and return front matter and content
 */
export function parseMarkdownFile(directory: string, filename: string): MarkdownContent {
  const fullPath = path.join(contentDirectory, directory, filename)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const slug = filename.replace(/\.md$/, '')
  
  return {
    slug,
    frontMatter: data as FrontMatter,
    content
  }
}

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): MarkdownContent[] {
  const files = getMarkdownFiles('blog')
  
  const posts = files
    .filter(file => file !== 'index.js')
    .map(file => parseMarkdownFile('blog', file))
    .sort((a, b) => {
      const dateA = new Date(a.frontMatter.date).getTime()
      const dateB = new Date(b.frontMatter.date).getTime()
      return dateB - dateA
    })
  
  return posts
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): MarkdownContent | null {
  const files = getMarkdownFiles('blog')
  const file = files.find(f => f.replace(/\.md$/, '') === slug)
  
  if (!file) {
    return null
  }
  
  return parseMarkdownFile('blog', file)
}

/**
 * Get all unique tags from blog posts
 */
export function getAllTags(): string[] {
  const posts = getAllBlogPosts()
  const tagsSet = new Set<string>()
  
  posts.forEach(post => {
    if (post.frontMatter.tags) {
      post.frontMatter.tags.forEach(tag => tagsSet.add(tag))
    }
  })
  
  return Array.from(tagsSet).sort()
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): MarkdownContent[] {
  const posts = getAllBlogPosts()
  return posts.filter(post => 
    post.frontMatter.tags?.includes(tag)
  )
}

/**
 * Get page content (about, contact, etc.)
 */
export function getPageContent(pageName: string): MarkdownContent | null {
  const filename = `${pageName}.md`
  const fullPath = path.join(contentDirectory, filename)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug: pageName,
    frontMatter: data as FrontMatter,
    content
  }
}
