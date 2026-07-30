import type { PortfolioData } from '@/data/use-portfolio-data'
import { Info, Type, AlignLeft, BarChart3 } from 'lucide-react'

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
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Info size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">About Section</h2>
            <p className="text-sm text-muted-foreground">Tell visitors about yourself and your journey.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Content</h3>
        <div className="flex flex-col gap-4">
          <Field icon={Type} label="Section title">
            <input value={a.sectionTitle} onChange={(e) => onChange({ ...data, about: { ...a, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={Type} label="Heading">
            <input value={a.heading} onChange={(e) => onChange({ ...data, about: { ...a, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          {a.paragraphs.map((p, i) => (
            <Field key={i} icon={AlignLeft} label={`Paragraph ${i + 1}`}>
              <textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            </Field>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <BarChart3 size={15} className="text-primary" />
          Stats
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {a.stats.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-background/40 p-4">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">Stat {i + 1}</p>
              <div className="flex flex-col gap-2">
                <input value={s.value} onChange={(e) => updateStats(i, 'value', e.target.value)} placeholder="Value" className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-center text-sm font-semibold text-foreground outline-none focus:border-primary/60" />
                <input value={s.label} onChange={(e) => updateStats(i, 'label', e.target.value)} placeholder="Label" className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-center text-xs text-foreground outline-none focus:border-primary/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
