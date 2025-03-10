'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingCarousel } from './LoadingCarousel'
import MDXEditorComponent from '../MD/MDXEditor'
import { 
  fetchSummary, 
  fetchUserNotes, 
  saveNotesToDB, 
  renderSummaryContent 
} from './utils'

interface SummaryDisplayProps {
  pageId: string
}

export function SummaryDisplay({ pageId }: SummaryDisplayProps) {
  const [summary, setSummary] = useState<{
    title: string
    summary: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('Start taking notes here...')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const userId = "2f795d09-3e57-4a1c-80a4-a74f0fc4c6ce"; 
  
  useEffect(() => {
    if (!pageId) return
    
    setLoading(true); 
    
    const savedNotes = localStorage.getItem(`notes-${pageId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSummary(pageId, { setSummary, setError }),
          fetchUserNotes(pageId, { setNotes })
        ])
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [pageId])
  
  useEffect(() => {
    if (!pageId || !notes) return
    
  
    localStorage.setItem(`notes-${pageId}`, notes)
    
  
    const timer = setTimeout(() => {
      saveNotesToDB(pageId, notes, { setIsSaving, setSaveError })
    }, 1000) // Wait 1 second after typing stops before saving to DB
    
    return () => clearTimeout(timer)
  }, [notes, pageId])

  if (loading) {
    return <LoadingCarousel />
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-6 w-full text-center"
      >
        <p className="text-red-500">{error}</p>
      </motion.div>
    )
  }

  if (!summary) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full relative"
      >
        <div className="bg-gray-700/90 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-600/50 sticky top-0 bg-gray-700/95 backdrop-blur-sm z-10">
            <h3 className="text-2xl font-semibold text-white text-center">
              {summary.title}
            </h3>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {renderSummaryContent(summary)}
          </div>
        </div>

          <div className="mt-6 bg-gray-700/90 rounded-lg overflow-hidden shadow-xl mb-6">
            <MDXEditorComponent 
              markdown={notes}
              onChange={(markdown: string) => {
                setNotes(markdown);
              }}
            />
            {isSaving && (
              <p className="text-xs text-blue-400 text-center mt-1">Saving...</p>
            )}
            {saveError && (
              <p className="text-xs text-red-400 text-center mt-1">{saveError}</p>
            )}
          </div>
      </motion.div>
    </AnimatePresence>
  )
}
