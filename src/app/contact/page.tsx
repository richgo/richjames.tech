import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Rich James — connect on LinkedIn or send an email.',
}

export default function ContactPage() {
  return <ContactClient />
}
