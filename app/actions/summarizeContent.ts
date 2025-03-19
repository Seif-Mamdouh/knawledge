'use server'

import prisma from '@/lib/prisma'
import OpenAI from 'openai'
import { maxDuration } from '../config/serverConfig'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getMaxDuration() {
  return maxDuration;
}

export async function summarizeContent(pageSnapshotId: string) {
  try {
    const snapshot = await prisma.pageSnapShots.findUnique({
      where: { page_snapshot_id: pageSnapshotId },
      include: {
        page: true
      }
    });

    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    const markdown = await prisma.markdown.findUnique({
      where: { markdown_id: snapshot.markdown_id }
    });

    if (!markdown?.content_md) {
      throw new Error('Markdown content not found');
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise summaries of content. Focus on the main points and key takeaways."
        },
        {
          role: "user",
          content: `Please summarize the following content:\n\n${markdown.content_md}`
        }
      ],
      model: "gpt-4o-mini",
    });

    const summary = completion.choices[0].message.content;

    const mdSummary = await prisma.mdSummary.create({
      data: {
        note_id: markdown.markdown_id,
        note_summary_id: snapshot.page_snapshot_id,
        summary: summary || '',
        engine_version: 'gpt-4o-mini'
      }
    });

    return { success: true, summary: mdSummary };

  } catch (error) {
    console.error('Failed to generate summary:', error);
    return { success: false, error: 'Failed to generate summary' };
  }
} 