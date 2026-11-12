'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { mapGitHubEvents, type GitHubActivityItem } from '@/lib/github-activity'

const EVENTS_URL = 'https://api.github.com/users/richgo/events/public'
const PROFILE_URL = 'https://github.com/richgo'

type ActivityState = {
  items: GitHubActivityItem[]
  status: 'loading' | 'ready' | 'empty' | 'error'
}

export default function GitHubActivity() {
  const [state, setState] = useState<ActivityState>({ items: [], status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function loadActivity() {
      try {
        const response = await fetch(EVENTS_URL, {
          headers: { Accept: 'application/vnd.github+json' },
        })

        if (!response.ok) {
          if (!cancelled) {
            setState({ items: [], status: 'error' })
          }
          return
        }

        const payload: unknown = await response.json()
        const items = mapGitHubEvents(payload)
        if (cancelled) {
          return
        }

        if (items.length === 0) {
          setState({ items: [], status: 'empty' })
          return
        }

        setState({ items, status: 'ready' })
      } catch {
        if (!cancelled) {
          setState({ items: [], status: 'error' })
        }
      }
    }

    void loadActivity()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="site-container writing-section" aria-label="GitHub activity">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OPEN SOURCE NOW</p>
            <h2>GitHub activity</h2>
          </div>
        </div>

        {state.status === 'loading' && (
          <p role="status" className="archive-count">Loading recent GitHub activity...</p>
        )}

        {state.status === 'ready' ? (
          <ul className="skill-chips" aria-label="Recent GitHub events">
            {state.items.map(item => (
              <li key={item.id} className="panel topic-post">
                <a href={item.url} target="_blank" rel="noreferrer noopener" className="button-text">
                  {item.repository}
                  <ArrowUpRight size={16} />
                </a>
                <p>{item.label}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {state.status === 'empty' ? (
              <p role="status" className="archive-count">No recent GitHub activity is available.</p>
            ) : state.status === 'error' ? (
              <p role="status" className="archive-count">GitHub activity is currently unavailable.</p>
            ) : null}
            {state.status !== 'loading' && (
              <a href={PROFILE_URL} target="_blank" rel="noreferrer noopener" className="button-text">
                Visit @richgo on GitHub
                <ArrowUpRight size={16} />
              </a>
            )}
          </>
        )}
      </div>
    </section>
  )
}
