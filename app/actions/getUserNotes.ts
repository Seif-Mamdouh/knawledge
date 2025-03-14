'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function getUserNotes(pageId: string) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    
    // Get the latest snapshot regardless of user authentication
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
    
    // If user is authenticated, get their personal notes
    if (userId) {
      const user = await prisma.users.findUnique({
        where: { id: userId }
      })
      
      if (!user) {
        return { 
          success: false, 
          error: `Cannot get notes: User with ID ${userId} not found` 
        }
      }
      
      const userNote = await prisma.userNotes.findUnique({
        where: {
          userId_pageId: {
            userId,
            pageId: summaryId
          }
        }
      });
      
      if (userNote) {
        return { 
          success: true, 
          content: userNote.content,
          isOwner: true
        }
      }
    }
    
    // For anonymous users or if authenticated user has no notes,
    // return the default content or empty content
    
    // Find any user's notes for this page to share with anonymous users
    const anyUserNote = await prisma.userNotes.findFirst({
      where: {
        pageId: summaryId
      }
    });
    
    return { 
      success: true, 
      content: anyUserNote?.content || '<div><p>No content has been added to this note yet.</p></div>',
      isOwner: false
    }
  } catch (error) {
    console.error("Failed to get user notes:", error)
    return { 
      success: false, 
      error: `Failed to get notes: ${error instanceof Error ? error.message : String(error)}`,
      content: '<div><p>Error loading content.</p></div>',
      isOwner: false
    }
  }
} 