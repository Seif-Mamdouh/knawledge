'use server'

import prisma from '@/lib/prisma'
import { createPageSnapshot } from './createPageSnapshot'

async function extractTitle(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1] : url
    
    return title
  } catch (error) {
    console.error('Failed to extract title:', error)
    return url
  }
}

export async function addPage(url: string) {
  if (!url) {
    throw new Error('URL is required')
  }

  try {
    const title = await extractTitle(url)

    const page = await prisma.page.create({
      data: {
        title: title,
        url: url,
        userId: '2f795d09-3e57-4a1c-80a4-a74f0fc4c6ce',
      },
    })

    await createPageSnapshot(page.id)

    return { success: true, page }
    
  } catch (error) {
    console.error('Failed to add page:', error)
    return { success: false, error: 'Failed to add page' }
  }
}
