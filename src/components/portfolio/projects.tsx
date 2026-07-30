import { ExternalLink, Code } from 'lucide-react'
import { Reveal } from './reveal'
import { GithubIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'
import { useInView } from '@/hooks/use-in-view'

const badgeStyles: Record<string, string> = {
  'Web App': 'border-primary/30 bg-primary/15 text-primary',
  'Desktop App': 'border-sky-500/30 bg-sky-500/15 text-sky-400',
}

const overlayStyles: Record<string, string> = {
  'Web App': 'from-card via-card/20 to-transparent',
  'Desktop App': 'from-card via-sky-950/20 to-transparent',
}

export default function Projects() {
  const { data } = usePortfolioData()
  const { projects } = data

  return (
    <section id="projects" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{projects.sectionTitle}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{projects.heading}</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{projects.description}</p>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          {projects.items.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, index: i }: { project: { title: string; image: string; type: string; tags: string[]; desc: string; demo: string; github?: string }; index: number }) {
  const { ref, inView } = useInView({ rootMargin: '-60px' })

  return (
    <article
      ref={ref}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
        inView ? 'animate-fade-slide-up' : 'translate-y-10 opacity-0'
      } ${
        p.type === 'Desktop App'
          ? 'glass border-sky-500/10 hover:border-sky-500/30'
          : 'glass hover:border-primary/30'
      }`}
      style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-secondary">
        <img
          src={p.image + '?width=600'}
          alt={`${p.title} preview`}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayStyles[p.type]}`} />
        <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider backdrop-blur-sm ${badgeStyles[p.type]}`}>
          {p.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full px-3 py-1 font-mono text-xs ${
                p.type === 'Desktop App' ? 'bg-sky-500/10 text-sky-400' : 'bg-secondary text-primary'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

        <div className="mt-6 flex items-center gap-3">
          {p.demo && p.demo !== '#' && (
            p.demo === '#home' ? (
              <button
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Visit Site <ExternalLink size={15} />
              </button>
            ) : (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] ${
                  p.type === 'Desktop App' ? 'bg-sky-500 hover:bg-sky-400' : 'bg-primary'
                }`}
              >
                {p.type === 'Desktop App' ? 'View Source' : 'Visit Site'}
                {p.type === 'Desktop App' ? <Code size={15} /> : <ExternalLink size={15} />}
              </a>
            )
          )}
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
              <GithubIcon size={16} /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
