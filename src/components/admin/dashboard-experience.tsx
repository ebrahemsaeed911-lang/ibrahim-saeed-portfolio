import type { PortfolioData } from '@/data/use-portfolio-data'
import { Briefcase, Type, Plus, Trash2 } from 'lucide-react'

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

export default function DashboardExperience({ data, onChange }: Props) {
  const e = data.experience

  function updateItem(index: number, field: string, val: string) {
    const items = [...e.items]
    items[index] = { ...items[index], [field]: val }
    onChange({ ...data, experience: { ...e, items } })
  }

  function removeItem(index: number) {
    onChange({ ...data, experience: { ...e, items: e.items.filter((_, i) => i !== index) } })
  }

  function addItem() {
    onChange({ ...data, experience: { ...e, items: [...e.items, { period: '', title: '', company: '', desc: '' }] } })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Experience</h2>
              <p className="text-sm text-muted-foreground">Add your work history and professional experience.</p>
            </div>
          </div>
          <button onClick={addItem} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            <Plus size={15} /> Add Item
          </button>
        </div>
      </div>

      <Field icon={Type} label="Section title">
        <input value={e.sectionTitle} onChange={(e2) => onChange({ ...data, experience: { ...e, sectionTitle: e2.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <Field icon={Type} label="Heading">
        <input value={e.heading} onChange={(e2) => onChange({ ...data, experience: { ...e, heading: e2.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      {e.items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
              <span className="text-sm font-medium text-foreground">{item.title || `Item ${i + 1}`}</span>
            </div>
            <button onClick={() => removeItem(i)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={item.period} onChange={(e2) => updateItem(i, 'period', e2.target.value)} placeholder="Period (e.g. 2024 — Present)" className="col-span-2 rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            <input value={item.title} onChange={(e2) => updateItem(i, 'title', e2.target.value)} placeholder="Job title" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            <input value={item.company} onChange={(e2) => updateItem(i, 'company', e2.target.value)} placeholder="Company" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </div>
          <textarea value={item.desc} onChange={(e2) => updateItem(i, 'desc', e2.target.value)} rows={2} placeholder="Description of your role and achievements..." className="mt-3 w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
        </div>
      ))}
    </div>
  )
}
