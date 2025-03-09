'use server'

import prisma from '@/lib/prisma'
import { fetchPageContent } from '@/app/utils/fetchPageContent'
import { convertToMarkdown } from '@/app/utils/convertToMarkdown'
import { cleanHtml } from '@/app/utils/cleanHtml'
import { summarizeContent } from './summarizeContent'

export async function createPageSnapshot(pageId: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    })

    if (!page?.url) {
      throw new Error('Page not found or URL not available')
    }

    const rawHtml = await fetchPageContent(page.url)
    const cleanedHtml = cleanHtml(rawHtml)

    const markdown = await prisma.markdown.create({
      data: {
        title: page.title,
        content_md: '', 
      }
    })

    const snapshot = await prisma.pageSnapShots.create({
      data: {
        page_id: pageId,
        title: page.title,
        raw_html: rawHtml,
        cleaned_html: cleanedHtml,
        cleaned_at: new Date(),
        markdown_id: markdown.markdown_id,
      }
    })

    
    await convertToMarkdown(snapshot.page_snapshot_id)
    
    await summarizeContent(snapshot.page_snapshot_id)

    return { success: true, snapshot }

  } catch (error) {
    console.error('Failed to create page snapshot:', error)
    return { success: false, error: 'Failed to create page snapshot' }
  }
} 