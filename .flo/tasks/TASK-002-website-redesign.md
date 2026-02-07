# TASK-002: Redesign Website with Modern Design System

## Summary
Complete visual redesign of richjames.tech with a cutting-edge design system, smooth animations, and modern aesthetics that showcase technical expertise while maintaining excellent performance.

---

## Research: Design Systems & CSS Frameworks (2025-2026)

### CSS Frameworks Evaluated

| Framework | Pros | Cons | Animations |
|-----------|------|------|------------|
| **Tailwind CSS** | Utility-first, highly customizable, excellent DX, huge ecosystem | Verbose classes, learning curve | Via plugins |
| **Bulma** (current) | Simple, readable classes | Dated look, limited animations, SCSS deprecated | Manual |
| **Chakra UI** | Great accessibility, theming | Heavier bundle, less flexible | Built-in |
| **Mantine** | Feature-rich, TypeScript-first | Large bundle | Built-in |
| **Panda CSS** | Zero-runtime, type-safe | Newer, smaller community | Manual |

### Animation Libraries Evaluated

| Library | Approach | Performance | Learning Curve |
|---------|----------|-------------|----------------|
| **Framer Motion** | Declarative React | Excellent | Low |
| **GSAP** | Imperative, timeline-based | Best-in-class | Medium |
| **React Spring** | Physics-based | Good | Medium |
| **Lottie** | After Effects → Web | Good for complex | Low (using files) |
| **Auto Animate** | Zero-config | Good | Very Low |
| **Motion One** | Web Animations API | Excellent | Low |

### Modern Component Libraries

| Library | Style | Highlights |
|---------|-------|------------|
| **shadcn/ui** | Tailwind + Radix | Copy-paste components, full control, accessible |
| **Aceternity UI** | Tailwind + Framer | Stunning animated components, hero sections |
| **Magic UI** | Tailwind + Framer | 50+ animated components, landing page focused |
| **NextUI** | Tailwind | Beautiful defaults, dark mode |
| **Radix Themes** | Radix primitives | Accessible, themeable |

---

## Recommended Tech Stack

### Primary Choice: Tailwind CSS + Framer Motion + shadcn/ui + Aceternity UI

**Why this combination:**
1. **Tailwind CSS** - Industry standard, perfect Next.js integration, tree-shakeable
2. **Framer Motion** - Best React animation library, declarative, performant
3. **shadcn/ui** - Accessible base components, not a dependency (copy into codebase)
4. **Aceternity UI** - Pre-built stunning animated sections for hero, features, testimonials

**Bundle impact:** Minimal - Tailwind purges unused CSS, Framer Motion ~30kb gzipped

---

## Design Direction: "Technical Elegance"

### Visual Concept
A dark-mode-first design with subtle glassmorphism, smooth micro-interactions, and scroll-triggered animations. Professional yet distinctive - showing you're a senior technologist who understands modern web.

### Color Palette
```
Primary:     #6366F1 (Indigo-500) - Tech-forward, modern
Secondary:   #EC4899 (Pink-500) - Accent, CTAs
Background:  #0F172A (Slate-900) - Deep dark
Surface:     #1E293B (Slate-800) - Cards, elevated
Text:        #F8FAFC (Slate-50) - Primary text
Muted:       #94A3B8 (Slate-400) - Secondary text
```

### Typography
- **Headings:** Inter or Cal Sans (modern, tech-focused)
- **Body:** Inter or System UI stack
- **Code:** JetBrains Mono or Fira Code

---

## Page-by-Page Design Spec

### 1. Homepage

**Hero Section** (viewport height)
- Animated gradient background (slow-moving mesh gradient)
- Large headline with text reveal animation (letter by letter or word by word)
- Subtitle with typing effect or fade-in
- Floating tech icons/particles in background (Three.js or CSS)
- CTA button with hover glow effect
- Scroll indicator with bounce animation

```
┌─────────────────────────────────────────────────┐
│  ░░░░ Animated mesh gradient background ░░░░    │
│                                                 │
│        [Logo]                                   │
│                                                 │
│     Hi, I'm Rich James                          │
│     ▌ (typing cursor)                           │
│                                                 │
│     Senior Technical Architect                  │
│     Building the future of digital              │
│                                                 │
│     [Read Blog →]  [Get in Touch]               │
│                                                 │
│              ↓ scroll                           │
└─────────────────────────────────────────────────┘
```

**Featured Work Section**
- Bento grid layout (asymmetric cards)
- Cards with hover lift + subtle shadow
- Image parallax on scroll
- Staggered entrance animations

**Recent Posts Section**
- Horizontal scroll on mobile
- Card hover: slight rotation + scale
- Tags with pill styling, hover color shift

**Tech Stack Section**
- Infinite horizontal scroll marquee of tech logos
- Pause on hover
- Grayscale → color on hover

### 2. Blog Listing (/blog)

- Masonry or grid layout
- Filter by tag (animated filtering with layout shift)
- Cards with:
  - Featured image with zoom on hover
  - Reading time estimate
  - Animated underline on title hover
  - Date with relative time ("2 months ago")
