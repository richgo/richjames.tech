'use client'

import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-50 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have a question or want to work together? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-slate-50 mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/70 transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-slate-800/90 text-sm text-slate-400 peer-focus:text-indigo-400 transition-all">
                  Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/70 transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-slate-800/90 text-sm text-slate-400 peer-focus:text-indigo-400 transition-all">
                  Email
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/70 transition-all peer resize-none"
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-slate-800/90 text-sm text-slate-400 peer-focus:text-indigo-400 transition-all">
                  Message
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/50'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Email Alternative */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-50">Email me directly</h3>
                  <p className="text-sm text-slate-400">I'll get back to you soon</p>
                </div>
              </div>
              
              <motion.a
                href="mailto:contact@richjames.tech"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full py-3 px-6 bg-slate-900/50 border-2 border-slate-700/50 rounded-lg text-indigo-400 text-center font-medium hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all"
              >
                contact@richjames.tech
              </motion.a>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Response Time</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                I typically respond within 24-48 hours during business days. For urgent matters, please mention it in your message.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">What to Expect</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">✓</span>
                  <span>Professional and timely responses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">✓</span>
                  <span>Clear communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">✓</span>
                  <span>Collaborative approach</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
