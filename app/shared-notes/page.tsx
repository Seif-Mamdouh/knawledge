'use client'

import { useEffect, useState } from 'react'

export default function SharedNotesPage() {
  const [content, setContent] = useState<string>('')
  
  useEffect(() => {
    // Get content from URL hash
    const hashContent = window.location.hash.substring(1)
    if (hashContent) {
      try {
        const decodedContent = decodeURIComponent(hashContent)
        setContent(decodedContent)
      } catch (err) {
        console.error('Failed to decode content:', err)
      }
    }
  }, [])
  
  if (!content) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Shared Notes</h1>
          <p>No content found. The link may be invalid.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Shared Notes</h1>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
} 