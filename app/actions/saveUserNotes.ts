'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from "next/cache"

export async function saveUserNotes(pageId: string, content: string) {
  try {
    // Use a valid user ID from your Users table
    const userId = "2f795d09-3e57-4a1c-80a4-a74f0fc4c6ce"
    
    const latestSnapshot = await prisma.pageSnapShots.findFirst({
      where: { page_id: pageId },
      orderBy: { fetched_at: 'desc' }
    });
    
    if (!latestSnapshot) {
      return { 
        success: false, 
        error: `Cannot save notes: No snapshot found for page ${pageId}` 
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
        error: `Cannot save notes: No summary found for page ${pageId}` 
      }
    }
    
    const summaryId = summary.note_id;
    console.log(`Using summary ID: ${summaryId} for notes`);
    
    
    try {
      
      const existingNote = await prisma.userNotes.findUnique({
        where: {
          userId_pageId: {
            userId,
            pageId: summaryId
          }
        }
      });
      
      if (existingNote) {
        // Update existing note
        await prisma.userNotes.update({
          where: {
            id: existingNote.id
          },
          data: {
            content,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new note
        await prisma.userNotes.create({
          data: {
            userId,
            pageId: summaryId,
            content
          }
        });
      }
      
      console.log("Notes saved successfully");
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return { 
        success: false, 
        error: `Database operation failed: ${dbError instanceof Error ? dbError.message : String(dbError)}` 
      }
    }
    
    revalidatePath(`/summary/${pageId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Failed to save notes:", error)
    // Return more detailed error information
    return { 
      success: false, 
      error: `Failed to save notes: ${error instanceof Error ? error.message : String(error)}` 
    }
  }
} 