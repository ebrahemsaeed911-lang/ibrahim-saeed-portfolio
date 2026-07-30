import type { PortfolioData } from '@/data/use-portfolio-data'
import { Share2, Globe } from 'lucide-react'

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

export default function DashboardSocial({ data, onChange }: Props) {
  const s = data.social

  function set(field: string, val: string) {
    onChange({ ...data, social: { ...s, [field]: val } })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Share2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
            <p className="text-sm text-muted-foreground">Connect visitors with your social profiles.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          <Field icon={Globe} label="GitHub URL">
            <input value={s.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/your-profile" className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <Field icon={Globe} label="LinkedIn URL">
            <input value={s.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/your-profile" className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <Field icon={Globe} label="Facebook URL">
            <input value={s.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/your-profile" className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
        </div>
      </div>
    </div>
  )
}
