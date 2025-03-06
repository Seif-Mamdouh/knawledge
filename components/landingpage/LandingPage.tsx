import React from 'react'
import Link from 'next/link'
import Table from '../table'
import { Suspense } from 'react'
import TablePlaceholder from '../table-placeholder'
import ExpandingArrow from '../expanding-arrow'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Knowledge Base
        </h1>
        <p className="mt-4 text-xl sm:text-2xl">
          A simple knowledge management application
        </p>
      </main>
    </div>
  )
} 