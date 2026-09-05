const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || ''
const HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL || ''

const rateLimitStore = new Map()
function rateLimit(ip, limit, windowMs) {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  if (!entry || now - entry.start > windowMs) {
    rateLimitStore.set(ip, { start: now, count: 1 })
    return true
  }
  entry.count++
  return entry.count <= limit
}
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitStore) {
    if (now - entry.start > 600000) rateLimitStore.delete(ip)
  }
}, 60000)

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function parseCookies(req) {
  const raw = req.headers['cookie'] || ''
  const out = {}
  for (const part of raw.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    let value = part.slice(eq + 1).trim()
    try { value = decodeURIComponent(value) } catch {}
    out[part.slice(0, eq).trim()] = value
  }
  return out
}

async function hasValidAdminSession(req) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false
  const cookies = parseCookies(req)
  const token = cookies['sb-auth-access-token']
  if (!token) return false

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return false
    const user = await res.json()
    return Boolean(user?.id && user?.email)
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (!rateLimit(ip, 10, 600000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  if (!HOOK_URL) {
    return res.status(503).json({ error: 'Revalidation not configured' })
  }

  const { secret } = req.body || {}
  const hasMatchingSecret = Boolean(REVALIDATE_SECRET && secret && secret === REVALIDATE_SECRET)
  const hasSession = await hasValidAdminSession(req)

  if (!hasMatchingSecret && !hasSession) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const hookRes = await fetch(HOOK_URL, { method: 'POST' })
    if (!hookRes.ok) {
      return res.status(502).json({ error: 'Revalidation failed' })
    }
    res.json({ success: true })
  } catch {
    res.status(502).json({ error: 'Revalidation failed' })
  }
}