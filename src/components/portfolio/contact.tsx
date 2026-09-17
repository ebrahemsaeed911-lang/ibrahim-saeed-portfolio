import { useState } from 'react'
import { AlertCircle, CheckCircle, Mail, Send } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { FacebookIcon, GithubIcon, LinkedinIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, facebook: FacebookIcon } as const

const fieldClass =
  'rounded-[10px] border border-border bg-background/60 px-4 py-3 text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/50 focus:border-primary/60'

export default function Contact() {
  const { data } = usePortfolioData()
  const { contact, social } = data
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeading
            index="06"
            label={contact.sectionTitle}
            title={contact.heading}
            description={contact.description}
          />

          <Reveal delay={0.15}>
            <a
              href={`mailto:${contact.email}`}
              className="mt-8 inline-flex items-center gap-3 font-mono text-sm text-foreground transition-colors duration-200 hover:text-primary"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-primary">
                <Mail size={16} />
              </span>
              {contact.email}
            </a>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex gap-2.5">
              {(['github', 'linkedin', 'facebook'] as const).map((key) => {
                const Icon = socialIcons[key]
                return (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Name</span>
                <input required name="name" type="text" placeholder="Your name" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Email</span>
                <input required name="email" type="email" placeholder="you@example.com" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Message</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className={`resize-none ${fieldClass}`}
                />
              </label>

              {status === 'sent' && (
                <div className="flex items-center gap-2 rounded-[10px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 animate-fade-up">
                  <CheckCircle size={16} />
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-[10px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-up">
                  <AlertCircle size={16} />
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                <Send size={15} />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
