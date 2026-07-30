import { usePortfolioData } from '@/data/use-portfolio-data'
import { Reveal } from './reveal'

export default function About() {
  const { data } = usePortfolioData()
  const { about } = data

  return (
    <section id="about" className="relative px-6 pt-12 pb-28 md:pt-20 md:pb-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <Reveal>
          <div className="group relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="glass overflow-hidden rounded-[1.75rem] p-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-secondary">
                  <img
                    src={data.profile.aboutImage + '?width=600'}
                    alt={`Portrait of ${data.profile.name}`}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{about.sectionTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {about.heading}
            </h2>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground first:mt-6">
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {about.stats.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center transition-transform hover:-translate-y-1">
                  <p className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
