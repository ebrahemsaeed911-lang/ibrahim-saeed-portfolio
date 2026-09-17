import { ExternalLink } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { GithubIcon } from './brand-icons'
import { usePortfolioData } from '@/data/use-portfolio-data'

const typeStyles: Record<string, string> = {
  'Web App': 'text-primary',
  'Desktop App': 'text-muted-foreground',
}

export default function Projects() {
  const { data } = usePortfolioData()
  const { projects } = data

  return (
    <section id="projects" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="04" label={projects.sectionTitle} title={projects.heading} />
          <Reveal delay={0.1} className="md:max-w-sm">
            <p className="text-sm leading-relaxed text-muted-foreground">{projects.description}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.items.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project: p,
  index: i,
}: {
  project: { title: string; image: string; type: string; tags: string[]; desc: string; demo: string; github?: string }
  index: number
}) {
  const hasLiveDemo = Boolean(p.demo && p.demo !== '#' && p.demo !== '#home')
  const isSelf = p.demo === '#home'

  return (
    <Reveal delay={i * 0.05} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_-48px_rgba(124,92,255,0.85)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          <img
            src={p.image}
            alt={`${p.title} preview`}
            width={600}
            height={375}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          <span
            className={`absolute end-3 top-3 rounded-md border border-border/80 bg-background/70 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide backdrop-blur-sm ${
              typeStyles[p.type] ?? 'text-muted-foreground'
            }`}
          >
            {p.type}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <li
                key={t}
                className="rounded-md border border-border/70 bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2.5 border-t border-border/70 pt-5">
            {hasLiveDemo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Live Demo <ExternalLink size={14} />
              </a>
            )}
            {isSelf && (
              <button
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Visit Site <ExternalLink size={14} />
              </button>
            )}
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
              >
                <GithubIcon size={15} /> Code
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
