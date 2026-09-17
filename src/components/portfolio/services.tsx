import { Layout, MonitorSmartphone, Wrench, type LucideIcon } from 'lucide-react'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { usePortfolioData } from '@/data/use-portfolio-data'

const iconMap: Record<string, LucideIcon> = {
  MonitorSmartphone,
  Layout,
  Wrench,
}

export default function Services() {
  const { data } = usePortfolioData()
  const { services } = data

  return (
    <section id="services" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label={services.sectionTitle}
          title={services.heading}
          align="center"
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {services.items.map((s, i) => {
            const Icon = iconMap[s.icon] || MonitorSmartphone
            return (
              <Reveal key={s.title} delay={i * 0.06} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/30">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-secondary text-primary">
                      <Icon size={19} />
                    </span>
                    <span className="font-mono text-xs text-border">{s.num}</span>
                  </div>

                  <h3 className="mt-6 text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
