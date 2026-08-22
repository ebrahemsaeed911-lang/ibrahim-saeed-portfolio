import { ArrowUp } from 'lucide-react'
import { FacebookIcon, GithubIcon, LinkedinIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, facebook: FacebookIcon } as const

export default function Footer() {
  const { data } = usePortfolioData()
  const { nav, social, footer } = data

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
          {nav.links.map((l) => (
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
          {(['github', 'linkedin', 'facebook'] as const).map((key) => {
            const Icon = socialIcons[key]
            return (
              <a
                key={key}
                href={social[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary"
              >
                <Icon size={16} />
              </a>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {data.profile.name}. {footer.tagline}
        </p>
        <p className="text-center text-xs text-muted-foreground/60">
          Designed & Developed by {data.profile.name}
        </p>
      </div>
    </footer>
  )
}
