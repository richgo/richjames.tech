# richjames.tech Modernization

## Overview
Modernize Rich James' personal website from an aging Gatsby 3 + React 17 stack to a modern Next.js 14 + React 18 + TypeScript stack.

## Goals
1. **Performance** - Faster builds, better runtime performance
2. **Maintainability** - TypeScript for type safety, modern patterns
3. **Future-proof** - Next.js is actively developed, Gatsby 3 is EOL

## Current Stack
- Gatsby 3.3.0
- React 17.0.2
- JavaScript (no TypeScript)
- Netlify CMS
- SCSS with Bulma
- Deployed on Netlify

## Target Stack
- Next.js 14+ (App Router)
- React 18.x
- TypeScript (strict mode)
- Markdown with gray-matter/remark
- SCSS with Bulma (preserved)
- Deployed on Netlify

## Migration Strategy

### Phase 1: React 18 Upgrade (t-001)
Upgrade React within Gatsby first to isolate React-specific breaking changes.

### Phase 2: TypeScript Migration (t-002)
Convert all JS to TS while still on Gatsby. This ensures type safety is in place before the framework migration.

### Phase 3: Next.js Migration (t-003)
Replace Gatsby with Next.js App Router. This is the largest change but builds on the stable React 18 + TS foundation.

## Constraints
- Preserve all existing content and URLs
- Maintain SEO (meta tags, structured data)
- Keep deployment on Netlify
- Minimize downtime during migration

## Success Criteria
- [ ] Site builds and deploys successfully
- [ ] All existing pages accessible at same URLs
- [ ] Lighthouse Performance score ≥ 90
- [ ] No TypeScript errors in strict mode
- [ ] Blog posts render correctly with images

## Repository
https://github.com/richgo/richjames.tech
