# Product requirements — richjames.tech

## Epic EPIC-001 — Publish an accessible engineering portfolio
Outcome: Visitors can learn about Rich James and discover his work.
Owner: `next-web`.

### Feature FEAT-001 — Landing page
Story STORY-001: As a visitor I can read the introduction and navigate
to articles, About and contact.
- AC-001 Given the homepage, when it renders, then the hero and navigation
  are available and the latest articles link to their canonical pages.

### Feature FEAT-002 — Markdown article archive
Story STORY-002: As a reader I can browse and read dated posts.
- AC-002 Given `content/blog/*.md`, when the site builds, then article
  cards and individual routes resolve from the frontmatter.

### Feature FEAT-003 — Topic discovery
Story STORY-003: As a reader I can browse posts by topic.
- AC-003 Given posts with tags, when I visit the tag index and a tag page,
  then I see the matching posts.

### Feature FEAT-004 — Profile and contact
Story STORY-004: As a visitor I can read the career timeline, credentials
and find contact links.
- AC-004 Given About and Contact routes, when rendered, then the links and
  locally snapshotted credentials remain accessible.

## Epic EPIC-002 — Demonstrate externally sourced engineering activity
Outcome: A visible homepage integration shows recent public open-source
activity without relying on credentials. Owner: `next-web`.

### Feature FEAT-005 — GitHub public activity
Story STORY-005: As a visitor I can see recent public GitHub activity
on the homepage and follow the activity to its repository.
- AC-005 Given valid GitHub public events, when the activity panel loads,
  then at most four recent supported events appear with readable labels
  and safe links to GitHub.
- AC-006 Given API rate limiting, network failure, empty or malformed data,
  when the panel loads, then the homepage still works and displays a
  non-blocking fallback link to the public GitHub profile.
- AC-007 Given an untrusted event URL or non-GitHub repository name,
  when mapping events, then it is rejected rather than rendered as a link.
- AC-008 Given the source branch, when independent verification runs, then
  type checking, linting, unit tests, production build and CALM validation
  must succeed without changing protected acceptance criteria.
