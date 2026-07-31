import { Reveal } from './reveal'
import { usePortfolioData } from '@/data/use-portfolio-data'
import { useInView } from '@/hooks/use-in-view'

function SkillCard({ skill, index }: { skill: { name: string; level: number; desc: string; icon: string; learning?: boolean }; index: number }) {
  const { ref, inView } = useInView({ rootMargin: '-60px' })

  return (
    <div
      ref={ref}
      className={`glass group relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:border-primary/40 ${
        inView ? 'animate-fade-slide-up' : 'translate-y-8 opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
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

      {skill.learning && (
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Currently Learning
        </span>
      )}

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-[1.1s] ease-out ${skill.learning ? 'bg-accent/70' : 'bg-gradient-to-r from-primary to-accent'}`}
          style={{ width: inView ? `${skill.level}%` : '0%', transitionDelay: `${0.3 + index * 0.08}s` }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const { data } = usePortfolioData()
  const { skills } = data
  const mastered = skills.items.filter((s) => !s.learning)
  const learning = skills.items.filter((s) => s.learning)

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
          {mastered.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>

        {learning.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <h3 className="mb-8 flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {skills.learningHeading || 'Currently Learning'}
              </h3>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {learning.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
