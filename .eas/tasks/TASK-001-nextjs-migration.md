# TASK-001: Migrate to Next.js 14 with React 18 + TypeScript

## Summary
Complete migration from Gatsby 3 to Next.js 14 App Router, including React 18 upgrade and TypeScript conversion in a single coordinated effort.

## Why Combined?
Gatsby 3.x requires React 17 as a peer dependency. Upgrading React independently isn't possible without also upgrading Gatsby. Since we're moving to Next.js anyway, a combined migration is cleaner and avoids throwaway work.

## Current Stack
- Gatsby 3.3.0
- React 17.0.2
- JavaScript (no TypeScript)
- Netlify CMS
- SCSS with Bulma
- node-sass 5.0.0 (deprecated)

## Target Stack
- Next.js 14+ (App Router)
- React 18.x
- TypeScript (strict mode)
- Markdown with gray-matter + remark
- SCSS with modern sass package
- Compatible with Netlify deployment

## Migration Phases

### Phase 1: Project Setup
```bash
# Remove Gatsby
rm -rf node_modules yarn.lock
rm gatsby-config.js gatsby-node.js

# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind=no --eslint --app --src-dir=no --import-alias="@/*"

# Keep existing content
# - src/ components (will migrate)
# - static/ assets (move to public/)
# - Markdown content
```

### Phase 2: Core Dependencies
```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "gray-matter": "^4.0.3",
    "remark": "^15",
    "remark-html": "^16",
    "sass": "^1.69.0",
    "bulma": "^0.9.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

### Phase 3: Directory Structure
```
├── app/
│   ├── layout.tsx           # Root layout (from Layout.js)
│   ├── page.tsx             # Home page
│   ├── globals.scss         # Global styles
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx         # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx     # Blog post
│   ├── contact/
│   │   └── page.tsx
│   └── tags/
│       ├── page.tsx
│       └── [tag]/
│           └── page.tsx
├── components/              # Migrated components (TypeScript)
│   ├── BlogRoll.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ...
├── content/                 # Markdown content
│   ├── blog/
│   └── pages/
├── lib/
│   ├── markdown.ts          # Markdown processing
│   └── api.ts               # Data fetching utilities
├── public/                  # Static assets (from static/)
├── types/
│   └── index.ts             # Shared TypeScript types
├── next.config.js
└── tsconfig.json
```

### Phase 4: Component Migration

Each component needs:
1. Rename `.js` → `.tsx`
2. Add TypeScript types for props
3. Remove PropTypes (replaced by TS)
4. Update imports (no more gatsby-image)

**Example migration:**
```typescript
// Before: src/components/Features.js
import PropTypes from 'prop-types'
const FeatureGrid = ({ gridItems }) => (...)
FeatureGrid.propTypes = { gridItems: PropTypes.array }

// After: components/Features.tsx
interface FeatureItem {
  image: string
  text: string
}
interface FeaturesProps {
  gridItems: FeatureItem[]
}
export function Features({ gridItems }: FeaturesProps) {...}
```

### Phase 5: Data Layer

Replace Gatsby GraphQL with file-based data fetching:

```typescript
// lib/markdown.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDir = path.join(process.cwd(), 'content')

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(contentDir, 'blog', `${slug}.md`)
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

export function getAllPostSlugs() {
  const postsDir = path.join(contentDir, 'blog')
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}
```

### Phase 6: Image Handling

Replace gatsby-image with next/image:

```typescript
// Before
import Img from 'gatsby-image'
<Img fluid={data.image.childImageSharp.fluid} />

// After
import Image from 'next/image'
<Image 
  src={imagePath} 
  alt={alt}
  width={800}
  height={600}
  style={{ objectFit: 'cover' }}
/>
```

### Phase 7: Styling

Keep Bulma, update node-sass to modern sass:
```bash
yarn remove node-sass
yarn add sass
```

Import in `app/globals.scss`:
```scss
@import 'bulma/bulma';
// Custom styles...
```

### Phase 8: Deployment Config

Update `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Files to Create

### New Files
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.scss`
- `app/about/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/contact/page.tsx`
- `app/tags/page.tsx`
- `app/tags/[tag]/page.tsx`
- `app/not-found.tsx`
- `lib/markdown.ts`
- `lib/api.ts`
- `types/index.ts`
- `next.config.js`
- `tsconfig.json`

### Files to Migrate
- `src/components/*.js` → `components/*.tsx`
- `static/*` → `public/*`
- Content markdown files → `content/`

### Files to Delete
- `gatsby-config.js`
- `gatsby-node.js`
- `src/` directory (after migration)
- All `gatsby-*` dependencies

## Acceptance Criteria

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] TypeScript strict mode enabled, no type errors
- [ ] All existing routes return 200
- [ ] Blog posts render with correct content
- [ ] Images display correctly via next/image
- [ ] Styles render correctly (Bulma + custom SCSS)
- [ ] Contact form functional (or documented TODO)
- [ ] SEO meta tags preserved
- [ ] Netlify deployment succeeds
- [ ] Lighthouse Performance ≥ 90

## Testing Commands
```bash
npm run dev          # Local development
npm run build        # Production build
npm run start        # Production server
npx tsc --noEmit     # Type check

# Route verification
curl -I localhost:3000/
curl -I localhost:3000/about
curl -I localhost:3000/blog
curl -I localhost:3000/contact
```

## Notes
- Netlify CMS will be dropped (use file-based editing or add later)
- lambda/ functions may need migration to API routes
- Preserve all URLs for SEO continuity
