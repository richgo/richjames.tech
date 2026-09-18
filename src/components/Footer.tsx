import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div><Link href="/" className="wordmark">richjames<span>.tech</span><i aria-hidden="true" /></Link><p>Engineering with intent.<br />A healthy disregard for the hype.</p></div>
          <nav aria-label="Footer navigation"><Link href="/blog">Writing</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
          <nav aria-label="Social links">
            <a href="https://github.com/richgo" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
            <a href="https://www.linkedin.com/in/richard-james-92a6b837/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
            <a href="https://twitter.com/richgojames" target="_blank" rel="noopener noreferrer">X / Twitter <ArrowUpRight size={14} /></a>
          </nav>
        </div>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Rich James</span><span>BUILT WITH CURIOSITY. AND COFFEE.</span></div>
      </div>
    </footer>
  )
}
