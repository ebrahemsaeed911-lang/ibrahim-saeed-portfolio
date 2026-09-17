import { ArrowUp, Mail } from 'lucide-react'
import { FacebookIcon, GithubIcon, LinkedinIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'

const socialIcons = { github: GithubIcon, linkedin: LinkedinIcon, facebook: FacebookIcon } as const

export default function Footer() {
  const { data } = usePortfolioData()
  const { nav, social, footer, contact } = data

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-tight">{data.profile.name}</p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">
              {data.profile.mainTitle}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {nav.links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex gap-2">
            {(['github', 'linkedin', 'facebook'] as const).map((key) => {
              const Icon = socialIcons[key]
              return (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={15} />
                </a>
              )
            })}
            <a
              href={`mailto:${contact.email}`}
              aria-label="Email"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {data.profile.name}
          </p>
          <p className="font-mono text-xs text-muted-foreground/70">{footer.tagline}</p>
          <button
            onClick={() => go('home')}
            className="inline-flex items-center gap-1.5 self-start font-mono text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground sm:self-auto"
          >
            Top <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  )
}
