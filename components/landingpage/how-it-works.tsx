"use client"

import { motion } from "framer-motion"
import { FileText, Cpu, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Upload Your Content",
      description: "Paste a URL, upload a document, or input text directly into our platform.",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "AI Processing",
      description: "Our advanced AI models analyze the content using natural language processing techniques.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Get Insights",
      description: "Receive a comprehensive analysis with summaries, key points, and detailed metrics.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">How It Works</h2>
          <p className="mt-4 text-lg text-blue-700">
            Our simple three-step process makes knowledge analysis quick and effortless.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-100 -translate-y-1/2 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-blue-50 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white mx-auto mb-6"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {step.icon}
                </motion.div>
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">{step.title}</h3>
                <p className="text-blue-700">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

