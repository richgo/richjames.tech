# Approved change request

## Stories

- `STORY-005`

## Allowed source paths

- `src/app/HomeClient.tsx`
- `src/components/GitHubActivity.tsx`
- `src/lib/github-activity.ts`
- `src/app/globals.css`

## Constraints

Add an accessible section named “GitHub activity” to the existing homepage.
Use the public read-only GitHub Events API for `richgo` with no credentials.
Preserve existing routes and styling. Use the first-party event order and
render up to four supported events with safe repository links.
Export `mapGitHubEvents` from `src/lib/github-activity.ts` for the protected
tests. Accept supported events without a repository API URL. Reject events
with a supplied repository API URL outside the corresponding GitHub
repository, or a repository owner or name that is a dot segment.
Keep the GitHub profile available when the feed fails.

The verified feature from the previous factory run is the starting point
for this repair. GitHub PushEvent payloads can omit the commit list.
Use a generic push label in that case, without inferring a commit count.
Bound a stalled request to five seconds and preserve the profile fallback.
Reject repository API URLs with credentials or a non-default HTTPS port.
Only change source needed for these fixes.
