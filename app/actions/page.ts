"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function extractTitleFromHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : url;
    
    return title;
  } catch (error) {
    console.error("Error extracting title:", error);
    return url;
  }
}

async function extractTitleFromUrl(url: string): Promise<string> {
  return await extractTitleFromHtml(url);
}


export async function addLinkToPage(url: string, pageId: string) {
  try {
    if (!url || !url.trim()) {
      return { success: false, error: "URL cannot be empty" };
    }

    const cleanUrl = url.trim();
    const title = await extractTitleFromUrl(cleanUrl);

    // Create a new page if pageId is not provided
    if (!pageId) {
      const newPage = await prisma.page.create({
        data: {
          title,
          url: cleanUrl,
          user: {
            connect: {
              id: 'b5a80bbe-c649-4dcd-bd86-53dd4cdc9232',
            },
          },
        },
      });
      revalidatePath(`/summarize`);
      return { success: true, pageId: newPage.id };
    }

    // Update existing page
    await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        title,
        url: cleanUrl,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/summarize`);
    return { success: true };
  } catch (error) {
    console.error("Error adding link to page:", error);
    return { success: false, error: "Failed to add link" };
  }
} 