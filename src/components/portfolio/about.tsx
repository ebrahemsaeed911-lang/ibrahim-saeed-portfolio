import { usePortfolioData } from '@/data/use-portfolio-data'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

export default function About() {
  const { data } = usePortfolioData()
  const { about } = data

  return (
    <section id="about" className="relative px-6 pb-24 pt-20 md:pb-32 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[320px_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <div className="mx-auto w-full max-w-[300px] md:max-w-none">
            <div className="rounded-2xl border border-border bg-card p-1.5 shadow-[0_30px_90px_-56px_rgba(124,92,255,0.6),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                <img
                  src={data.profile.aboutImage}
                  alt={`Portrait of ${data.profile.name}`}
                  width={320}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading index="01" label={about.sectionTitle} title={about.heading} />

          <div className="mt-6 space-y-4">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className="text-pretty leading-relaxed text-muted-foreground">{p.trim()}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-3">
              {about.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card px-3 py-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors duration-200 hover:border-primary/30"
                >
                  <dd className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {s.value}
                  </dd>
                  <dt className="mt-1.5 text-[11px] leading-tight text-muted-foreground sm:text-xs">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
