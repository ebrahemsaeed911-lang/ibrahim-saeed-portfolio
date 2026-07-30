import { Layout, MonitorSmartphone, Wrench, type LucideIcon } from 'lucide-react'
import { Reveal } from './reveal'
import { usePortfolioData } from '@/data/use-portfolio-data'
import { useInView } from '@/hooks/use-in-view'

const iconMap: Record<string, LucideIcon> = {
  MonitorSmartphone, Layout, Wrench,
}

export default function Services() {
  const { data } = usePortfolioData()
  const { services } = data

  return (
    <section id="services" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{services.sectionTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{services.heading}</h2>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.items.map((s, i) => {
            const Icon = iconMap[s.icon] || MonitorSmartphone
            return <ServiceCard key={s.title} service={s} icon={Icon} index={i} />
          })}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service: s, icon: Icon, index: i }: { service: { icon: string; title: string; desc: string; num: string }; icon: LucideIcon; index: number }) {
  const { ref, inView } = useInView({ rootMargin: '-60px' })

  return (
    <div
      ref={ref}
      className={`glass group relative overflow-hidden rounded-3xl p-8 transition-colors hover:border-primary/40 ${
        inView ? 'animate-fade-slide-up' : 'translate-y-8 opacity-0'
      }`}
      style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
    >
      <span className="absolute right-6 top-5 font-mono text-5xl font-semibold text-foreground/5 transition-colors group-hover:text-primary/10">
        {s.num}
      </span>
      <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6">
        <Icon size={24} />
      </span>
      <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
    </div>
  )
}
