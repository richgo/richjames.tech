export interface GitHubActivity {
  id: string
  description: string
  repository: string
  url: string
  date: string
}

const repositoryPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/
const allowed = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent', 'IssuesEvent'])

export function mapGitHubEvents(input: unknown): GitHubActivity[] {
  if (!Array.isArray(input)) return []
  const results: GitHubActivity[] = []
  for (const value of input) {
    if (!value || typeof value !== 'object') continue
    const event = value as Record<string, unknown>
    const repo = event.repo as Record<string, unknown> | undefined
    if (typeof event.id !== 'string' || typeof event.type !== 'string' ||
        !allowed.has(event.type) || !repo || typeof repo.name !== 'string' ||
        !repositoryPattern.test(repo.name) || typeof event.created_at !== 'string' ||
        !Number.isFinite(Date.parse(event.created_at))) continue
    const action = event.type === 'PushEvent' ? 'Pushed to'
      : event.type === 'CreateEvent' ? 'Created in'
      : event.type === 'PullRequestEvent' ? 'Contributed to'
      : event.type === 'ReleaseEvent' ? 'Released in' : 'Updated'
    results.push({
      id: event.id,
      description: action,
      repository: repo.name,
      url: 'https://github.com/' + repo.name,
      date: event.created_at,
    })
    if (results.length === 4) break
  }
  return results
}
