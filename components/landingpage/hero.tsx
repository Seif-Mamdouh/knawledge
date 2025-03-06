"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Search, CheckCircle } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
              AI-Powered <span className="text-blue-600">Knowledge Analysis</span> & Summarization
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Extract key insights, generate concise summaries, and analyze sentiment from any content with our advanced
              AI technology.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg">
                Try for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Instant results</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-100 rounded-md px-3 py-1 text-xs text-gray-500">knowledge-analyzer.ai</div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-800 font-medium mb-2">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Knowledge Analysis
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full w-full mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-5/6 mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-800 font-medium mb-2">
                    <Search className="h-5 w-5 mr-2 text-blue-600" />
                    Key Points
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-blue-600 mr-2"></div>
                      <div className="h-2 bg-blue-200 rounded-full w-full"></div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-blue-600 mr-2"></div>
                      <div className="h-2 bg-blue-200 rounded-full w-5/6"></div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-blue-600 mr-2"></div>
                      <div className="h-2 bg-blue-200 rounded-full w-4/6"></div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-800 font-medium mb-2">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Summary
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full w-full mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-5/6 mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

