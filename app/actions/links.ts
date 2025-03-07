"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addLinkToPage(url: string, pageId: number) {
  try {
    // Validate the URL
    if (!url || !url.trim()) {
      return { success: false, error: "URL cannot be empty" };
    }
    
    // Validate that the page exists and belongs to the user
    const pageExists = await prisma.page.findFirst({
      where: {
        id: pageId,
      },
    });
    
    if (!pageExists) {
      return { success: false, error: "Page not found or you don't have permission" };
    }
    
    // Update the page with the new URL
    await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        url: url,
        updatedAt: new Date(),
      },
    });
    
    // Revalidate the page to reflect changes
    revalidatePath(`/pages/${pageId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error adding link to page:", error);
    return { success: false, error: "Failed to add link" };
  }
} 