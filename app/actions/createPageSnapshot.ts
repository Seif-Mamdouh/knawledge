'use server'

import prisma from '@/lib/prisma'
import TurndownService from 'turndown'


async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return html
  } catch (error) {
    console.error('Failed to fetch page content:', error)
    throw new Error('Failed to fetch page content')
  }
}

function cleanHtml(rawHtml: string): string {
  try {
    let cleanedHtml = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<img[^>]*(?:width|height)="?[0-2][^"]*"?[^>]*>/gi, '')
      .replace(/<div[^>]*(?:ad-|ads-|advertisement)[^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<p>\s*<\/p>/gi, '')
      .replace(/(\r\n|\n|\r){2,}/gm, '\n')
      .trim()

    return cleanedHtml
  } catch (error) {
    console.error('Failed to clean HTML:', error)
    throw new Error('Failed to clean HTML')
  }
}

async function convertToMarkdown(pageSnapshotId: string) {
  try {
    const snapshot = await prisma.pageSnapShots.findUnique({
      where: { page_snapshot_id: pageSnapshotId }
    })

    if (!snapshot?.cleaned_html) {
      throw new Error('No cleaned HTML found')
    }

    
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
    
    const markdown = turndownService.turndown(snapshot.cleaned_html)

    
    await prisma.markdown.update({
      where: { markdown_id: snapshot.markdown_id },
      data: {
        title: snapshot.title,
        content_md: markdown,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to convert to markdown:', error)
    return { success: false, error: 'Failed to convert to markdown' }
  }
}

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
        content_md: '', // Initially empty
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

    // Convert to markdown and update the markdown table
    await convertToMarkdown(snapshot.page_snapshot_id)

    return { success: true, snapshot }

  } catch (error) {
    console.error('Failed to create page snapshot:', error)
    return { success: false, error: 'Failed to create page snapshot' }
  }
} 