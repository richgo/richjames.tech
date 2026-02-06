# TASK-003: Migrate from Gatsby to Next.js

## Summary
Migrate the entire site from Gatsby 3.x to Next.js 14+ (App Router), replacing Gatsby's GraphQL data layer with Next.js data fetching patterns while preserving all content and functionality.

## Current State
- Gatsby 3.3.0 with GraphQL data layer
- Netlify CMS for content management
- Markdown files for blog posts/pages
- gatsby-image for optimized images
- Deployed on Netlify

## Target State
- Next.js 14+ with App Router
- Markdown processing via gray-matter + remark
- next/image for optimized images
- Compatible with Netlify (or Vercel) deployment
- Netlify CMS replaced or preserved (TBD)

## Changes Required

### 1. Initialize Next.js Project Structure
```
├── app/
│   ├── layout.tsx          (from Layout.tsx)
│   ├── page.tsx            (from index-page.tsx)
│   ├── blog/
│   │   ├── page.tsx        (blog listing)
│   │   └── [slug]/
│   │       └── page.tsx    (blog post)
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── tags/
│       ├── page.tsx
│       └── [tag]/
│           └── page.tsx
├── components/             (migrate existing)
├── content/               (move from src/pages as md)
├── lib/
│   ├── markdown.ts        (markdown processing)
│   └── api.ts             (data fetching)
└── public/                (static assets)
```

### 2. Replace Dependencies
```bash
# Remove Gatsby
yarn remove gatsby gatsby-* netlify-cms-*

# Add Next.js
yarn add next@14
yarn add gray-matter remark remark-html
yarn add -D @types/node
```

### 3. Create next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add any external image domains
    ],
  },
  // Preserve existing routes
  async redirects() {
    return []
  },
}

module.exports = nextConfig
```

### 4. Markdown Processing Library
```typescript
// lib/markdown.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, 'blog', `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const processedContent = await remark()
    .use(html)
    .process(content)
  
  return {
    slug,
    frontmatter: data,
    content: processedContent.toString(),
  }
}

export function getAllPosts() {
  // Similar implementation
}
```

### 5. Replace gatsby-image with next/image
```typescript
// Before (Gatsby)
import Img from 'gatsby-image'
<Img fluid={image.childImageSharp.fluid} />

// After (Next.js)
import Image from 'next/image'
<Image src={image} alt={alt} fill style={{ objectFit: 'cover' }} />
```

### 6. Replace GraphQL Queries with Data Fetching
```typescript
// Before (Gatsby)
export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter { title, heading, ... }
    }
  }
`

// After (Next.js)
export default async function HomePage() {
  const content = await getPageContent('index')
  return <HomePageTemplate {...content} />
}
```

### 7. Update Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 8. Netlify Configuration
Update `netlify.toml`:
```toml
[build]
  command = "yarn build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Migration Checklist

### Phase 1: Setup
- [ ] Install Next.js dependencies
- [ ] Create app/ directory structure
- [ ] Create next.config.js
- [ ] Set up lib/markdown.ts

### Phase 2: Components
- [ ] Migrate Layout → app/layout.tsx
- [ ] Migrate Navbar, Footer as server components
- [ ] Convert BlogRoll to use new data fetching
- [ ] Update all Image components

### Phase 3: Pages
- [ ] Home page (index-page)
- [ ] About page
- [ ] Contact pages
- [ ] 404 page

### Phase 4: Blog
- [ ] Blog listing page
- [ ] Blog post template → [slug]/page.tsx
- [ ] Tags pages

### Phase 5: Content
- [ ] Move markdown files to content/
- [ ] Update frontmatter format if needed
- [ ] Verify all images resolve

### Phase 6: Deployment
- [ ] Update netlify.toml
- [ ] Test build on Netlify
- [ ] Verify all routes work

## Files to Create/Modify

### New Files
- `app/layout.tsx`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/tags/page.tsx`
- `app/tags/[tag]/page.tsx`
- `app/not-found.tsx`
- `lib/markdown.ts`
- `lib/api.ts`
- `next.config.js`
- `content/` directory

### Files to Delete
- `gatsby-config.js`
- `gatsby-node.js`
- All `gatsby-*` references

### Files to Migrate
- `src/components/*` → `components/*`
- `src/pages/*.md` → `content/*.md`

## Acceptance Criteria
- [ ] Site builds with `yarn build`
- [ ] All existing routes return 200
- [ ] Blog posts render with correct content
- [ ] Images display correctly
- [ ] Contact form works (or documented as TODO)
- [ ] SEO meta tags preserved
- [ ] Netlify deployment succeeds
- [ ] Lighthouse score ≥ 90 (Performance)

## Testing
```bash
yarn dev          # Local development
yarn build        # Production build
yarn start        # Production server

# Route testing
curl -I localhost:3000/
curl -I localhost:3000/blog
curl -I localhost:3000/about
curl -I localhost:3000/contact
```

## Dependencies
- TASK-001 (React 18 upgrade)
- TASK-002 (TypeScript migration)

## Priority
3 (final migration step)

## Notes
- Netlify CMS may need replacement with alternative (Decap CMS, or file-based only)
- Consider keeping lambda functions or migrating to Next.js API routes
- Preserve URL structure for SEO