- Infinite scroll or "Load more" with skeleton loaders

### 3. Blog Post (/blog/[slug])

- Full-width hero image with parallax
- Reading progress bar (top of viewport)
- Floating table of contents (desktop sidebar)
- Code blocks with:
  - Syntax highlighting (Shiki)
  - Copy button with success animation
  - Language badge
- Pull quotes with left border accent
- Image lightbox on click
- Related posts carousel at bottom
- Animated scroll-to-top button

### 4. About Page (/about)

- Split layout: image + text
- Image with subtle floating animation
- Timeline of experience (scroll-triggered reveals)
- Skills as animated progress bars or tag cloud
- "Currently" section with live status indicators
- Social links with icon hover animations

### 5. Contact Page (/contact)

- Glassmorphic form card
- Input focus animations (label float, border glow)
- Submit button with loading state
- Success state with confetti or checkmark animation
- Alternative: Cal.com embed for scheduling

### 6. Tags Page (/tags)

- Tag cloud with size based on post count
- Hover: scale + color change
- Click: filter animation to tag page

---

## Micro-Interactions & Animations

### Global
- **Page transitions:** Fade + slight slide (Framer Motion AnimatePresence)
- **Link hovers:** Underline slides in from left
- **Button hovers:** Subtle scale (1.02) + shadow increase
- **Scroll reveal:** Elements fade-in + slide-up as they enter viewport

### Navigation
- **Desktop:** Blur backdrop on scroll, shrink height
- **Mobile:** Full-screen overlay with staggered menu item reveals
- **Active link:** Animated underline or dot indicator

### Loading States
- Skeleton screens (not spinners)
- Subtle pulse animation
- Progressive image loading (blur → sharp)

---

## Performance Considerations

1. **CSS:** Tailwind purges unused styles, ~10kb final CSS
2. **Animations:** GPU-accelerated (transform, opacity only)
3. **Images:** Next.js Image with blur placeholder, WebP/AVIF
4. **Fonts:** `next/font` with font-display: swap
5. **Bundle:** Dynamic imports for heavy components (Three.js if used)
6. **Core Web Vitals targets:**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Replace Bulma with Tailwind CSS
- [ ] Set up design tokens (colors, typography, spacing)
- [ ] Install Framer Motion
- [ ] Create base components (Button, Card, Link)
- [ ] Dark mode toggle (respect system preference)

### Phase 2: Layout & Navigation
- [ ] New responsive navbar with mobile menu
- [ ] Footer redesign
- [ ] Page transition wrapper

### Phase 3: Homepage
- [ ] Hero section with animations
- [ ] Featured work bento grid
- [ ] Recent posts section
- [ ] Tech stack marquee

### Phase 4: Blog
- [ ] Blog listing redesign
- [ ] Blog post template with TOC
- [ ] Code block styling
- [ ] Related posts

### Phase 5: Other Pages
- [ ] About page with timeline
- [ ] Contact page with form
- [ ] Tags page redesign

### Phase 6: Polish
- [ ] Loading states
- [ ] Error pages (404, 500)
- [ ] SEO & OG images
- [ ] Performance audit

---

## Dependencies to Add

```json
{
  "dependencies": {
    "tailwindcss": "^3.4",
    "framer-motion": "^11",
    "@radix-ui/react-*": "latest",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "autoprefixer": "^10",
    "postcss": "^8",
    "@tailwindcss/typography": "^0.5"
  }
}
```

---

## Files to Create/Modify

### New Files
- `tailwind.config.ts` - Design tokens
- `src/lib/utils.ts` - cn() helper
- `src/components/ui/*` - shadcn components
- `src/components/animations/*` - Framer wrappers
- `src/components/sections/*` - Page sections

### Files to Delete
- `src/app/globals.scss` → `src/app/globals.css`
- Bulma imports

---

## Design Inspiration References

- [leerob.io](https://leerob.io) - Clean, dark, Next.js showcase
- [delba.dev](https://delba.dev) - Beautiful animations, glassmorphism
- [joshwcomeau.com](https://joshwcomeau.com) - Playful, interactive
- [rauno.me](https://rauno.me) - Minimal, elegant transitions
- [magicui.design](https://magicui.design) - Component inspiration
- [aceternity.com](https://ui.aceternity.com) - Hero section ideas

---

## Acceptance Criteria

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Dark mode works correctly
- [ ] Mobile-first responsive design
- [ ] No layout shift on page load
- [ ] All existing content preserved
- [ ] Netlify deployment successful

---

## Questions for Review

1. **Color preference:** Go with indigo/pink or prefer different palette?
2. **Hero style:** Animated gradient vs. static image vs. 3D elements?
3. **Dark mode only or light/dark toggle?**
4. **Contact form:** Keep simple form or integrate Cal.com for scheduling?
5. **Any sections to add/remove from homepage?**

---

*Ready for review. Amend as needed, then I'll implement with Copilot via EAS.*
