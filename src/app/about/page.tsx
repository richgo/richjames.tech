import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About',
  description: 'Rich James — Chief Engineer. Two decades of software architecture, cloud transformation and engineering leadership.',
}

export default function AboutPage() {
  return <AboutClient />
}
