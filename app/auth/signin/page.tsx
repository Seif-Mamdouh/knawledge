import SignInButton from '@/components/signInButton'

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignInButton />
    </div>
  )
}
