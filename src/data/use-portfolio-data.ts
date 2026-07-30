import { useEffect, useState } from 'react'
import defaultData from './portfolio-data.json'

export type PortfolioData = typeof defaultData

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(false) }, [])

  const save = async (newData: PortfolioData) => {
    setData(newData)

    const { supabase } = await import('@/lib/supabase')
    const { error } = await supabase
      .from('portfolio_data')
      .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() })

    if (error) console.error('Failed to sync to Supabase:', error)
  }

  return { data, loading, save }
}
