# Approved brownfield change

Implement STORY-005 from `product-requirements.md` on the existing
Next.js homepage. Add a visible, accessible GitHub activity section
using the public read-only GitHub events API. Do not use LinkedIn
scraping, credentials or privileged API calls. Preserve all existing
routes and styling. Validate the CALM architecture and independently
run the existing site build and tests.

Permitted application paths:
- src/app/HomeClient.tsx
- src/components/GitHubActivity.tsx
- src/lib/github-activity.ts
- src/app/globals.css

Acceptance: AC-005, AC-006, AC-007, AC-008.
