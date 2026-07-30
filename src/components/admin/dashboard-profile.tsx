import type { PortfolioData } from '@/data/use-portfolio-data'
import ImageUploader from './image-uploader'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export default function DashboardProfile({ data, onChange }: Props) {
  const p = data.profile

  function set(field: string, val: string) {
    onChange({ ...data, profile: { ...p, [field]: val } })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="text-sm text-muted-foreground">Changes here update everywhere on the site.</p>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Full name</span>
        <input value={p.name} onChange={(e) => set('name', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Initials (nav logo)</span>
        <input value={p.initials} onChange={(e) => set('initials', e.target.value)} maxLength={4} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Main title</span>
        <input value={p.mainTitle} onChange={(e) => set('mainTitle', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <ImageUploader
        label="Profile image (hero section)"
        value={p.profileImage}
        onChange={(v) => set('profileImage', v)}
      />

      <ImageUploader
        label="About image"
        value={p.aboutImage}
        onChange={(v) => set('aboutImage', v)}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Favicon text (browser tab)</span>
        <input value={p.faviconText} onChange={(e) => set('faviconText', e.target.value)} maxLength={6} className="rounded-xl border border-border bg-background/40 px-4 py-3 font-mono text-foreground outline-none focus:border-primary/60" />
      </label>

      <ImageUploader
        label="Favicon image (overrides text)"
        value={p.favicon}
        onChange={(v) => set('favicon', v)}
      />
    </div>
  )
}
