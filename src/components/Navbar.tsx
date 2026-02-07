'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-slate-900/80 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-50">
              <Image
                src="/img/logo.svg"
                alt="richjames.tech"
                width={200}
                height={60}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-slate-300 hover:text-slate-50 transition-colors duration-200',
                    pathname === link.href && 'text-slate-50'
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500"
                      layoutId="navbar-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <a
                href="https://github.com/richgo/richjames.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-slate-50 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Image
                  src="/img/github-icon.svg"
                  alt="Github"
                  width={20}
                  height={20}
                />
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden z-50 p-2 text-slate-300 hover:text-slate-50"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-current"
                  animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current"
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-current"
                  animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="relative h-full flex flex-col items-center justify-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'text-3xl font-semibold transition-colors duration-200',
                      pathname === link.href
                        ? 'text-primary-400'
                        : 'text-slate-200 hover:text-slate-50'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
              >
                <a
                  href="https://github.com/richgo/richjames.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-slate-50"
                  aria-label="GitHub"
                >
                  <Image
                    src="/img/github-icon.svg"
                    alt="Github"
                    width={32}
                    height={32}
                  />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
