'use server'

import prisma from '@/lib/prisma'

export async function addPage(url: string) {
  
  if (!url) {
    throw new Error('URL is required')
  }

  try {
    // Create the page
    const page = await prisma.page.create({
      data: {
        title: url,
        url: url,
        userId: '2f795d09-3e57-4a1c-80a4-a74f0fc4c6ce',
      },
    })

    return { success: true, page }
    
  } catch (error) {
    console.error('Failed to add page:', error)
    return { success: false, error: 'Failed to add page' }
  }
}
