const COOKIE_PREFIX = 'sb-auth-'
const MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export const cookieStorage: Storage = {
  getItem(key: string) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_PREFIX}${key}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
  },

  setItem(key: string, value: string) {
    const encoded = encodeURIComponent(value)
    document.cookie = `${COOKIE_PREFIX}${key}=${encoded}; Path=/; SameSite=Strict; Secure; Max-Age=${MAX_AGE}`
  },

  removeItem(key: string) {
    document.cookie = `${COOKIE_PREFIX}${key}=; Path=/; Max-Age=0`
  },

  get length() {
    return document.cookie.split(';').filter(c => c.trim().startsWith(`${COOKIE_PREFIX}`)).length
  },

  key(index: number) {
    const keys = document.cookie.split(';')
      .map(c => c.trim().split('=')[0])
      .filter(k => k.startsWith(COOKIE_PREFIX))
    return keys[index] || null
  },

  clear() {
    document.cookie.split(';').forEach(c => {
      const key = c.trim().split('=')[0]
      if (key.startsWith(COOKIE_PREFIX)) {
        document.cookie = `${key}=; Path=/; Max-Age=0`
      }
    })
  },
}
