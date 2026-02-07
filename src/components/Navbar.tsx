'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isActive, setIsActive] = useState(false)

  const toggleHamburger = () => {
    setIsActive(!isActive)
  }

  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link href="/" className="navbar-item" title="Logo">
            <Image 
              src="/img/logo.png" 
              alt="richjames.tech" 
              width={88} 
              height={40}
              style={{ width: '88px', height: 'auto' }}
            />
          </Link>
          {/* Hamburger menu */}
          <button
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            data-target="navMenu"
            onClick={toggleHamburger}
            aria-label="menu"
            aria-expanded={isActive}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div
          id="navMenu"
          className={`navbar-menu ${isActive ? 'is-active' : ''}`}
        >
          <div className="navbar-start has-text-centered">
            <Link className="navbar-item" href="/about">
              About
            </Link>
            <Link className="navbar-item" href="/blog">
              Blog
            </Link>
            <Link className="navbar-item" href="/contact">
              Contact
            </Link>
          </div>
          <div className="navbar-end has-text-centered">
            <a
              className="navbar-item"
              href="https://github.com/richgo/richjames.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon">
                <Image 
                  src="/img/github-icon.svg" 
                  alt="Github" 
                  width={24} 
                  height={24}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
