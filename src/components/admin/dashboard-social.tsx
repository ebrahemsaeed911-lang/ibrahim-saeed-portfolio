import type { PortfolioData } from '@/data/use-portfolio-data'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export default function DashboardSocial({ data, onChange }: Props) {
  const s = data.social

  function update(field: keyof typeof s, val: string) {
    onChange({ ...data, social: { ...s, [field]: val } })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Social Links</h2>

      {(['github', 'linkedin', 'facebook'] as const).map((key) => (
        <label key={key} className="flex flex-col gap-1.5 text-sm">
          <span className="capitalize text-muted-foreground">{key}</span>
          <input
            value={s[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={`https://${key}.com/your-username`}
            className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60"
          />
        </label>
      ))}
    </div>
  )
}
