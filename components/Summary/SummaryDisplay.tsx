'use client'

import { useEffect, useState } from 'react'
import { getSummary } from '@/app/actions/getSummary'
import { Card } from '@/components/ui/card'

interface SummaryDisplayProps {
  pageId: string
}

export function SummaryDisplay({ pageId }: SummaryDisplayProps) {
  const [summary, setSummary] = useState<{
    title: string;
    summary: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    if (!pageId) return;
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await getSummary(pageId)
      if (result.success) {
        setSummary({
          title: result.title || '',
          summary: result.summary || ''
        })
      } else {
        setError(result.error || 'Failed to fetch summary')
      }
    } catch (err) {
      setError('Failed to fetch summary')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [pageId])

  if (loading) {
    return (
      <Card className="p-4 mt-4 bg-black/50 border-gray-800">
        <div className="animate-pulse text-gray-400">Loading summary...</div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 mt-4 bg-black/50 border-gray-800">
        <div className="text-red-400">{error}</div>
      </Card>
    )
  }

  if (!summary) return null

  return (
    <Card className="p-4 mt-4 bg-black/50 border-gray-800">
      <h3 className="text-lg font-medium text-white mb-2">{summary.title}</h3>
      <div className="text-gray-300 text-sm whitespace-pre-wrap">
        {summary.summary}
      </div>
    </Card>
  )
} 