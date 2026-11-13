## Context

STORY-005 belongs to FEAT-005 and EPIC-002. The approved request identifies the exact source paths and constraints. The CALM model identifies `next-web`, `browser` and `github-api`.

## Goals / Non-Goals

- Preserve a readable feed and the GitHub profile fallback.
- Exercise the existing application and verifier with the same behaviour selected in OpenSpec.
- Keep the existing browser-side, credential-free GitHub API integration.

## Decisions

The browser requests the public events endpoint. The event mapper validates repository names and URLs before the panel generates a repository link. The existing checker replays a candidate in a disposable tree with the approved acceptance check IDs.

## Risks / Trade-offs

A stale or unavailable upstream feed can delay the panel. The request times out after five seconds. Browser acceptance controls the upstream response so it can reproduce the rate-limit, network, malformed, empty and stalled cases.
