'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from "next/cache"

export async function saveUserNotes(pageId: string, content: string) {
  try {
    // Use a valid user ID from your Users table
    const userId = "2f795d09-3e57-4a1c-80a4-a74f0fc4c6ce"
    
    // First, get the latest snapshot for this page
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
        error: `Cannot save notes: No summary found for page ${pageId}` 
      }
    }
    
    const summaryId = summary.note_id;
    console.log(`Using summary ID: ${summaryId} for notes`);
    
    // Try direct SQL approach if Prisma model access is failing
    // This is a workaround if the Prisma client is having issues with the model
    const result = await prisma.$executeRaw`
      INSERT INTO "UserNotes" ("id", "content", "pageId", "userId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${content}, ${summaryId}, ${userId}, NOW(), NOW())
      ON CONFLICT ("userId", "pageId") 
      DO UPDATE SET "content" = ${content}, "updatedAt" = NOW()
    `;
    
    console.log("Notes saved successfully:", result);
    
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