'use client'

import { useEffect, useState } from 'react'
import { Card } from '../ui/card'

const loadingMessages = [
  "Extracting knowledge from the webpage... 📚",
  "Processing the content... 🔄",
  "Analyzing the key points... 🤔",
  "Distilling the wisdom... ✨",
  "Almost there, crafting your summary... ⚡",
  "Teaching AI new things... 🧠",
  "Can't wait to share what I learned... 📖",
  "Making sense of everything... 🎯",
  "Connecting the dots... 🔍",
  "Preparing your insights... 💡"
]

export function LoadingCarousel() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => 
        current === loadingMessages.length - 1 ? 0 : current + 1
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-4 mt-4 bg-black/50 border-gray-800">
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full mb-4" />
          <div className="text-gray-300 animate-fade-in">
            {loadingMessages[messageIndex]}
          </div>
        </div>
      </div>
    </Card>
  )
} 