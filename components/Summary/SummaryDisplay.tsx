'use client'

import { useEffect, useState } from 'react'
import { getSummary } from '@/app/actions/getSummary'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingCarousel } from './LoadingCarousel'
import MDXEditorComponent from '../MD/MDXEditor'

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

  useEffect(() => {
    if (!pageId) return
    
    setLoading(true); 
    
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem(`notes-${pageId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
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

    fetchSummary()
  }, [pageId])

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
        <div className="absolute inset-0 bg-gray-700/80 rounded-lg transform translate-y-1 -z-10" />
        <div className="absolute inset-0 bg-gray-700/60 rounded-lg transform translate-y-2 -z-20" />
        

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

        <div className="mt-6 bg-gray-700/90 rounded-lg overflow-hidden shadow-xl">
          <div className="p-6">
            <MDXEditorComponent 
              contentEditableClassName="prose prose-invert max-w-none"
              markdown={notes}
              onChange={(markdown: string) => {
                setNotes(markdown);
                // You can add logic here to save notes to localStorage or backend
                localStorage.setItem(`notes-${pageId}`, markdown);
              }}
            />
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  )
}
