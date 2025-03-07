"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createPageSnapshot } from "./pageSnapShot";

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
    // First, let's verify the user exists
    const user = await prisma.users.findUnique({
      where: {
        id: 'b5a80bbe-c649-4dcd-bd86-53dd4cdc9232'
      }
    });

    console.log("Found user:", user);

    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    if (!url || !url.trim()) {
      return { success: false, error: "URL cannot be empty" };
    }

    const cleanUrl = url.trim();
    const title = await extractTitleFromUrl(cleanUrl);

    // Create a new page if pageId is not provided
    if (!pageId) {
      console.log("Creating new page with data:", {
        title,
        url: cleanUrl,
        userId: user.id
      });

      try {
        const newPage = await prisma.$transaction(async (prisma) => {
          const page = await prisma.page.create({
            data: {
              title: title,
              url: cleanUrl,
              userId: user.id,
            },
            include: {
              user: true // Include user data in the response
            }
          });
          
          console.log("Created page:", page);
          return page;
        });

        // Create a page snapshot
        await createPageSnapshot(newPage.id, cleanUrl, title);
        revalidatePath(`/summarize`);
        return { success: true, pageId: newPage.id };
      } catch (createError) {
        console.error("Detailed create error:", createError);
        return { success: false, error: `Failed to create page: ${createError.message}` };
      }
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
    console.error("Detailed error:", error);
    return { success: false, error: "Failed to add link" };
  }
}

