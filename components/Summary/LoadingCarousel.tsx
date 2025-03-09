"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
  "Preparing your insights... 💡",
]

export function LoadingCarousel() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current === loadingMessages.length - 1 ? 0 : current + 1))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-xl font-semibold text-blue-500">Analyzing Your Content</h3>
        <p className="text-gray-500 dark:text-gray-400">We&apos;re extracting the key insights</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-gray-700/90 rounded-xl p-8"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-8 h-8">
              <motion.div
                className="absolute w-full h-full border-4 border-blue-500 rounded-full"
                style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
          </div>

          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[28px] flex items-center justify-center"
          >
            <p className="text-gray-200">{loadingMessages[messageIndex]}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

