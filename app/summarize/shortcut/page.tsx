'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { LinkInput } from '@/components/Links/LinkInput';
import { addAnonymousPage } from '@/app/actions/addAnonymousPage';



export default function ShortcutRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const url = searchParams.get('url');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  
  const processAnonymously = async (currentUrl: string) => {
    
    try {
      const startTime = Date.now();
      const result = await addAnonymousPage(currentUrl);
      const endTime = Date.now();
      
      
      if (result.success && result.page) {
        
        // Store the result in localStorage for debugging
        localStorage.setItem('lastAnonymousPageResult', JSON.stringify(result));
        
        // Small delay to ensure logs are visible
        setTimeout(() => {
          router.push(`/summarize/${result.page.id}`);
        }, 500);
      } else {
        
        setIsProcessing(false);
      }
    } catch (error) {
      const errorStr = error instanceof Error ? 
        `${error.name}: ${error.message}` : 
        String(error);
      
      console.error('Full error object:', error);
      
      localStorage.setItem('lastAnonymousPageError', errorStr);
      
      setIsProcessing(false);
    }
  };
  
  const handleManualTrigger = () => {
    if (!url) {
      return;
    }
    
    if (isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    processAnonymously(url);
  };
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center pt-6">Summarize from Shortcut</h1>
        
        {url ? (
          <div className="border p-4 rounded-lg mb-6">
            <p className="mb-4 font-medium">Processing: {url}</p>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center my-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Creating anonymous summary...</p>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleManualTrigger}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Process Anonymously
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg">No URL provided</p>
            <p className="text-sm text-gray-500 mt-2">Add a ?url=https://example.com parameter to the URL</p>
          </div>
        )}
    </main>
  );
} 