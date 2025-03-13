"use client";

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { renderSummaryContent, renderMessageContent } from '@/components/Chat/Summary/utils';
import { getSummary } from '@/app/actions/getSummary';
import { Loader2 } from 'lucide-react';

interface SummaryChatProps {
  pageId: string;
}

export function SummaryChat({ pageId }: SummaryChatProps) {
  // Track if summary has been requested to prevent duplicate requests
  const [summaryRequested, setSummaryRequested] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [summaryData, setSummaryData] = useState<{ title: string; summary: string } | null>(null);
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'processing' | 'formatting' | 'complete' | null>(null);
  
  // Reference to the messages container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to track if summary has been added to chat
  const summaryAddedToChat = useRef(false);
  
  const { messages, input, handleInputChange, handleSubmit, append, setMessages } = useChat({
    initialMessages: [],
    id: `summary-chat-${pageId}`,
    body: {
      pageId,
    },
  });

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Clear any existing summary messages when component mounts or pageId changes
  useEffect(() => {
    // Reset state when pageId changes
    setSummaryRequested(false);
    setSummaryLoaded(false);
    setSummaryData(null);
    setLoadingStage(null);
    summaryAddedToChat.current = false;
    
    // Clear any existing messages
    setMessages([]);
  }, [pageId, setMessages]);

  useEffect(() => {
    if (summaryRequested || summaryLoaded) return;
    
    const loadSummary = async () => {
      setSummaryRequested(true);
      
      try {
        setLoadingStage('fetching');
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoadingStage('processing');
        const result = await getSummary(pageId);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        if (result.success && result.summary) {
          setLoadingStage('formatting');
          await new Promise(resolve => setTimeout(resolve, 600)); 
          
          setSummaryData({
            title: result.title || 'Summary',
            summary: result.summary
          });
          
          setLoadingStage('complete');
          
          if (!summaryAddedToChat.current) {
            setTimeout(() => {
              summaryAddedToChat.current = true;
              
              
              setMessages([]);
              
              append({
                role: 'assistant',
                content: `# ${result.title || 'Summary'}\n\n${result.summary}`
              });
              
              setSummaryLoaded(true);
            }, 500);
          }
        } else {
          console.error("Failed to get summary:", result);
          setSummaryRequested(false); // Allow retry
        }
      } catch (error) {
        console.error("Error loading summary:", error);
        setLoadingStage(null);
        setSummaryRequested(false); // Allow retry
      }
    };
    
    loadSummary();
  }, [pageId, append, summaryLoaded, summaryRequested, setMessages]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    handleSubmit(e);
    
    const inputElement = (e.currentTarget as HTMLFormElement).querySelector('input');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Summary Analysis</h2>
      
      {loadingStage && !summaryLoaded && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                loadingStage === 'fetching' ? 'bg-blue-500 animate-pulse' : 
                loadingStage === 'processing' || loadingStage === 'formatting' || loadingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {loadingStage === 'fetching' ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : '✓'}
              </div>
              <div className="font-medium">Fetching content</div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                loadingStage === 'processing' ? 'bg-blue-500 animate-pulse' : 
                loadingStage === 'formatting' || loadingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {loadingStage === 'processing' ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : 
                 loadingStage === 'formatting' || loadingStage === 'complete' ? '✓' : ''}
              </div>
              <div className="font-medium">Processing with AI</div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                loadingStage === 'formatting' ? 'bg-blue-500 animate-pulse' : 
                loadingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {loadingStage === 'formatting' ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : 
                 loadingStage === 'complete' ? '✓' : ''}
              </div>
              <div className="font-medium">Formatting summary</div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                loadingStage === 'complete' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`}>
                {loadingStage === 'complete' ? '✓' : ''}
              </div>
              <div className="font-medium">Summary ready</div>
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={messagesContainerRef}
        className="space-y-4 max-h-[500px] overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 && !loadingStage && (
          <div className="text-center text-gray-500 py-8">
            Loading summary...
          </div>
        )}
        
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900/30 ml-auto max-w-[80%]' 
                : 'bg-white dark:bg-gray-700 mr-auto max-w-[80%]'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'AI Assistant'}
            </div>
            <div className="text-black dark:text-white text-lg">
              {message.role === 'assistant' && message.content.includes('# ') 
                ? renderSummaryContent({
                    title: message.content.split('\n')[0].replace('# ', ''),
                    summary: message.content.split('\n').slice(2).join('\n')
                  })
                : renderMessageContent(message.content)}
            </div>
          </div>
        ))}
      
        <div ref={messagesEndRef} />
      </div>
      
      {summaryLoaded && (
        <form 
          onSubmit={handleMessageSubmit}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about this content..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
} 