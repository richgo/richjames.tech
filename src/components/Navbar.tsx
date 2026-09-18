'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  { href: '/blog', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const toggle = useRef<HTMLButtonElement>(null)
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="site-header" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <nav className="site-container site-nav" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label="Rich James home" onClick={() => setOpen(false)}>richjames<span>.tech</span><i aria-hidden="true" /></Link>
        <div className="desktop-nav">
          {links.map(link => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</Link>)}
          <a href="https://github.com/richgo" target="_blank" rel="noopener noreferrer" className="nav-github">GitHub <ArrowUpRight size={15} /></a>
        </div>
        <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
        {links.map(link => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={18} /></Link>)}
        <a href="https://github.com/richgo" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>GitHub <ArrowUpRight size={18} /></a>
      </nav>}
    </header>
  )
}
