import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
}

interface Compressed { blob: Blob; type: string }

function compress(file: File, maxW: number): Promise<Compressed> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'

    const draw = (source: CanvasImageSource) => {
      const w = Math.min(img.naturalWidth, maxW)
      const h = (img.naturalHeight / img.naturalWidth) * w
      const c = document.createElement('canvas')
      c.width = Math.max(1, Math.round(w))
      c.height = Math.max(1, Math.round(h))
      const ctx = c.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(source, 0, 0, c.width, c.height)
      c.toBlob(
        b => b ? resolve({ blob: b, type: b.type || 'image/webp' }) : reject(new Error('compress failed')),
        'image/webp',
        0.85,
      )
    }

    img.onload = () => {
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(img, { imageOrientation: 'from-image' })
          .then(bitmap => { draw(bitmap); bitmap.close() })
          .catch(() => draw(img))
      } else {
        draw(img)
      }
    }
    img.onerror = () => reject(new Error('image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageUploader({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const { blob, type } = await compress(file, 1200)
      const ext = type === 'image/jpeg' ? 'jpg' : type.split('/')[1] || 'png'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(path, blob, { upsert: true, contentType: type })

      if (error) {
        setError(error.message)
        console.error('Upload failed:', error.message)
        setUploading(false)
        return
      }

      const { data: publicUrl } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(data.path)

      onChange(publicUrl.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image processing failed')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
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

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

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
