import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { usePortfolioData } from '@/data/use-portfolio-data'

export default function Experience() {
  const { data } = usePortfolioData()
  const { experience } = data

  return (
    <section id="experience" className="relative scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          label={experience.sectionTitle}
          title={experience.heading}
          align="center"
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div aria-hidden="true" className="absolute inset-y-2 start-[7px] w-px bg-border" />

          {experience.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="relative pb-12 ps-8 last:pb-0">
                <span className="absolute start-0 top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-border bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>

                <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {item.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-0.5 font-mono text-xs text-primary">{item.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
