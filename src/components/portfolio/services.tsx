import { motion } from 'motion/react'
import { Layout, MonitorSmartphone, Wrench } from 'lucide-react'
import { Reveal } from './reveal'

const services = [
  {
    icon: MonitorSmartphone,
    title: 'Responsive Web Design',
    desc: 'Pixel-perfect interfaces that adapt beautifully across mobile, tablet, and desktop.',
    num: '01',
  },
  {
    icon: Layout,
    title: 'Landing Page Development',
    desc: 'High-converting, fast-loading landing pages designed to capture attention and drive action.',
    num: '02',
  },
  {
    icon: Wrench,
    title: 'Website Maintenance',
    desc: 'Ongoing updates, performance tuning, and bug fixes to keep your site running flawlessly.',
    num: '03',
  },
]

export function Services() {
  return (
    <section id="services" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">Services</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">How I can help you</h2>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass group relative overflow-hidden rounded-3xl p-8 transition-colors hover:border-primary/40"
            >
              <span className="absolute right-6 top-5 font-mono text-5xl font-semibold text-foreground/5 transition-colors group-hover:text-primary/10">
                {s.num}
              </span>
              <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6">
                <s.icon size={24} />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
