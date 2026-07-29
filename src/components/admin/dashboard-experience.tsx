import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Experience</h2>
        <button onClick={addItem} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform">+ Add Item</button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={e.sectionTitle} onChange={(e2) => onChange({ ...data, experience: { ...e, sectionTitle: e2.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={e.heading} onChange={(e2) => onChange({ ...data, experience: { ...e, heading: e2.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      {e.items.map((item, i) => (
        <div key={i} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">{item.title || `Item ${i + 1}`}</span>
            <button onClick={() => removeItem(i)} className="text-xs text-red-400">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={item.period} onChange={(e2) => updateItem(i, 'period', e2.target.value)} placeholder="Period (e.g. 2024 — Present)" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <input value={item.title} onChange={(e2) => updateItem(i, 'title', e2.target.value)} placeholder="Title" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <input value={item.company} onChange={(e2) => updateItem(i, 'company', e2.target.value)} placeholder="Company" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
          </div>
          <textarea value={item.desc} onChange={(e2) => updateItem(i, 'desc', e2.target.value)} rows={2} placeholder="Description" className="mt-3 w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
        </div>
      ))}
    </div>
  )
}
