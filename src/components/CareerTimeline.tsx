'use client'

import { useRef } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import Reveal from '@/components/Reveal'

type CareerEntry = {
  year: string
  title: string
  company: string
  description: string
}

export default function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  const container = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ container })

  function scroll(direction: number) {
    const element = container.current
    if (element) {
      element.scrollBy({
        top: direction * element.clientHeight * 0.75,
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
    }
  }

  return (
    <section className="career-panel" aria-labelledby="career-heading">
      <div className="career-heading">
        <div>
          <p className="eyebrow">THE JOURNEY SO FAR</p>
          <h2 id="career-heading">Career timeline</h2>
        </div>
        <div className="career-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll to newer roles" aria-controls="career-scroll"><ArrowUp size={17} /></button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll to earlier roles" aria-controls="career-scroll"><ArrowDown size={17} /></button>
        </div>
      </div>
      <p id="career-hint" className="career-hint">Scroll to explore every role, from latest to earliest.</p>
      <div className="career-progress" aria-hidden="true">
        <motion.div style={{ scaleX: scrollYProgress }} />
      </div>
      <div
        ref={container}
        id="career-scroll"
        className="career-scroll"
        role="region"
        aria-labelledby="career-heading"
        aria-describedby="career-hint"
        tabIndex={0}
      >
        <ol className="timeline">
          {entries.map((entry, index) => (
            <li className="timeline-item" key={`${entry.company}-${entry.title}`}>
              <Reveal root={container} delay={index * 0.06}>
                <div className="timeline-card">
                  <span className="timeline-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <p className="timeline-year">{entry.year}</p>
                  <h3>{entry.title}</h3>
                  <p className="timeline-company">{entry.company}</p>
                  <p>{entry.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <div className="career-footer"><span>{entries.length} career chapters</span><span>Experience, in motion.</span></div>
    </section>
  )
}
