import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export default function DashboardContact({ data, onChange }: Props) {
  const c = data.contact

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Contact Section</h2>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={c.sectionTitle} onChange={(e) => onChange({ ...data, contact: { ...c, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={c.heading} onChange={(e) => onChange({ ...data, contact: { ...c, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Description</span>
        <textarea value={c.description} onChange={(e) => onChange({ ...data, contact: { ...c, description: e.target.value } })} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Email</span>
        <input value={c.email} onChange={(e) => onChange({ ...data, contact: { ...c, email: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>
    </div>
  )
}
