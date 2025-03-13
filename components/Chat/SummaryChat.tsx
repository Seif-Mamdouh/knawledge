"use client";

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { renderSummaryContent } from '@/components/Summary/utils/renderSummaryContent';
import { getSummary } from '@/app/actions/getSummary';

interface SummaryChatProps {
  pageId: string;
}

export function SummaryChat({ pageId }: SummaryChatProps) {
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    initialMessages: [],
    id: `summary-chat-${pageId}`,
    body: {
      pageId,
    },
  });

  // Load the summary and add it to the chat
  useEffect(() => {
    const loadSummary = async () => {
      if (summaryLoaded) return;
      
      try {
        const result = await getSummary(pageId);
        
        if (result.success && result.summary) {
          // Add the summary to the chat
          append({
            role: 'assistant',
            content: `# ${result.title || 'Summary'}\n\n${result.summary}`
          });
          
          setSummaryLoaded(true);
        }
      } catch (error) {
        console.error("Error loading summary:", error);
      }
    };
    
    loadSummary();
  }, [pageId, append, summaryLoaded]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Chat with this content</h2>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-50 dark:bg-blue-900/20 ml-auto max-w-[80%]' 
                : 'bg-gray-50 dark:bg-gray-800 mr-auto max-w-[80%]'
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
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
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
    </div>
  );
} 