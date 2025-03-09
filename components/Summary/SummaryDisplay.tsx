'use client'

import { useEffect, useState } from 'react'
import { getSummary } from '@/app/actions/getSummary'
import { Card } from '../ui/card'
import { LoadingCarousel } from './LoadingCarousel'

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

  useEffect(() => {
    if (!pageId) return;
    
    setLoading(true); // Set loading immediately when pageId changes
    
    const fetchSummary = async () => {
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

    // Add a small delay to ensure loading state is visible
    const timer = setTimeout(() => {
      fetchSummary()
    }, 100)

    return () => clearTimeout(timer)
  }, [pageId])

  if (loading) {
    return <LoadingCarousel />
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