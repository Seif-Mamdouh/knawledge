'use server'

import prisma from '@/lib/prisma'

export async function getSummary(pageId: string) {
  try {
    const snapshot = await prisma.pageSnapShots.findUnique({
      where: { page_snapshot_id: pageId },
      include: { page: true }
    })

    if (!snapshot) {
      return { success: false, error: 'No snapshot found' }
    }

    const summary = await prisma.mdSummary.findFirst({
      where: { 
        note_summary_id: snapshot.page_snapshot_id 
      },
      orderBy: { engine_version: 'desc' }
    })

    return { 
      success: true, 
      summary: summary?.summary || '',
      title: snapshot.title
    }

  } catch (error) {
    console.error('Failed to fetch summary:', error)
    return { success: false, error: 'Failed to fetch summary' }
  }
} 