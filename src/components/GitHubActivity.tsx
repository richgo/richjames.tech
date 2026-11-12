'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { mapGitHubEvents, type GitHubActivity as Activity } from '@/lib/github-activity'

export default function GitHubActivity() {
  const [items, setItems] = useState<Activity[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    const deadline = window.setTimeout(() => {
      setStatus('unavailable')
      controller.abort()
    }, 5000)
    fetch('https://api.github.com/users/richgo/events/public?per_page=20', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) throw new Error('GitHub API unavailable')
        return response.json() as Promise<unknown>
      })
      .then(payload => {
        if (controller.signal.aborted) return
        const mapped = mapGitHubEvents(payload)
        setItems(mapped)
        setStatus(mapped.length ? 'ready' : 'unavailable')
      })
      .catch(() => { if (!controller.signal.aborted) setStatus('unavailable') })
      .finally(() => window.clearTimeout(deadline))
    return () => {
      window.clearTimeout(deadline)
      controller.abort()
    }
  }, [])

  return (
    <section className="site-container" aria-labelledby="github-activity-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OPEN SOURCE / LIVE SIGNAL</p>
          <h2 id="github-activity-heading">GitHub activity</h2>
        </div>
        <a href="https://github.com/richgo" className="button-text" target="_blank" rel="noopener noreferrer">
          GitHub profile <ArrowUpRight size={17} />
        </a>
      </div>
      {status === 'loading' && <p role="status">Loading public GitHub activity…</p>}
      {status === 'unavailable' && <p role="status">Recent activity is unavailable right now. Visit the GitHub profile to explore the projects.</p>}
      {status === 'ready' && (
        <ul className="github-activity-list">
          {items.map(item => (
            <li key={item.id}>
              <Github size={20} aria-hidden="true" />
              <span>{item.description} <strong>{item.repository}</strong></span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.repository} on GitHub`}>
                <ArrowUpRight size={18} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
