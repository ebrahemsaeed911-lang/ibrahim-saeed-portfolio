import { useEffect, useRef } from 'react'
import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
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

  function updateItem(index: number, field: string, val: string | number) {
    const items = [...s.items]
    items[index] = { ...items[index], [field]: val }
    onChange({ ...data, skills: { ...s, items } })
  }

  function removeItem(index: number) {
    onChange({ ...data, skills: { ...s, items: s.items.filter((_, i) => i !== index) } })
  }

  function addItem() {
    onChange({ ...data, skills: { ...s, items: [...s.items, { name: '', level: 50, desc: '', icon: '⚛' }] } })
  }

  function moveItem(index: number, direction: -1 | 1) {
    const items = [...s.items]
    const target = index + direction
    if (target < 0 || target >= items.length) return
    ;[items[index], items[target]] = [items[target], items[index]]
    onChange({ ...data, skills: { ...s, items } })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button onClick={addItem} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform">+ Add Skill</button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={s.sectionTitle} onChange={(e) => onChange({ ...data, skills: { ...s, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={s.heading} onChange={(e) => onChange({ ...data, skills: { ...s, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <div ref={itemsRef} className="flex flex-col gap-4">
        {s.items.map((skill, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">{skill.name || `Skill ${i + 1}`}</span>
              <div className="flex gap-2">
                <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-xs text-muted-foreground disabled:opacity-30">↑</button>
                <button onClick={() => moveItem(i, 1)} disabled={i === s.items.length - 1} className="text-xs text-muted-foreground disabled:opacity-30">↓</button>
                <button onClick={() => removeItem(i)} className="text-xs text-red-400">✕</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={skill.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Name" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
              <input value={skill.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} placeholder="Icon" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
              <input type="number" min={0} max={100} value={skill.level} onChange={(e) => updateItem(i, 'level', Number(e.target.value))} placeholder="Level %" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
              <input value={skill.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Description" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
