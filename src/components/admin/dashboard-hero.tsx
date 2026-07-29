import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
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
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Hero Section</h2>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Badge</span>
        <input value={h.badge} onChange={(e) => update('badge', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Greeting</span>
        <input value={h.greeting} onChange={(e) => update('greeting', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Title (first part)</span>
          <input value={h.title} onChange={(e) => update('title', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Subtitle (gradient)</span>
          <input value={h.subtitle} onChange={(e) => update('subtitle', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Description</span>
        <textarea value={h.description} onChange={(e) => update('description', e.target.value)} rows={3} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Primary button text</span>
          <input value={h.buttons.primary.text} onChange={(e) => update('buttons.primary.text', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Primary button action (section id)</span>
          <input value={h.buttons.primary.action} onChange={(e) => update('buttons.primary.action', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Secondary button text</span>
          <input value={h.buttons.secondary.text} onChange={(e) => update('buttons.secondary.text', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Secondary button action</span>
          <input value={h.buttons.secondary.action} onChange={(e) => update('buttons.secondary.action', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Profile image path</span>
        <input value={h.profileImage} onChange={(e) => update('profileImage', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>
    </div>
  )
}
