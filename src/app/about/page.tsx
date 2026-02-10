'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export default function AboutPage() {
  const experience = [
    {
      year: '2023 - Present',
      title: 'Chief Engineer',
      company: 'Lloyds Banking Group',
      description: 'AI and agentic SDLC systems. Enterprise scale engineering.',
    },
    {
      year: '2019 - 2024',
      title: 'Principal Technology Lead',
      company: 'Nationwide Building Society',
      description: 'Cloud transformation to Azure. First GraphQL API, first headless CMS. React & Sitecore JSS. DevOps Enterprise Summit speaker.',
    },
    {
      year: 'Earlier',
      title: 'Developer/Technical Lead',
      company: 'Eduserv',
      description: 'K2, MVC, SQL development',
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

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/richjames', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/richjames', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/richjames', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@richjames.tech', label: 'Email' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-50 mb-6">
            About Me
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            A highly experienced technology leader with in-depth software development and architectural knowledge. 
            Two decades experience developing and delivering enterprise, web, desktop, mobile and serverless applications. 
            Experience leading multiple cross-functional teams. A problem solver with an entrepreneurial mindset.
          </p>
        </motion.div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-slate-50 mb-8">Experience</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-pink-500 to-transparent" />
              
              {/* Timeline items */}
              <div className="space-y-8 pl-8">
                {experience.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className="absolute -left-[33px] top-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                    
                    {/* Card */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                      <div className="text-sm text-indigo-400 mb-2">{item.year}</div>
                      <h3 className="text-lg font-semibold text-slate-50 mb-1">{item.title}</h3>
                      {item.company && (
                        <div className="text-sm text-pink-400 mb-2">{item.company}</div>
                      )}
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-slate-50 mb-8">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-300 text-sm hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 transition-all cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="mt-12 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30"
              >
                <h3 className="text-lg font-semibold text-slate-50 mb-3">Key Achievements</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>10 years technical leadership and management experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Adept at recruiting, mentoring, coaching, creating a culture of learning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Strong experience in consulting, strategic planning, portfolio design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Driven complex DevOps initiatives and ran multiple SCRUM/Kanban teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Expert Microsoft technologist: MCSD App Builder, MCSE Azure</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-6">Let's Connect</h2>
          <div className="flex justify-center gap-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
                aria-label={link.label}
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
