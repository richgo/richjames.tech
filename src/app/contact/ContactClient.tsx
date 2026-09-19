'use client'

import { ArrowUpRight, Linkedin, Mail } from 'lucide-react'
import Reveal from '@/components/Reveal'

export default function ContactClient() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <p className="eyebrow hero-intro"><span className="status-dot" /> GET IN TOUCH</p>
          <h1>Let&apos;s <em>talk.</em></h1>
          <p className="page-lede">
            Have a question or want to work together? LinkedIn is the fastest way to reach me.
          </p>
        </div>
      </section>

      <section className="site-container contact-grid">
        <Reveal>
          <div className="connect-card">
            <p className="eyebrow">PREFERRED / FASTEST RESPONSE</p>
            <h2>Connect on LinkedIn</h2>
            <p>I&apos;m most active here — send a connection request or a message and I&apos;ll get back to you.</p>
            <a
              href="https://www.linkedin.com/in/richard-james-92a6b837/"
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary"
            >
              <Linkedin size={18} /> Connect on LinkedIn <ArrowUpRight size={18} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <div className="panel">
              <h3>Prefer email?</h3>
              <p>For longer or more formal enquiries, drop me a line directly.</p>
              <a href="mailto:contact@richjames.tech" className="button-text">
                <Mail size={16} /> contact@richjames.tech
              </a>
            </div>
            <div className="panel">
              <h3>Response time</h3>
              <p>I typically respond within 24–48 hours during business days. For urgent matters, please mention it in your message.</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
