import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(__dirname, '..', 'src', 'data', 'portfolio-data.json')

const url = process.env.VITE_SUPABASE_URL || ''
const key = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!url || !key) {
  console.log('[sync-data] Supabase env vars missing — keeping committed JSON.')
  process.exit(0)
}

function deepMerge(base, override) {
  if (override === undefined) return base
  if (Array.isArray(base) || Array.isArray(override)) return override
  if (typeof base !== 'object' || base === null || typeof override !== 'object' || override === null) {
    return override
  }
  const out = { ...base }
  for (const k of Object.keys(override)) {
    if (override[k] === undefined) continue
    out[k] = deepMerge(base[k], override[k])
  }
  return out
}

try {
  const res = await fetch(`${url}/rest/v1/portfolio_data?id=eq.1&select=data`, {
    headers: { apikey: key },
  })

  if (!res.ok) {
    console.warn(`[sync-data] Supabase responded ${res.status} — keeping committed JSON.`)
    process.exit(0)
  }

  const [row] = await res.json()
  if (!row?.data) {
    console.log('[sync-data] No portfolio row in DB — keeping committed JSON.')
    process.exit(0)
  }

  let base = {}
  try {
    base = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch {}

  const merged = deepMerge(base, row.data)
  fs.writeFileSync(dataFile, JSON.stringify(merged, null, 2) + '\n')
  console.log('[sync-data] portfolio-data.json updated from Supabase.')
} catch (err) {
  console.warn('[sync-data] Failed to fetch from Supabase — keeping committed JSON.', err?.message)
  process.exit(0)
}