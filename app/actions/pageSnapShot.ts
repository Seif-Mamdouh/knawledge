"use server";

import prisma from "@/lib/prisma";

export async function createPageSnapshot(pageId: string, url: string, title: string) {
  try {
    const response = await fetch(url);
    const rawHtml = await response.text();
    const cleanHtml = rawHtml.replace(/<[^>]*>?/g, '');

    const pageSnapshot = await prisma.pageSnapShots.create({
      data: {
        page_id: pageId,
        title: title,
        raw_html: rawHtml,
        cleaned_html: cleanHtml,
        markdown_id: crypto.randomUUID(),
      },
    });

    return { success: true, snapshotId: pageSnapshot.page_snapshot_id };
  } catch (error) {
    console.error("Error creating page snapshot:", error);
    return { success: false, error: "Failed to create page snapshot" };
  }
}
