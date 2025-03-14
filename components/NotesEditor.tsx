'use client'

import { useState, useCallback, useEffect } from 'react'
import Editor, { defaultEditorContent } from '@/components/novel/editor'
import { saveNotesToDB } from '@/components/Chat/Summary/utils/saveNotesToDB'
import { Button } from '@/components/ui/button'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import type { JSONContent } from 'novel'
import { debounce } from 'lodash'

interface NotesEditorProps {
  pageId: string
  initialContent?: JSONContent
}

export default function NotesEditor({ pageId, initialContent }: NotesEditorProps) {
  const [content, setContent] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Debounced save function to avoid too many saves
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      await saveNotesToDB(pageId, content, { setIsSaving, setSaveError })
      setSaveSuccess(true)
      // Reset success indicator after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000),
    [pageId]
  )

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    debouncedSave(newContent)
  }

  // Manual save button handler
  const handleManualSave = async () => {
    await saveNotesToDB(pageId, content, { setIsSaving, setSaveError })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <Editor 
        initialValue={initialContent} 
        onChange={handleContentChange} 
      />
      
      <div className="flex justify-between items-center">
        <div>
          {saveError && (
            <p className="text-red-500 text-sm">{saveError}</p>
          )}
        </div>
        
        <Button 
          onClick={handleManualSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 