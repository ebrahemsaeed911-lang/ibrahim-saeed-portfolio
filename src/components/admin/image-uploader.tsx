import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
}

export default function ImageUploader({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(path, file, { upsert: true })

    if (error) {
      console.error('Upload failed:', error.message)
      setUploading(false)
      return
    }

    const { data: publicUrl } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(data.path)

    onChange(publicUrl.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground hover:border-primary/60 disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <span className="text-xs text-muted-foreground">or</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL..."
          className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {value && (
        <img
          src={value}
          alt="preview"
          className="mt-2 h-24 w-24 rounded-xl border border-border object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
    </div>
  )
}
