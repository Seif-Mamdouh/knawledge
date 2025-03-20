'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LinkInput } from '@/components/Links/LinkInput';

export default function ShortcutRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const url = searchParams.get('url');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add log function
  const addLog = (message: string) => {
    console.log(`SHORTCUT LOG: ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  // Log when component mounts
  useEffect(() => {
    addLog(`Component mounted`);
    addLog(`URL parameter: ${url || 'none'}`);
    addLog(`Auth status: ${status}`);
  }, []);
  
  // Log auth changes
  useEffect(() => {
    addLog(`Auth status changed: ${status}`);
    if (status === "authenticated") {
      addLog(`User authenticated: ${session?.user?.email}`);
    }
  }, [status, session]);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      addLog(`User not authenticated, redirecting to login`);
      // Store the URL in localStorage before redirecting
      if (url) {
        localStorage.setItem('pendingShortcutUrl', url);
        addLog(`Stored URL in localStorage: ${url}`);
      }
      router.push("/auth/signin");
    } else if (status === "authenticated" && url) {
      addLog(`User authenticated and URL present: ${url}`);
    }
  }, [status, url, router]);
  
  const handleAddLink = (url: string, pageId: string) => {
    addLog(`Link added: ${url} with pageId: ${pageId}`);
    router.push(`/summarize/${pageId}`);
  };
  
  // Check for pending URL after login
  useEffect(() => {
    if (status === "authenticated") {
      const pendingUrl = localStorage.getItem('pendingShortcutUrl');
      if (pendingUrl && !url) {
        addLog(`Found pending URL after login: ${pendingUrl}`);
        localStorage.removeItem('pendingShortcutUrl');
        // Use router.replace to update the URL without full navigation
        router.replace(`/summarize/shortcut?url=${encodeURIComponent(pendingUrl)}`);
      }
    }
  }, [status, url, router]);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center pt-6">Summarize from Shortcut</h1>
      {url ? (
        <div className="max-w-xl mx-auto p-4">
          <p className="mb-4">Processing: {url}</p>
          <LinkInput pageId="" onAddLink={handleAddLink} initialUrl={url} />
        </div>
      ) : (
        <p className="text-center mt-8">No URL provided</p>
      )}
      
      {/* Debug section - you can remove this in production */}
      <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
        <div className="bg-white dark:bg-gray-900 p-2 rounded text-xs font-mono h-64 overflow-auto">
          {logs.length > 0 ? (
            logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
          ) : (
            <p>No logs yet</p>
          )}
        </div>
      </div>
    </main>
  );
} 