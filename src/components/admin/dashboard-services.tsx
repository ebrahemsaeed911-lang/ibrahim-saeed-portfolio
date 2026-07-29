import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Services</h2>
        <button onClick={addItem} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform">+ Add Service</button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={s.sectionTitle} onChange={(e) => onChange({ ...data, services: { ...s, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={s.heading} onChange={(e) => onChange({ ...data, services: { ...s, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      {s.items.map((svc, i) => (
        <div key={i} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">{svc.title || `Service ${i + 1}`}</span>
            <button onClick={() => removeItem(i)} className="text-xs text-red-400">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={svc.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Title" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <input value={svc.num} onChange={(e) => updateItem(i, 'num', e.target.value)} placeholder="Number (01, 02...)" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <select value={svc.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60">
              <option value="MonitorSmartphone">MonitorSmartphone</option>
              <option value="Layout">Layout</option>
              <option value="Wrench">Wrench</option>
            </select>
          </div>
          <textarea value={svc.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} rows={2} placeholder="Description" className="mt-3 w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
        </div>
      ))}
    </div>
  )
}
