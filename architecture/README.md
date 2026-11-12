# Brownfield architecture: richjames.tech

## Source-based reverse engineering

The authoritative evidence is the checked-in source, not an inferred
cloud topology. `package.json` pins Next.js 16 and React 19;
`src/app/` contains App Router routes for home, about, blog, tags and
contact; `src/lib/markdown.ts` reads versioned Markdown from
`content/blog/`; `src/data/credly-badges.json` is a local snapshot.
Two GitHub Actions workflows target Azure Static Web Apps. The repository
also has a Netlify configuration, so **the live production hosting
provider is not established by source alone**.

`site.calm.json` models those verified logical components and the new
external GitHub events dependency. It does not assert a runtime database,
authentication provider, or live deployment that has not been observed.

## Independent validation

Run `npx --yes --package @finos/calm-cli@1.68.0 calm validate -a architecture/site.calm.json --format json`
and check for schema and semantic errors. Independently compare every
node and relationship with the source paths above; a schema-valid CALM
file alone is not proof that the reverse-engineered topology is correct.

The external GitHub integration is public and read-only. No OAuth token,
browser session, LinkedIn scraping or GitHub write permission is required.
