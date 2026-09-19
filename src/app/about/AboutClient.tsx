'use client'

import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import Reveal from '@/components/Reveal'
import CareerTimeline from '@/components/CareerTimeline'
import Image from 'next/image'
import credly from '@/data/credly-badges.json'

const experience = [
  {
    year: '2023 — Present',
    title: 'Chief Engineer',
    company: 'Lloyds Banking Group',
    description: 'AI and agentic SDLC systems. Enterprise scale engineering.',
  },
  {
    year: '2019 — 2023',
    title: 'Principal Technology Lead',
    company: 'Nationwide Building Society',
    description: 'Cloud transformation to Azure. First GraphQL API, first headless CMS. React & Sitecore JSS. DevOps Enterprise Summit speaker.',
  },
  {
    year: 'Earlier',
    title: 'Developer / Technical Lead',
    company: 'Eduserv',
    description: 'K2, MVC, SQL development.',
  },
]

const skills = [
  'Technical Leadership',
  'Software Architecture',
  'AI & Machine Learning',
  'Agentic Systems',
  'DevOps',
  'Azure',
  'GCP',
  'SCRUM/Kanban',
  'Team Building',
  'Mentoring',
  'Strategic Planning',
  'Innovation',
  'Full Stack Development',
  'Microsoft Stack',
  'Organizational Transformation',
]

const achievements = [
  '20 years technical leadership and management experience',
  'Adept at recruiting, mentoring, coaching, creating a culture of learning',
  'Strong experience in consulting, strategic planning, portfolio design',
  'Driven complex DevOps initiatives and ran multiple SCRUM/Kanban teams',
  'Expert Microsoft technologist: MCSD App Builder, MCSE Azure',
]

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/richard-james-92a6b837/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/richgo', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/richgojames', label: 'X / Twitter' },
  { icon: Mail, href: 'mailto:contact@richjames.tech', label: 'Email' },
]

export default function AboutClient() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <p className="eyebrow hero-intro"><span className="status-dot" /> RICH JAMES / CHIEF ENGINEER</p>
          <h1>About <em>me.</em></h1>
          <p className="page-lede">
            A highly experienced technology leader with in-depth software development and architectural knowledge.
            Two decades experience developing and delivering enterprise, web, desktop, mobile and serverless applications.
            Experience leading multiple cross-functional teams. A problem solver with an entrepreneurial mindset.
          </p>
        </div>
      </section>

      <section className="site-container about-body">
        <Reveal>
          <CareerTimeline entries={experience} />
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <h2>Skills &amp; expertise</h2>
            <div className="skill-chips">
              {skills.map(skill => (
                <span className="skill-chip" key={skill}>{skill}</span>
              ))}
            </div>
            <div className="panel" style={{ marginTop: 40 }}>
              <h3>Key achievements</h3>
              <ul>
                {achievements.map(item => (
                  <li key={item}><span>•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="site-container certifications" aria-labelledby="certifications-heading">
        <Reveal>
          <div className="certifications-heading">
            <div>
              <p className="eyebrow">CONTINUOUS LEARNING</p>
              <h2 id="certifications-heading">Certifications &amp; badges</h2>
            </div>
            <a className="button-text" href={credly.profile} target="_blank" rel="noopener noreferrer">
              View Credly profile ↗
            </a>
          </div>
          <ul className="certification-grid">
            {credly.badges.map((badge, index) => (
              <li key={badge.id}>
                <Reveal delay={(index % 4) * 0.07}>
                  <a className="certification-card" href={badge.url} target="_blank" rel="noopener noreferrer">
                    <div className="certification-logo">
                      <Image src={badge.image} alt="" width={160} height={160} />
                    </div>
                    <p className="eyebrow">{badge.issuer}</p>
                    <h3>{badge.name}</h3>
                    <p className="certification-date">Issued <time dateTime={badge.issued}>{badge.issued}</time></p>
                    {badge.expires && (
                      <p className="certification-date">Expiry <time dateTime={badge.expires}>{badge.expires}</time></p>
                    )}
                    <span className="certification-verify">Verify on Credly ↗</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="site-container">
        <Reveal>
          <div className="connect-strip">
            <h2>Let&apos;s <em>connect.</em></h2>
            <div className="social-orbits">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-orb"
                  aria-label={link.label}
                >
                  <link.icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
