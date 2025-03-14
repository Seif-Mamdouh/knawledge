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
        success: false, 
        error: `No snapshot found for page ${pageId}`,
        content: null
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
        success: false, 
        error: `No summary found for page ${pageId}`,
        content: null
      }
    }
    
    const summaryId = summary.note_id;
    
    const userNote = await prisma.userNotes.findUnique({
      where: {
        userId_pageId: {
          userId,
          pageId: summaryId
        }
      }
    });
    
    if (!userNote) {
      return { 
        success: true, 
        content: null 
      }
    }
    
    return { 
      success: true, 
      content: userNote.content 
    }
  } catch (error) {
    console.error("Failed to get user notes:", error)
    return { 
      success: false, 
      error: `Failed to get notes: ${error instanceof Error ? error.message : String(error)}`,
      content: null
    }
  }
} 