## Why

The brownfield portfolio has an existing GitHub activity panel and a previously signed repair. Capture the approved behaviour in OpenSpec and exercise the same acceptance checks against the current implementation.

## What Changes

- Record the browser feed, error handling and safe-link requirements as an OpenSpec delta.
- Link the four acceptance criteria for STORY-005 to named scenarios.
- Retain the existing independent checks and architecture references.

## Capabilities

### New Capabilities

- `github-activity`: A public homepage panel that renders recent engineering activity with a safe fallback.

### Modified Capabilities

None.

## Impact

The product owner is the Next.js website component (`next-web`). The data source is the read-only public GitHub Events API. The CALM model in `architecture/site.calm.json` records the HTTPS relationship `browser-github`. The LikeC4 view in `architecture/site.c4` projects the same model. The baseline and protected tests are described in `docs/forgekit-brownfield.md`.
