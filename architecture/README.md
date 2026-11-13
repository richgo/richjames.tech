# Source inventory for richjames.tech

| Model element | Evidence |
| --- | --- |
| Visitor, browser, Next.js and the HTTPS connection | `package.json` pins Next.js 16 and React 19. `src/app/layout.tsx` provides the shared site shell. The App Router provides home, About, Contact, Blog and Tags routes. Client components hydrate in the visitor's browser. |
| Versioned articles and the build-time read | `src/lib/markdown.ts` reads `content/blog/*.md` with Node's filesystem API and parses frontmatter with gray-matter. The blog and tag routes generate static params from that content. |
| Credential snapshot and the build-time import | `src/app/about/AboutClient.tsx` imports `src/data/credly-badges.json`. The About page links out to Credly. |
| Planned GitHub feed and direct browser connection | STORY-005 adds a browser-side GET to `https://api.github.com/users/richgo/events/public`. The draft in the original PR head used `useEffect` in `src/components/GitHubActivity.tsx`. |
| Netlify hosting | `netlify.toml` configures the Next.js plugin. The public domain returned HTTP 200 with `Server: Netlify` on 12 November 2026. |
| Legacy Azure CI | Two checked-in Azure Static Web Apps workflows failed preview deployment with an invalid key or unmatched Static Web App. |

Validate the [CALM model](site.calm.json) with
`npx --yes --package @finos/calm-cli@1.68.0 calm validate -a architecture/site.calm.json --format json --strict`.
Review the inventory against the cited source and observed host. Browser
acceptance verifies the planned GitHub edge when the candidate adds it.

[The LikeC4 view](site.c4) is generated from this CALM model by ForgeKit's
agent-delivery architecture planner. Run
`npx --yes --package likec4@1.60.0 likec4 validate architecture` to validate it.
