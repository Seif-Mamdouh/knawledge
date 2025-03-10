'use client'

import { useEffect, useState } from 'react'
import { getSummary } from '@/app/actions/getSummary'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingCarousel } from './LoadingCarousel'
import MDXEditorComponent from '../MD/MDXEditor'
import { saveUserNotes } from '@/app/actions/saveUserNotes'
import { getUserNotes } from '@/app/actions/getUserNotes'

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
  
  // Debounce the notes to avoid too many DB writes
  useEffect(() => {
    if (!pageId) return
    
    setLoading(true); 
    
    const savedNotes = localStorage.getItem(`notes-${pageId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
    // Then fetch both summary and notes from DB
    const fetchData = async () => {
      try {
        // Fetch summary
        const summaryResult = await getSummary(pageId)
        if (summaryResult.success) {
          setSummary({
            title: summaryResult.title || '',
            summary: summaryResult.summary || ''
          })
        } else {
          setError(summaryResult.error || 'Failed to fetch summary')
        }
        
        // Fetch user notes
        const notesResult = await getUserNotes(pageId)
        if (notesResult.success && notesResult.notes) {
          setNotes(notesResult.notes)
          // Update localStorage with the latest from DB
          localStorage.setItem(`notes-${pageId}`, notesResult.notes)
        }
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pageId])
  
  
  // Add a debounce mechanism for saving notes
  useEffect(() => {
    if (!pageId || !notes) return
    
    // Save to localStorage immediately
    localStorage.setItem(`notes-${pageId}`, notes)
    
    // But debounce the database save
    const timer = setTimeout(() => {
      const saveNotesToDB = async () => {
        setIsSaving(true)
        setSaveError(null)
        
        try {
          const result = await saveUserNotes(pageId, notes)
          if (!result.success) {
            console.error("Error saving notes:", result.error);
            setSaveError(result.error || 'Failed to save notes')
          }
        } catch (err) {
          console.error("Exception saving notes:", err);
          setSaveError('Failed to save notes')
        } finally {
          setIsSaving(false)
        }
      }
      
      saveNotesToDB()
    }, 1000) // Wait 1 second after typing stops before saving to DB
    
    // Clean up the timer if notes change again before the timeout
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
            {summary.summary.split('\n\n').map((paragraph, index) => {
              const isNumberedPoint = /^\d+\.\s/.test(paragraph)
              const isHeader = paragraph.includes('**') || paragraph.toLowerCase().includes('key points')
              
              if (isHeader) {
                return (
                  <h4 key={index} className="text-xl text-gray-200 font-semibold pt-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h4>
                )
              }
              
              if (isNumberedPoint) {
                return (
                  <div key={index} className="pl-6 text-gray-300">
                    <p className="relative">
                      <span className="absolute -left-6 text-blue-400 text-lg">•</span>
                      {paragraph.replace(/^\d+\.\s/, '')}
                    </p>
                  </div>
                )
              }
              
              return (
                <p key={index} className="text-gray-300 leading-relaxed text-lg">
                  {paragraph}
                </p>
              )
            })}
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
