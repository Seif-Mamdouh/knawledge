'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { LinkInput } from '@/components/Links/LinkInput';
import { addAnonymousPage } from '@/app/actions/addAnonymousPage';

// Add this console log to check if the file is loaded at all
console.log('SHORTCUT FILE LOADED');

export default function ShortcutRedirectPage() {
  // Add this console log to check if the component is rendered at all
  console.log('SHORTCUT COMPONENT RENDERING');

  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const url = searchParams.get('url');
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add log function
  const addLog = useCallback((message: string) => {
    const logMessage = `${new Date().toISOString()}: ${message}`;
    console.log(`SHORTCUT LOG: ${message}`);
    setLogs(prev => [...prev, logMessage]);
    
    // For debugging purposes, also log to localStorage
    const previousLogs = JSON.parse(localStorage.getItem('shortcutLogs') || '[]');
    localStorage.setItem('shortcutLogs', JSON.stringify([...previousLogs, logMessage]));
  }, []);
  
  useEffect(() => {
    // Clear localStorage logs when component mounts
    localStorage.setItem('shortcutLogs', '[]');
    addLog(`INITIAL RENDER - Component mounted`);
    addLog(`URL parameter: ${url || 'none'}`);
    addLog(`Auth status: ${status}`);
    
    return () => {
      addLog('Component unmounting');
    };
  }, [addLog]);
  
  // Handle URL processing for anonymous users
  useEffect(() => {
    addLog(`Effect triggered - URL: ${url || 'none'}, Status: ${status}, isProcessing: ${isProcessing}`);
    
    if (!url) {
      addLog('No URL provided, skipping processing');
      return;
    }
    
    if (isProcessing) {
      addLog('Already processing, skipping');
      return;
    }
    
    if (status === 'loading') {
      addLog('Auth status is loading, waiting...');
      return;
    }
    
    addLog(`Ready to process with status: ${status}`);
    
    if (status === 'unauthenticated') {
      addLog('User is not authenticated, processing anonymously');
      setIsProcessing(true);
      
      // Add a timeout to make sure state update happens
      setTimeout(() => {
        processAnonymously(url);
      }, 100);
    }
  }, [url, status, isProcessing, addLog]);
  
  // Process URL anonymously
  const processAnonymously = async (currentUrl: string) => {
    addLog(`ANONYMOUS PROCESSING - Starting for URL: ${currentUrl}`);
    
    try {
      addLog('About to call addAnonymousPage server action');
      
      const startTime = Date.now();
      const result = await addAnonymousPage(currentUrl);
      const endTime = Date.now();
      
      addLog(`Server action completed in ${endTime - startTime}ms`);
      addLog(`Server action result: ${JSON.stringify(result)}`);
      
      if (result.success && result.page) {
        addLog(`SUCCESS - Page created with ID: ${result.page.id}`);
        
        // Store the result in localStorage for debugging
        localStorage.setItem('lastAnonymousPageResult', JSON.stringify(result));
        
        // Small delay to ensure logs are visible
        setTimeout(() => {
          addLog(`Redirecting to /summarize/${result.page.id}`);
          router.push(`/summarize/${result.page.id}`);
        }, 500);
      } else {
        addLog(`FAILURE - Could not create page: ${JSON.stringify(result)}`);
        setIsProcessing(false);
      }
    } catch (error) {
      const errorStr = error instanceof Error ? 
        `${error.name}: ${error.message}` : 
        String(error);
      
      addLog(`ERROR - Exception during processing: ${errorStr}`);
      console.error('Full error object:', error);
      
      // Store error in localStorage for debugging
      localStorage.setItem('lastAnonymousPageError', errorStr);
      
      setIsProcessing(false);
    }
  };
  
  // Add a manual trigger button
  const handleManualTrigger = () => {
    if (!url) {
      addLog('Cannot manually process: No URL provided');
      return;
    }
    
    if (isProcessing) {
      addLog('Already processing, ignoring manual trigger');
      return;
    }
    
    addLog('Manual processing triggered');
    setIsProcessing(true);
    processAnonymously(url);
  };
  
  // Add a way to clear processing state for debugging
  const handleResetProcessing = () => {
    addLog('Manually resetting processing state');
    setIsProcessing(false);
  };
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-center pt-6">Summarize from Shortcut</h1>
      
      <div className="max-w-xl mx-auto p-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Current State:</h2>
          <p><strong>URL:</strong> {url || 'None'}</p>
          <p><strong>Auth Status:</strong> {status}</p>
          <p><strong>Processing:</strong> {isProcessing ? 'Yes' : 'No'}</p>
        </div>
        
        {url ? (
          <div className="border p-4 rounded-lg mb-6">
            <p className="mb-4 font-medium">Processing: {url}</p>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center my-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Creating anonymous summary...</p>
                <button 
                  onClick={handleResetProcessing}
                  className="mt-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Reset Processing State
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleManualTrigger}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Process Anonymously
                </button>
                <button 
                  onClick={() => router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/summarize/shortcut?url=${encodeURIComponent(url)}`)}`)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Sign In Instead
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
      </div>
      
      {/* Debug section */}
      <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
        <div className="bg-white dark:bg-gray-900 p-2 rounded text-xs font-mono h-64 overflow-auto">
          {logs.length > 0 ? (
            logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
          ) : (
            <p>No logs yet</p>
          )}
        </div>
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => localStorage.setItem('shortcutLogs', '[]')}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            Clear Logs
          </button>
          <button 
            onClick={() => {
              const allLogs = JSON.parse(localStorage.getItem('shortcutLogs') || '[]');
              console.log('All logs:', allLogs);
              alert(`${allLogs.length} logs saved to console`);
            }}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Console All Logs
          </button>
        </div>
      </div>
    </main>
  );
} 