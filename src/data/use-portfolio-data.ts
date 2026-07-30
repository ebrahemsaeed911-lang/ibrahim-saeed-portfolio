import { useEffect, useRef, useState } from 'react'
import defaultData from './portfolio-data.json'

export type PortfolioData = typeof defaultData

const STORAGE_KEY = 'portfolio_data'
const CACHE_VERSION = 2

async function getSupabase() {
  const { supabase } = await import('@/lib/supabase')
  return supabase
}

async function fetchFromSupabase(): Promise<PortfolioData | null> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  try {
    const res = await fetch(
      `${url}/rest/v1/portfolio_data?select=data&id=eq.1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    if (!res.ok) return null
    const rows = await res.json()
    return (rows[0]?.data as PortfolioData) ?? null
  } catch {
    return null
  }
}

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      if (result[key] === undefined) result[key] = source[key]
    }
  }
  return result
}

function loadFromCache(): PortfolioData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (cached.version !== CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return deepMerge(cached.data, defaultData) as PortfolioData
  } catch {
    return null
  }
}

function saveToCache(data: PortfolioData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now(), version: CACHE_VERSION }))
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => loadFromCache() ?? defaultData)
  const [loading, setLoading] = useState(true)
  const initialData = useRef(data)

  useEffect(() => {
    setLoading(false)

    fetchFromSupabase().then(remote => {
      if (!remote) return

      if (JSON.stringify(remote) !== JSON.stringify(initialData.current)) {
        setData(remote)
      }

      saveToCache(remote)
    })
  }, [])

  const refresh = async () => {
    const remote = await fetchFromSupabase()
    if (remote) {
      setData(remote)
      saveToCache(remote)
    }
  }

  const save = async (newData: PortfolioData) => {
    setData(newData)
    saveToCache(newData)

    const supabase = await getSupabase()
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() })

    if (error) console.error('Failed to sync to Supabase:', error)
  }

  return { data, loading, save, refresh }
}
