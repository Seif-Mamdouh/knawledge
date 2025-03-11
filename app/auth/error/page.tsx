export default function ErrorPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-red-600">Only authorized users can access this application.</p>
      </div>
    )
  }
