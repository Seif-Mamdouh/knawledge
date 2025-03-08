'use server'

import prisma from '@/lib/prisma'

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

export async function createPageSnapshot(pageId: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId }
    })

    if (!page?.url) {
      throw new Error('Page not found or URL not available')
    }

    const rawHtml = await fetchPageContent(page.url)

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
        markdown_id: markdown.markdown_id,
      }
    })

    return { success: true, snapshot }

  } catch (error) {
    console.error('Failed to create page snapshot:', error)
    return { success: false, error: 'Failed to create page snapshot' }
  }
} 