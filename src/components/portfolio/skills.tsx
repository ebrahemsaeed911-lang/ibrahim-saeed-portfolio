import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from './reveal'
import { usePortfolioData } from '@/data/use-portfolio-data'

function SkillCard({ skill, index }: { skill: { name: string; level: number; desc: string; icon: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="glass group relative overflow-hidden rounded-3xl p-7 transition-colors hover:border-primary/40"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary font-mono text-sm font-semibold text-primary">
          {skill.icon}
        </span>
        <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">{skill.level}%</span>
      </div>

      <h3 className="mt-5 text-xl font-semibold">{skill.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{skill.desc}</p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.1, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { data } = usePortfolioData()
  const { skills } = data

  return (
    <section id="skills" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">{skills.sectionTitle}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{skills.heading}</h2>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.items.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
