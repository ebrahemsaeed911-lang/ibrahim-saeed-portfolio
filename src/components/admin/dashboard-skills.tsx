import { useEffect, useRef } from 'react'
import type { PortfolioData } from '@/data/use-portfolio-data'
import { Code2, Type, Plus, Percent, Trash2 } from 'lucide-react'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon size={13} /> {label}
      </span>
      {children}
    </label>
  )
}

export default function DashboardSkills({ data, onChange }: Props) {
  const s = data.skills
  const itemsRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(s.items.length)

  useEffect(() => {
    if (s.items.length > prevCount.current) {
      const el = itemsRef.current?.lastElementChild
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    prevCount.current = s.items.length
  }, [s.items.length])

  function updateItem(index: number, field: string, val: string) {
    const items = [...s.items]
    items[index] = { ...items[index], [field]: field === 'level' ? Number(val) : val }
    onChange({ ...data, skills: { ...s, items } })
  }

  function removeItem(index: number) {
    onChange({ ...data, skills: { ...s, items: s.items.filter((_, i) => i !== index) } })
  }

  function addItem() {
    onChange({ ...data, skills: { ...s, items: [...s.items, { name: '', level: 80, desc: '', icon: '' }] } })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Code2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Skills</h2>
              <p className="text-sm text-muted-foreground">Showcase your technical skills and proficiency.</p>
            </div>
          </div>
          <button onClick={addItem} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            <Plus size={15} /> Add Skill
          </button>
        </div>
      </div>

      <Field icon={Type} label="Section title">
        <input value={s.sectionTitle} onChange={(e) => onChange({ ...data, skills: { ...s, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <Field icon={Type} label="Heading">
        <input value={s.heading} onChange={(e) => onChange({ ...data, skills: { ...s, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <div ref={itemsRef} className="flex flex-col gap-3">
        {s.items.map((skill, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{skill.name || `Skill ${i + 1}`}</span>
              <button onClick={() => removeItem(i)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                <Trash2 size={12} /> Remove
              </button>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <input value={skill.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Skill name" className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
              </div>
              <div className="w-32">
                <div className="flex items-center gap-2">
                  <Percent size={13} className="text-muted-foreground" />
                  <input type="number" min={0} max={100} value={skill.level} onChange={(e) => updateItem(i, 'level', e.target.value)} className="w-16 rounded-xl border border-border bg-background/40 px-3 py-2.5 text-center text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
                </div>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
