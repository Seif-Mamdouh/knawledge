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
import { FiShare2 } from 'react-icons/fi'

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
  const [isCopied, setIsCopied] = useState(false)
  
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
    }, 1000) 
    
    return () => clearTimeout(timer)
  }, [notes, pageId])

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/summarize/${pageId}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

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
          <div className="p-6 border-b border-gray-600/50 sticky top-0 bg-gray-700/95 backdrop-blur-sm z-10 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-white text-center flex-grow">
              {summary.title}
            </h3>
            <button 
              onClick={handleShareLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-colors"
            >
              <FiShare2 className="w-4 h-4" />
              {isCopied ? 'Copied!' : 'Share'}
            </button>
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
