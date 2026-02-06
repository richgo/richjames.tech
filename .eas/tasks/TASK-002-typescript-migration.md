# TASK-002: Migrate to TypeScript

## Summary
Convert the codebase from JavaScript to TypeScript, adding proper type definitions for all components, templates, and utilities.

## Current State
- All source files are `.js`
- No TypeScript configuration
- PropTypes used for runtime type checking
- 20+ component/template files

## Target State
- All source files migrated to `.ts` / `.tsx`
- Strict TypeScript configuration
- Full type safety across the codebase
- PropTypes removed (replaced by TS types)

## Changes Required

### 1. Add TypeScript Dependencies
```bash
yarn add -D typescript @types/react @types/react-dom @types/node
yarn add gatsby-plugin-typescript
```

### 2. Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "gatsby-*.ts"],
  "exclude": ["node_modules", "public", ".cache"]
}
```

### 3. Update Gatsby Config
Add `gatsby-plugin-typescript` to `gatsby-config.js`

### 4. Migrate Components (Priority Order)
1. **Shared types** - Create `src/types/index.ts`
2. **Simple components** - Footer, Content, Navbar
3. **Complex components** - Layout, BlogRoll, Features
4. **Templates** - index-page, blog-post, about-page, tags
5. **Pages** - 404, blog/index, contact/*, tags/index
6. **Config files** - gatsby-config.ts, gatsby-node.ts

### 5. Type Definitions to Create
```typescript
// src/types/index.ts
export interface SiteMetadata {
  title: string
  description: string
}

export interface MarkdownRemark {
  id: string
  fields: { slug: string }
  frontmatter: {
    title: string
    date?: string
    description?: string
    featuredimage?: any
  }
}

export interface PageContext {
  id?: string
  tag?: string
  slug?: string
}
```

## Files to Migrate
```
src/
├── components/
│   ├── BlogRoll.js → BlogRoll.tsx
│   ├── Content.js → Content.tsx
│   ├── Features.js → Features.tsx
│   ├── Footer.js → Footer.tsx
│   ├── Layout.js → Layout.tsx
│   ├── Navbar.js → Navbar.tsx
│   ├── PreviewCompatibleImage.js → PreviewCompatibleImage.tsx
│   ├── SiteMetadata.js → SiteMetadata.tsx
│   └── Testimonials.js → Testimonials.tsx
├── pages/
│   ├── 404.js → 404.tsx
│   ├── blog/index.js → blog/index.tsx
│   ├── contact/*.js → contact/*.tsx
│   └── tags/index.js → tags/index.tsx
└── templates/
    ├── about-page.js → about-page.tsx
    ├── blog-post.js → blog-post.tsx
    ├── index-page.js → index-page.tsx
    └── tags.js → tags.tsx
```

## Acceptance Criteria
- [ ] TypeScript and type packages installed
- [ ] tsconfig.json created with strict mode
- [ ] All .js files in src/ converted to .ts/.tsx
- [ ] PropTypes removed from all components
- [ ] `yarn build` completes without type errors
- [ ] `yarn develop` runs without errors
- [ ] No `any` types except where unavoidable (document why)

## Testing
```bash
yarn tsc --noEmit  # Type check
yarn build         # Full build
yarn develop       # Runtime check
```

## Dependencies
- TASK-001 (React 18 upgrade must complete first)

## Priority
2 (enables type safety for Next.js migration)
