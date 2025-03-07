"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addLinkToPage(url: string, pageId: number) {
  try {
    
    if (!url || !url.trim()) {
      return { success: false, error: "URL cannot be empty" };
    }
    

    const pageExists = await prisma.page.findFirst({
      where: {
        id: pageId,
      },
    });
    
    if (!pageExists) {
      return { success: false, error: "Page not found or you don't have permission" };
    }
    
    await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        url: url,
        updatedAt: new Date(),
      },
    });
    

    revalidatePath(`/summarize/${pageId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error adding link to page:", error);
    return { success: false, error: "Failed to add link" };
  }
} 