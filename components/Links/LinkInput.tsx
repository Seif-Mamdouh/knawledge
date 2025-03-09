"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addPage } from "@/app/actions/addPage"
import { useRouter } from "next/navigation"
import { LoadingCarousel } from "../Summary/LoadingCarousel"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Link, ArrowRight, Sparkles } from "lucide-react"

interface LinkInputProps {
  pageId: string
  onAddLink?: (url: string) => void
}

export function LinkInput({ pageId, onAddLink }: LinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Validate URL format
  useEffect(() => {
    if (!url) {
      setIsValidUrl(true)
      return
    }
    try {
      new URL(url)
      setIsValidUrl(true)
    } catch {
      setIsValidUrl(false)
    }
  }, [url])

  const handleSubmit = async () => {
    if (!url || !isValidUrl) return

    try {
      setIsLoading(true)
      const result = await addPage(url)

      if (result.success && result.page) {
        setUrl("")
        onAddLink?.(url)
        router.push(`/summarize/${result.page.id}`)
      }
    } catch (error) {
      console.error("Failed to add link:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Analyzing Your Content
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">We're extracting the key insights</p>
          </div>
          <LoadingCarousel />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5">
          <div className="text-center mb-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Knowledge Analyzer</h3>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            >
              Enter a URL to summarize any article or webpage
            </motion.p>
          </div>

          <div className="mt-4 relative">
            <motion.div
              animate={{
                boxShadow: isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "0 0 0 0 rgba(59, 130, 246, 0)",
              }}
              className="flex items-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center justify-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              <Input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/article"
                className="flex-1 border-0 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0"
                disabled={isLoading}
              />

              <AnimatePresence>
                {url && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="pr-2"
                  >
                    <Button onClick={() => setUrl("")} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                      <span className="sr-only">Clear</span>
                      <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                        ✕
                      </motion.span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {!isValidUrl && url && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-xs mt-1 ml-1"
                >
                  Please enter a valid URL (e.g., https://example.com)
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
            <Button
              onClick={handleSubmit}
              disabled={!url || !isValidUrl || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 transition-all duration-200 flex items-center justify-center group"
            >
              <span>Analyze Content</span>
              <motion.div
                animate={{ x: url && isValidUrl ? [0, 4, 0] : 0 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 2, duration: 0.6 }}
                className="ml-2"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <Link className="h-3 w-3 mr-1" />
              Instant AI-powered summaries of any content
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

