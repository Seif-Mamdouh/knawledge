"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, LinkIcon, Upload } from "lucide-react"

export default function Demo() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleAnalyze = () => {
    if (!url) return

    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <section id="demo" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">Try It Yourself</h2>
          <p className="mt-4 text-lg text-blue-700">
            Experience the power of our AI knowledge analyzer with a free demo.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-6 sm:p-8">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="url" className="text-sm sm:text-base">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="text-sm sm:text-base">
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-sm sm:text-base">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="url"
                    placeholder="Enter content URL (e.g., https://example.com/article)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={!url || isAnalyzing}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>

                {showResults && (
                  <motion.div
                    className="mt-8 space-y-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="border-t border-blue-100 pt-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">Summary</h3>
                      <p className="text-blue-700">
                        This content discusses the impact of artificial intelligence on modern business operations. It
                        highlights how AI technologies are transforming various industries through automation, data
                        analysis, and predictive capabilities. The author emphasizes the importance of ethical
                        considerations and human oversight in AI implementation.
                      </p>
                    </div>

                    <div className="border-t border-blue-100 pt-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">Key Points</h3>
                      <ul className="space-y-2 text-blue-700">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <span>
                            AI adoption is accelerating across industries, with 64% of companies reporting increased
                            productivity.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                            <span className="text-xs font-bold">2</span>
                          </div>
                          <span>
                            Machine learning algorithms can analyze customer data to predict future purchasing
                            behaviors.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                            <span className="text-xs font-bold">3</span>
                          </div>
                          <span>
                            Ethical considerations and transparency are crucial for responsible AI implementation.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-blue-100 pt-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">Sentiment Analysis</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-blue-700">Overall Sentiment:</span>
                          <span className="font-medium text-blue-600">Positive</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-blue-500 mt-1">
                          <span>Negative</span>
                          <span>Neutral</span>
                          <span>Positive</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="text">
                <div className="text-center py-8">
                  <p className="text-blue-700">Paste your content text here to analyze.</p>
                  <p className="text-sm text-blue-500 mt-2">(Feature available in full version)</p>
                </div>
              </TabsContent>

              <TabsContent value="upload">
                <div className="text-center py-8">
                  <p className="text-blue-700">Upload a document to analyze.</p>
                  <p className="text-sm text-blue-500 mt-2">(Feature available in full version)</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

