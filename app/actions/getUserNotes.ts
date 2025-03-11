'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function getUserNotes(pageId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }
    const userId = session.user.id
    
    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    })
    
    if (!user) {
      return { 
        success: false, 
        error: `Cannot get notes: User with ID ${userId} not found` 
      }
    }
    
    // First, get the latest snapshot for this page
    const latestSnapshot = await prisma.pageSnapShots.findFirst({
      where: { page_id: pageId },
      orderBy: { fetched_at: 'desc' }
    });
    
    if (!latestSnapshot) {
      return { 
        success: true, 
        notes: 'Start taking notes here...' 
      }
    }
    
    // Find the summary using the page snapshot ID
    const summary = await prisma.mdSummary.findFirst({
      where: { 
        note_summary_id: latestSnapshot.page_snapshot_id 
      },
      orderBy: { engine_version: 'desc' }
    });
    
    if (!summary) {
      return { 
        success: true, 
        notes: 'Start taking notes here...' 
      }
    }
    
    const summaryId = summary.note_id;
    
    const userNotes = await prisma.userNotes.findUnique({
      where: {
        userId_pageId: {
          userId,
          pageId: summaryId
        }
      },
      select: {
        content: true
      }
    })
    
    return { 
      success: true, 
      notes: userNotes?.content || 'Start taking notes here...'
    }
  } catch (error) {
    console.error("Failed to fetch notes:", error)
    return { 
      success: false, 
      error: `Failed to fetch notes: ${error instanceof Error ? error.message : String(error)}` 
    }
  }
} 