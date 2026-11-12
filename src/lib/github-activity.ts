export type GitHubActivityItem = {
  id: string
  type: string
  label: string
  repository: string
  url: string
  createdAt: string
}

type SafeRepository = {
  owner: string
  name: string
}

const GITHUB_API_HOST = 'api.github.com'
const GITHUB_WEB_ORIGIN = 'https://github.com'
const SAFE_SEGMENT = /^[A-Za-z0-9_.-]+$/

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  return value as Record<string, unknown>
}

function isSafeRepoSegment(value: string): boolean {
  return value !== '.' && value !== '..' && SAFE_SEGMENT.test(value)
}

function parseRepositoryName(value: unknown): SafeRepository | null {
  if (typeof value !== 'string') {
    return null
  }

  const parts = value.split('/')
  if (parts.length !== 2) {
    return null
  }

  const [owner, name] = parts
  if (!owner || !name || !isSafeRepoSegment(owner) || !isSafeRepoSegment(name)) {
    return null
  }

  return { owner, name }
}

function hasTrustedRepositoryApiUrl(repoUrl: unknown, repository: SafeRepository): boolean {
  if (repoUrl === undefined || repoUrl === null) {
    return true
  }

  if (typeof repoUrl !== 'string') {
    return false
  }

  try {
    const url = new URL(repoUrl)
    if (url.protocol !== 'https:' || url.hostname !== GITHUB_API_HOST) {
      return false
    }

    if (url.username || url.password) {
      return false
    }

    if (url.port && url.port !== '443') {
      return false
    }

    if (url.search || url.hash) {
      return false
    }

    return url.pathname === `/repos/${repository.owner}/${repository.name}`
  } catch {
    return false
  }
}

function formatLabel(eventType: string, eventPayload: Record<string, unknown> | null): string | null {
  switch (eventType) {
    case 'PushEvent': {
      if (!Array.isArray(eventPayload?.commits) || eventPayload.commits.length === 0) {
        return 'Pushed commits'
      }

      const commits = eventPayload.commits.length
      return commits === 1 ? 'Pushed 1 commit' : `Pushed ${commits} commits`
    }
    case 'PullRequestEvent': {
      const action = typeof eventPayload?.action === 'string' ? eventPayload.action : 'updated'
      return `Pull request ${action}`
    }
    case 'IssuesEvent': {
      const action = typeof eventPayload?.action === 'string' ? eventPayload.action : 'updated'
      return `Issue ${action}`
    }
    case 'IssueCommentEvent': {
      const action = typeof eventPayload?.action === 'string' ? eventPayload.action : 'updated'
      return `Issue comment ${action}`
    }
    case 'WatchEvent':
      return 'Started watching'
    case 'ForkEvent':
      return 'Forked repository'
    case 'CreateEvent': {
      const refType = typeof eventPayload?.ref_type === 'string' ? eventPayload.ref_type : 'resource'
      return `Created ${refType}`
    }
    default:
      return null
  }
}

function mapGitHubEvent(event: unknown): GitHubActivityItem | null {
  const rawEvent = asRecord(event)
  if (!rawEvent) {
    return null
  }

  const id = rawEvent.id
  const type = rawEvent.type
  const createdAt = rawEvent.created_at
  if (typeof id !== 'string' || typeof type !== 'string' || typeof createdAt !== 'string') {
    return null
  }

  const repo = asRecord(rawEvent.repo)
  const repository = parseRepositoryName(repo?.name)
  if (!repository || !hasTrustedRepositoryApiUrl(repo?.url, repository)) {
    return null
  }

  const payload = asRecord(rawEvent.payload)
  const label = formatLabel(type, payload)
  if (!label) {
    return null
  }

  return {
    id,
    type,
    label,
    repository: `${repository.owner}/${repository.name}`,
    url: `${GITHUB_WEB_ORIGIN}/${repository.owner}/${repository.name}`,
    createdAt,
  }
}

export function mapGitHubEvents(events: unknown): GitHubActivityItem[] {
  if (!Array.isArray(events)) {
    return []
  }

  const items: GitHubActivityItem[] = []
  for (const event of events) {
    const mapped = mapGitHubEvent(event)
    if (!mapped) {
      continue
    }

    items.push(mapped)
    if (items.length === 4) {
      break
    }
  }

  return items
}
