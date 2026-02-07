# richjames.tech Modernization

## Overview
Complete modernization of Rich James' personal website from Gatsby 3 to Next.js 14 with React 18 and TypeScript.

## Why Single Migration?
Originally planned as 3 separate tasks (React → TypeScript → Next.js), but Gatsby 3.x requires React 17 as a peer dependency. Independent React 18 upgrade isn't possible without Gatsby upgrade, which is nearly as much work as the full Next.js migration. Combined approach is cleaner.

## Goals
1. **Modern Stack** - Next.js 14, React 18, TypeScript
2. **Performance** - Faster builds, better runtime perf
3. **Maintainability** - Type safety, modern patterns
4. **Future-proof** - Active framework, not EOL Gatsby 3

## Current Stack
| Component | Version | Issue |
|-----------|---------|-------|
| Gatsby | 3.3.0 | EOL, no React 18 support |
| React | 17.0.2 | One version behind |
| Language | JavaScript | No type safety |
| Sass | node-sass 5.0 | Deprecated package |
| CMS | Netlify CMS | Will be dropped |

## Target Stack
| Component | Version |
|-----------|---------|
| Next.js | 14+ (App Router) |
| React | 18.x |
| Language | TypeScript (strict) |
| Sass | sass (dart-sass) |
| Content | File-based markdown |

## Task
**t-001**: Migrate to Next.js 14 with React 18 + TypeScript

Single comprehensive migration covering:
- Framework swap (Gatsby → Next.js)
- React upgrade (17 → 18)
- TypeScript conversion
- Dependency modernization

## Constraints
- Preserve all existing URLs (SEO)
- Keep Bulma styling
- Maintain Netlify deployment
- Minimize downtime

## Success Criteria
- [ ] Site builds and deploys
- [ ] All pages accessible at same URLs
- [ ] Lighthouse Performance ≥ 90
- [ ] Zero TypeScript errors (strict mode)
- [ ] Blog posts render correctly

## Repository
https://github.com/richgo/richjames.tech
