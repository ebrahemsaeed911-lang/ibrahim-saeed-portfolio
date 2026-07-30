import { useEffect, useState } from 'react'
import defaultData from './portfolio-data.json'

export type PortfolioData = typeof defaultData

const STORAGE_KEY = 'portfolio_data'
const CACHE_DURATION = 5 * 60 * 1000

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

async function fetchFromSupabase(): Promise<PortfolioData | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/portfolio_data?id=eq.1&select=data`,
      { headers: { apikey: supabaseAnonKey } }
    )
    if (!res.ok) return null
    const rows = await res.json()
    return (rows?.[0]?.data as PortfolioData) ?? null
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
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return deepMerge(cached.data, defaultData) as PortfolioData
  } catch {
    return null
  }
}

function saveToCache(data: PortfolioData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const cached = loadFromCache()
      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      const remote = await fetchFromSupabase()
      if (remote) {
        setData(remote)
        saveToCache(remote)
      }
      setLoading(false)
    }
    init()
  }, [])

  const save = async (newData: PortfolioData) => {
    setData(newData)
    saveToCache(newData)

    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() })

    if (error) console.error('Failed to sync to Supabase:', error)
  }

  return { data, loading, save }
}
