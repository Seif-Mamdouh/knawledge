"use client"

import { motion } from "framer-motion"
import { FileText, BarChart, Heart, Search, CheckCircle, Shield } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Automatic Summarization",
      description: "Generate concise summaries of lengthy content in seconds, saving you valuable time.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Key Points Extraction",
      description: "Identify and extract the most important information from any content.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Sentiment Analysis",
      description: "Understand the emotional tone and bias of content with advanced sentiment detection.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Topic Identification",
      description: "Automatically categorize content by their main topics and themes.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Readability Metrics",
      description: "Assess the complexity and accessibility of content with detailed metrics.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Source Verification",
      description: "Verify citations and sources to ensure the credibility of information.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">
            Powerful Features for Complete Knowledge Analysis
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our AI-powered platform offers a comprehensive suite of tools to analyze, summarize, and extract insights
            from any content.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-50"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

