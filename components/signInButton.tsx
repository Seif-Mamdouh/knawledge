'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign out
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn('github', { callbackUrl: '/admin' })}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign in with GitHub
    </button>
  )
}
