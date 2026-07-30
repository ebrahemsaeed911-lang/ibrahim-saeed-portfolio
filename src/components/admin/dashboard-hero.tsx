import type { PortfolioData } from '@/data/use-portfolio-data'
import { Layout, BadgePercent, Type, AlignLeft, SplitSquareHorizontal } from 'lucide-react'

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

export default function DashboardHero({ data, onChange }: Props) {
  const h = data.hero

  function update(field: string, value: string) {
    const path = field.split('.')
    onChange({
      ...data,
      hero: {
        ...h,
        [path[0]]: path.length > 1 ? { ...(h as any)[path[0]], [path[1]]: value } : value,
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Layout size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Hero Section</h2>
            <p className="text-sm text-muted-foreground">Customize the main landing section of your portfolio.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Headline</h3>
        <div className="flex flex-col gap-4">
          <Field icon={BadgePercent} label="Badge">
            <input value={h.badge} onChange={(e) => update('badge', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={Type} label="Greeting">
            <input value={h.greeting} onChange={(e) => update('greeting', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={SplitSquareHorizontal} label="Title (first part)">
              <input value={h.title} onChange={(e) => update('title', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            </Field>
            <Field icon={SplitSquareHorizontal} label="Subtitle (gradient)">
              <input value={h.subtitle} onChange={(e) => update('subtitle', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
            </Field>
          </div>

          <Field icon={AlignLeft} label="Description">
            <textarea value={h.description} onChange={(e) => update('description', e.target.value)} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Buttons</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field icon={Type} label="Primary button text">
            <input value={h.buttons.primary.text} onChange={(e) => update('buttons.primary.text', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <Field icon={Type} label="Primary action (section id)">
            <input value={h.buttons.primary.action} onChange={(e) => update('buttons.primary.action', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <Field icon={Type} label="Secondary button text">
            <input value={h.buttons.secondary.text} onChange={(e) => update('buttons.secondary.text', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <Field icon={Type} label="Secondary action (section id)">
            <input value={h.buttons.secondary.action} onChange={(e) => update('buttons.secondary.action', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
        </div>
      </div>
    </div>
  )
}
