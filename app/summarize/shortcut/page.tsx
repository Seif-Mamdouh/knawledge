'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LinkInput } from '@/components/Links/LinkInput';

export default function ShortcutRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const url = searchParams.get('url');
  
  useEffect(() => {
    if (status === "unauthenticated") {
      // Store the URL in localStorage before redirecting
      if (url) localStorage.setItem('pendingShortcutUrl', url);
      router.push("/auth/signin");
    }
  }, [status, url, router]);
  
  const handleAddLink = (url: string, pageId: string) => {
    router.push(`/summarize/${pageId}`);
  };
  
  // Auto-submit the URL if it exists and user is authenticated
  useEffect(() => {
    if (url && status === "authenticated" && document) {
      // Find your LinkInput's submit function and call it with the URL
      // This is a simplified example - you'll need to adapt to your component
      const submitButton = document.querySelector('.link-input-submit-button');
      if (submitButton) {
        // Set the input value
        const input = document.querySelector('.link-input') as HTMLInputElement;
        if (input) {
          input.value = url;
          // Trigger submit
          (submitButton as HTMLButtonElement).click();
        }
      }
    }
  }, [url, status]);
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center pt-6">Summarize from Shortcut</h1>
      {url ? (
        <div className="max-w-xl mx-auto p-4">
          <p className="mb-4">Processing: {url}</p>
          <LinkInput pageId="" onAddLink={handleAddLink} />
        </div>
      ) : (
        <p className="text-center mt-8">No URL provided</p>
      )}
    </main>
  );
} 