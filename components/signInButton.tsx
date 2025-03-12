'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    router.push('/summarize')
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign in with GitHub
    </button>
  )
}
