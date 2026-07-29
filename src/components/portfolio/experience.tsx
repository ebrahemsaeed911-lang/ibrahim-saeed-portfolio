import { motion } from 'motion/react'
import { Briefcase } from 'lucide-react'
import { Reveal } from './reveal'
import { usePortfolioData } from '@/data/use-portfolio-data'

export default function Experience() {
  const { data } = usePortfolioData()
  const { experience } = data

  return (
    <section id="experience" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{experience.sectionTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{experience.heading}</h2>
          </Reveal>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-primary via-accent to-transparent" />

          {experience.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative ml-20 pb-14 last:pb-0"
            >
              <div className="absolute -left-12 mt-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-primary">
                <Briefcase size={14} />
              </div>

              <Reveal delay={0.1 + i * 0.12}>
                <span className="font-mono text-xs uppercase tracking-wider text-primary">{item.period}</span>
              </Reveal>
              <Reveal delay={0.15 + i * 0.12}>
                <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              </Reveal>
              <Reveal delay={0.2 + i * 0.12}>
                <p className="text-sm text-muted-foreground">{item.company}</p>
              </Reveal>
              <Reveal delay={0.25 + i * 0.12}>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </Reveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
