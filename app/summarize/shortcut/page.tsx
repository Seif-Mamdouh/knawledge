'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { addAnonymousPage } from '@/app/actions/addAnonymousPage';



export default function ShortcutRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (url && !isProcessing) {
      setIsProcessing(true);
      processAnonymously(url);
    }
  }, [url]);
  
  const processAnonymously = async (currentUrl: string) => {
    
    try {
      const result = await addAnonymousPage(currentUrl);
      
      if (result.success && result.page) {
        localStorage.setItem('lastAnonymousPageResult', JSON.stringify(result));
        router.push(`/summarize/${result.page.id}`);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      const errorStr = error instanceof Error ? 
        `${error.name}: ${error.message}` : 
        String(error);
      
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
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-2xl font-bold text-center mb-6">Summarize from Shortcut</h1>
          
          {url ? (
            <div className="border p-4 rounded-lg mb-6">
              <p className="mb-4 font-medium">Processing: {url}</p>
              
              <div className="flex flex-col items-center justify-center my-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Creating anonymous summary...</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-lg">No URL provided</p>
              <p className="text-sm text-gray-500 mt-2">Add a ?url=https://example.com parameter to the URL</p>
            </div>
          )}
      </div>
    </main>
  );
} 