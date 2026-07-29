import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export default function DashboardAbout({ data, onChange }: Props) {
  const a = data.about

  function updateStats(index: number, field: 'value' | 'label', val: string) {
    const stats = [...a.stats]
    stats[index] = { ...stats[index], [field]: val }
    onChange({ ...data, about: { ...a, stats } })
  }

  function updateParagraph(index: number, val: string) {
    const p = [...a.paragraphs]
    p[index] = val
    onChange({ ...data, about: { ...a, paragraphs: p } })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">About Section</h2>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={a.sectionTitle} onChange={(e) => onChange({ ...data, about: { ...a, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={a.heading} onChange={(e) => onChange({ ...data, about: { ...a, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      {a.paragraphs.map((p, i) => (
        <label key={i} className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Paragraph {i + 1}</span>
          <textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
      ))}

      <div>
        <p className="mb-3 text-sm text-muted-foreground">Stats</p>
        <div className="grid grid-cols-3 gap-3">
          {a.stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4">
              <input value={s.value} onChange={(e) => updateStats(i, 'value', e.target.value)} placeholder="Value" className="mb-2 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-center text-foreground outline-none focus:border-primary/60" />
              <input value={s.label} onChange={(e) => updateStats(i, 'label', e.target.value)} placeholder="Label" className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-center text-foreground outline-none focus:border-primary/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
