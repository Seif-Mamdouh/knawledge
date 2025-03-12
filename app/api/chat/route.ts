import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { summarizeContent } from '@/app/actions/summarizeContent';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, pageSnapshotId } = await req.json();

  // Call the summarizeContent server action
  const { success, summary, error } = await summarizeContent(pageSnapshotId);
  
  if (!success) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are a helpful assistant that creates concise summaries of content. Focus on the main points and key takeaways.',
    messages: [
      ...messages,
      { role: 'assistant', content: summary?.summary || '' }
    ],
  });

  return result.toDataStreamResponse();
}