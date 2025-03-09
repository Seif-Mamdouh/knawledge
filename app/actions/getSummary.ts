'use server'

import prisma from '@/lib/prisma'

export async function getSummary(pageId: string) {
  try {
    const latestSnapshot = await prisma.pageSnapShots.findFirst({
      where: { page_id: pageId },
      orderBy: { fetched_at: 'desc' },
      include: { page: true }
    })

    if (!latestSnapshot) {
      return { success: false, error: 'No snapshot found' }
    }

    const summary = await prisma.mdSummary.findFirst({
      where: { 
        note_summary_id: latestSnapshot.page_snapshot_id 
      },
      orderBy: { engine_version: 'desc' }
    })

    return { 
      success: true, 
      summary: summary?.summary || '',
      title: latestSnapshot.title
    }

  } catch (error) {
    console.error('Failed to fetch summary:', error)
    return { success: false, error: 'Failed to fetch summary' }
  }
} 