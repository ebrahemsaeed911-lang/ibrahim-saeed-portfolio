import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { usePortfolioData } from '@/data/use-portfolio-data'

type Skill = { name: string; level: number; desc: string; icon: string; learning?: boolean }

const groups = ['Frontend', 'Backend', 'Database', 'Tools'] as const
type Group = (typeof groups)[number]

function categoryOf(name: string): Group {
  const n = name.toLowerCase()
  if (/(html|css|javascript|typescript|react|tailwind|next)/.test(n)) return 'Frontend'
  if (/(node|express|python)/.test(n)) return 'Backend'
  if (/(sql|postgres|supabase)/.test(n)) return 'Database'
  return 'Tools'
}

export default function Skills() {
  const { data } = usePortfolioData()
  const { skills } = data

  const byGroup = groups.map((group) => ({
    group,
    items: skills.items.filter((s) => categoryOf(s.name) === group),
  }))

  const hasLearning = skills.items.some((s) => s.learning)

  return (
    <section id="skills" className="relative scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="02" label={skills.sectionTitle} title={skills.heading} />
          {hasLearning && (
            <Reveal delay={0.1}>
              <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="text-primary">~</span>
                {skills.learningHeading || 'Currently Learning'}
              </p>
            </Reveal>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {byGroup.map(({ group, items }, gi) => (
            <Reveal key={group} delay={gi * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {group}
                  </h3>
                  <span className="font-mono text-xs text-border">{items.length}</span>
                </div>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {items.length > 0 ? (
                    items.map((s) => <SkillChip key={s.name} skill={s} />)
                  ) : (
                    <li className="font-mono text-xs text-border">—</li>
                  )}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillChip({ skill }: { skill: Skill }) {
  return (
    <li
      title={skill.desc}
      className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors duration-200 ${
        skill.learning
          ? 'border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground'
          : 'border-border bg-secondary text-foreground hover:border-primary/40'
      }`}
    >
      {skill.learning && <span className="me-1 text-primary">~</span>}
      {skill.name}
    </li>
  )
}
