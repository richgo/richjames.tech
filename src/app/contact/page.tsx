import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch',
}

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h1 className="title">Contact</h1>
          
          <p>
            Feel free to reach out via email:
          </p>
          
          <p>
            <a 
              href="mailto:contact@richjames.tech"
              className="button is-primary"
            >
              contact@richjames.tech
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
