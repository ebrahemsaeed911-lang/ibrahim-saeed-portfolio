import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Reveal } from './reveal'
import { FacebookIcon, GithubIcon, LinkedinIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, facebook: FacebookIcon } as const

export function Contact() {
  const { data } = usePortfolioData()
  const { contact, social } = data
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative px-6 py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{contact.sectionTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {contact.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
              {contact.description}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <a
              href={`mailto:${contact.email}`}
              className="mt-8 inline-flex items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-primary"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
                <Mail size={18} />
              </span>
              {contact.email}
            </a>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex gap-3">
              {(['github', 'linkedin', 'facebook'] as const).map((key) => {
                const Icon = socialIcons[key]
                const href = social[key]
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Email</span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Message</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
              </label>

              {status === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-400"
                >
                  <CheckCircle size={16} />
                  Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-400"
                >
                  <AlertCircle size={16} />
                  Something went wrong. Please try again or email me directly.
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </motion.button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
