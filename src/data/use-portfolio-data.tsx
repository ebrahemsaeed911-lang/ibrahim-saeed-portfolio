import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import defaultData from './portfolio-data.json'

export type PortfolioData = typeof defaultData

type ContextValue = {
  data: PortfolioData
  loading: boolean
  save: (newData: PortfolioData) => Promise<void>
}

const PortfolioContext = createContext<ContextValue | null>(null)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

async function fetchFromSupabase(): Promise<PortfolioData | null> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/portfolio_data?id=eq.1&select=data`, {
      headers: { apikey: supabaseKey },
    })
    if (!res.ok) return null
    const rows = await res.json()
    return rows?.[0]?.data ?? null
  } catch {
    return null
  }
}

let setLiveRef: ((active: boolean) => void) | null = null

export function setAdminLiveData(active: boolean) {
  setLiveRef?.(active)
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    setLoading(false)
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    setLiveRef = setLive
    return () => { setLiveRef = null }
  }, [])

  useEffect(() => {
    if (!live || !supabaseUrl || !supabaseKey) return

    const timeout = setTimeout(async () => {
      const remote = await fetchFromSupabase()
      if (mounted.current && remote) setData(remote)
    }, 300)

    return () => clearTimeout(timeout)
  }, [live])

  const save = async (newData: PortfolioData) => {
    setData(newData)

    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() })

    if (error) return

    try {
      await fetch('/api/revalidate', { method: 'POST' })
    } catch { /* revalidation is best-effort */ }
  }

  return (
    <PortfolioContext.Provider value={{ data, loading, save }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolioData must be used within PortfolioProvider')
  return ctx
}
