'use client'

import { useState, useCallback, useEffect } from 'react'
import Editor, { defaultEditorContent } from '@/components/novel/editor'
import { saveNotesToDB } from '@/components/Chat/Summary/utils/saveNotesToDB'
import { getUserNotes } from '@/app/actions/getUserNotes'
import { Button } from '@/components/ui/button'
import { Loader2, Save, CheckCircle, Image as ImageIcon, MonitorPlay, Share2, Lock } from 'lucide-react'
import { debounce } from 'lodash'
import { generateJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Iframe from '@/components/novel/extensions/iframe-extension'
import type { JSONContent } from 'novel'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface NotesEditorProps {
  pageId: string
  showMarkdownPreview?: boolean
}

export default function NotesEditor({ pageId, showMarkdownPreview = false }: NotesEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [initialContent, setInitialContent] = useState<JSONContent>(defaultEditorContent)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const loadUserNotes = async () => {
      setIsLoading(true)
      try {
        const result = await getUserNotes(pageId)
        if (result.success) {
          setIsOwner(result.isOwner || false)
          
          if (result.content) {
            setContent(result.content)
            
            try {
              const processedHtml = processHtmlForImages(result.content)
              
              const json = generateJSON(processedHtml, [
                StarterKit,
                Image.configure({
                  inline: true,
                  allowBase64: true,
                }),
                Link.configure({
                  openOnClick: false,
                }),
                Iframe
              ])
              setInitialContent(json as JSONContent)
            } catch (err) {
              console.error("Error converting HTML to JSON:", err)
            }
          }
        } else if (!result.success && result.error) {
          setLoadError(result.error)
        }
      } catch (err) {
        console.error("Exception loading notes:", err)
        setLoadError('Failed to load notes')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserNotes()
  }, [pageId])

  const processHtmlForImages = (html: string): string => {    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const images = doc.querySelectorAll('img');
    

    images.forEach(img => {
      
      if (!img.alt) img.alt = 'Image';
      
      
      img.classList.add('novel-image');
      
    });
    
    return new XMLSerializer().serializeToString(doc);
  };

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      await saveNotesToDB(pageId, content, { setIsSaving, setSaveError })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000),
    [pageId]
  )

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    if (!isOwner) return
    
    setContent(newContent)
    debouncedSave(newContent)
  }

  const handleManualSave = async () => {
    if (!isOwner) return // Prevent saving for non-owners
    
    await saveNotesToDB(pageId, content, { setIsSaving, setSaveError })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleShare = () => {
    const shareableUrl = `${window.location.origin}/summarize/${pageId}`
    
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        toast.success('Share link copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
        toast.error('Failed to copy link')
      })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notes...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {loadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{loadError}</p>
        </div>
      )}
      
      {!isOwner && (
        <>
          <div className="text-xl font-bold mb-2 text-left">📝 Viewing as a guest</div>
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            <p>You are viewing this note in read-only mode</p>
          </div>
        </>
      )}
      
      <Editor 
        initialValue={initialContent} 
        onChange={handleContentChange}
        editable={isOwner}
        showTitle={isOwner}
      />
      
      {showMarkdownPreview && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Markdown Preview</h3>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {saveError && (
            <p className="text-red-500 text-sm">{saveError}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          {isOwner && (
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
          )}
        </div>
      </div>
    </div>
  )
} 