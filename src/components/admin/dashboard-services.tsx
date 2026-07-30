import type { PortfolioData } from '@/data/use-portfolio-data'
import { Wrench, Type, Plus, Trash2, Hash, MonitorSmartphone } from 'lucide-react'

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

export default function DashboardServices({ data, onChange }: Props) {
  const s = data.services

  function updateItem(index: number, field: string, val: string) {
    const items = [...s.items]
    items[index] = { ...items[index], [field]: val }
    onChange({ ...data, services: { ...s, items } })
  }

  function removeItem(index: number) {
    onChange({ ...data, services: { ...s, items: s.items.filter((_, i) => i !== index) } })
  }

  function addItem() {
    onChange({ ...data, services: { ...s, items: [...s.items, { icon: 'MonitorSmartphone', title: '', desc: '', num: String(s.items.length + 1).padStart(2, '0') }] } })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Services</h2>
              <p className="text-sm text-muted-foreground">List the services and solutions you offer.</p>
            </div>
          </div>
          <button onClick={addItem} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            <Plus size={15} /> Add Service
          </button>
        </div>
      </div>

      <Field icon={Type} label="Section title">
        <input value={s.sectionTitle} onChange={(e) => onChange({ ...data, services: { ...s, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <Field icon={Type} label="Heading">
        <input value={s.heading} onChange={(e) => onChange({ ...data, services: { ...s, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      {s.items.map((svc, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
              <span className="text-sm font-medium text-foreground">{svc.title || `Service ${i + 1}`}</span>
            </div>
            <button onClick={() => removeItem(i)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
              <Trash2 size={12} /> Remove
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field icon={Hash} label="Title">
              <input value={svc.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Service title" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            </Field>
            <Field icon={Hash} label="Number">
              <input value={svc.num} onChange={(e) => updateItem(i, 'num', e.target.value)} placeholder="01, 02..." className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground font-mono outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            </Field>
            <Field icon={MonitorSmartphone} label="Icon">
              <select value={svc.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60">
                <option value="MonitorSmartphone">MonitorSmartphone</option>
                <option value="Layout">Layout</option>
                <option value="Wrench">Wrench</option>
              </select>
            </Field>
          </div>
          <textarea value={svc.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} rows={2} placeholder="Service description..." className="mt-3 w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
        </div>
      ))}
    </div>
  )
}
