import type { PortfolioData } from '@/data/use-portfolio-data'
import { Mail, Type, AlignLeft, MessageSquare } from 'lucide-react'

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

export default function DashboardContact({ data, onChange }: Props) {
  const c = data.contact

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contact Section</h2>
            <p className="text-sm text-muted-foreground">Configure how visitors can reach you.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          <Field icon={Type} label="Section title">
            <input value={c.sectionTitle} onChange={(e) => onChange({ ...data, contact: { ...c, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={MessageSquare} label="Heading">
            <input value={c.heading} onChange={(e) => onChange({ ...data, contact: { ...c, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={AlignLeft} label="Description">
            <textarea value={c.description} onChange={(e) => onChange({ ...data, contact: { ...c, description: e.target.value } })} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={Mail} label="Email address">
            <input value={c.email} onChange={(e) => onChange({ ...data, contact: { ...c, email: e.target.value } })} placeholder="you@example.com" className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
        </div>
      </div>
    </div>
  )
}
