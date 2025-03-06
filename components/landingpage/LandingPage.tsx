import React from 'react'
import Navbar from './navbar'
import Hero from './hero'
import Features from './features'
import HowItWorks from './how-it-works'
import Demo from './demo'
import Footer from './footer'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Demo />
      </main>
      <Footer />
    </div>
  )
} 