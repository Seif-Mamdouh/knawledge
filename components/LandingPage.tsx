import React from 'react'
import Link from 'next/link'
import Table from './table'
import { Suspense } from 'react'
import TablePlaceholder from './table-placeholder'
import ExpandingArrow from './expanding-arrow'

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
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/api/seed"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Seed Database
            <ExpandingArrow />
          </Link>
        </div>
        
        <div className="mt-12 w-full max-w-4xl">
          <Suspense fallback={<TablePlaceholder />}>
            <Table />
          </Suspense>
        </div>
      </main>
    </div>
  )
} 