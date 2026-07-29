import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from './reveal'

const skills = [
  { name: 'HTML5', level: 95, desc: 'Semantic markup, accessible structure, SEO-friendly.', icon: '</>' },
  { name: 'CSS3', level: 90, desc: 'Responsive layouts, flexbox/grid, animations, design systems.', icon: '{ }' },
  { name: 'JavaScript (ES6+)', level: 85, desc: 'DOM manipulation, async patterns, ES6+ features, logic.', icon: 'JS' },
  { name: 'TypeScript', level: 75, desc: 'Static typing, interfaces, generics, type-safe code.', icon: 'TS' },
  { name: 'Python', level: 80, desc: 'Scripting, automation, data processing, backend logic.', icon: 'PY' },
  { name: 'React', level: 75, desc: 'Component architecture, JSX, hooks, state management, SPA development.', icon: '⚛' },
  { name: 'Git & GitHub', level: 85, desc: 'Version control, branching, collaboration, CI workflows.', icon: 'GIT' },
]

function SkillCard({ skill, index }: { skill: (typeof skills)[number]; index: number }) {
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

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">Skills</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Technologies I work with</h2>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
