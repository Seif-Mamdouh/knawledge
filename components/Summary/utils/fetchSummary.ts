import { getSummary } from '@/app/actions/getSummary'

interface SummaryState {
  setSummary: (summary: { title: string; summary: string } | null) => void;
  setError: (error: string | null) => void;
}

export const fetchSummary = async (
  pageId: string,
  { setSummary, setError }: SummaryState
) => {
  try {
    const summaryResult = await getSummary(pageId)
    if (summaryResult.success) {
      setSummary({
        title: summaryResult.title || '',
        summary: summaryResult.summary || ''
      })
    } else {
      setError(summaryResult.error || 'Failed to fetch summary')
    }
  } catch (err) {
    setError('Failed to fetch summary')
    console.error("Error fetching summary:", err)
  }
} 