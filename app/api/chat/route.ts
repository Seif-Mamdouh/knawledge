import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getSummary } from '@/app/actions/getSummary';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, pageId } = await req.json();
  
  let systemPrompt = 'You are a helpful assistant that answers questions clearly and concisely.';
  
  if (pageId) {
    try {
      const summaryResult = await getSummary(pageId);
      
      if (summaryResult.success && summaryResult.summary) {
        systemPrompt = `You are a helpful assistant discussing the following content:
Title: ${summaryResult.title}
Summary: ${summaryResult.summary}

Answer questions based on this content. If you don't know the answer based on the provided content, say so.`;
      }
    } catch (error) {
      console.error("Error fetching summary for context:", error);
    }
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}