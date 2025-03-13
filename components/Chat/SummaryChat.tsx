"use client";

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';
import { renderSummaryContent } from '@/components/Summary/utils/renderSummaryContent';
import { getSummary } from '@/app/actions/getSummary';
import { Loader2 } from 'lucide-react';

interface SummaryChatProps {
  pageId: string;
}

export function SummaryChat({ pageId }: SummaryChatProps) {
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [summaryData, setSummaryData] = useState<{ title: string; summary: string } | null>(null);
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'processing' | 'formatting' | 'complete' | null>(null);
  
  // Reference to the messages container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    initialMessages: [],
    id: `summary-chat-${pageId}`,
    body: {
      pageId,
    },
  });

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load the summary and show the loading stages
  useEffect(() => {
    const loadSummary = async () => {
      if (summaryLoaded) return;
      
      try {
        // Stage 1: Fetching
        setLoadingStage('fetching');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        // Stage 2: Processing
        setLoadingStage('processing');
        const result = await getSummary(pageId);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        
        if (result.success && result.summary) {
          // Stage 3: Formatting
          setLoadingStage('formatting');
          await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
          
          // Set the summary data
          setSummaryData({
            title: result.title || 'Summary',
            summary: result.summary
          });
          
          // Stage 4: Complete
          setLoadingStage('complete');
          
          // Add the summary to the chat after a short delay
          setTimeout(() => {
            append({
              role: 'assistant',
              content: `# ${result.title || 'Summary'}\n\n${result.summary}`
            });
            
            setSummaryLoaded(true);
          }, 500);
        }
      } catch (error) {
        console.error("Error loading summary:", error);
        setLoadingStage(null);
      }
    };
    
    loadSummary();
  }, [pageId, append, summaryLoaded]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Summary Analysis</h2>
      
      {/* Loading stages visualization */}
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
      
      {/* Messages display with auto-scroll */}
      <div 
        ref={messagesContainerRef}
        className="space-y-4 max-h-[500px] overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
        style={{ scrollBehavior: 'smooth' }}
      >
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
            <div className="prose dark:prose-invert">
              {message.role === 'assistant' && message.content.includes('# ') 
                ? renderSummaryContent({
                    title: message.content.split('\n')[0].replace('# ', ''),
                    summary: message.content.split('\n').slice(2).join('\n')
                  })
                : message.content}
            </div>
          </div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      {summaryLoaded && (
        <form 
          onSubmit={(e) => {
            handleSubmit(e);
            // Focus back on input after submission
            const inputElement = e.currentTarget.querySelector('input');
            if (inputElement) {
              setTimeout(() => {
                inputElement.focus();
              }, 0);
            }
          }} 
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