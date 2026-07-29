import { motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { FacebookIcon, GithubIcon, LinkedinIcon } from './brand-icons'

const socials = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/ebrahemsaeed911-lang' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
]

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <button
          onClick={() => go('home')}
          aria-label="Back to top"
          className="group grid h-12 w-12 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
        </button>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-3">
          {socials.map((s) => (
            <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
                >
              <s.icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ibrahim Saeed. Crafted with care using HTML, CSS & JavaScript.
        </p>
      </div>
    </footer>
  )
}
