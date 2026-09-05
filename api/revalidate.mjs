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

  if (REVALIDATE_SECRET) {
    const { secret } = req.body || {}
    if (!secret || secret !== REVALIDATE_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  if (!HOOK_URL) {
    return res.status(503).json({ error: 'Revalidation not configured' })
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