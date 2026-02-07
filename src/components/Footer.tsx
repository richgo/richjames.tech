'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const footerLinks = {
  about: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ],
  links: [
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
}

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/richard-james-92a6b837/',
    label: 'LinkedIn',
    icon: '/img/social/linkedin.png',
  },
  {
    href: 'https://twitter.com/richgojames',
    label: 'Twitter',
    icon: '/img/social/twitter.svg',
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              {footerLinks.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Rich James. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
